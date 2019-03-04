//获取应用实例
const app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
var qqMap = new QQMapWX({
  key: app.globalData.qqmap_key
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mapData: {
      lng: 116.29845,
      lat: 39.95933
    },
    scale: 13,
    markers: [],

    orderDetail: [],
    id: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'id': options.id
    })
    this.getOrderDetail(options.id)
    
  },

/**
 * 订单详情
 */
  getOrderDetail: function(id) {
    let that = this;
    app.paotui.getOrderDetail(id)
      .then(res => {
        console.log(res)
        if (res.code == 0) {
          this.setData({
            orderDetail: res.data
          })
          if(res.data.order_status == 4) {
            this.countDown();

            var markers = this.data.markers;
            markers.push({
              'id': 1,
              'latitude': res.data.detail.from_latitude,
              'longitude': res.data.detail.from_longitude,
              'iconPath': "/imgs/send.png",
              'width': 35,
              'height': 40
            },
            {
              'id': 2,
              'latitude': res.data.detail.to_latitude,
              'longitude': res.data.detail.to_longitude,
              'iconPath': "/imgs/receive.png",
              'width': 35,
              'height': 40
            });

          this.setData({
            markers: markers
          })


            // 调用接口
            qqMap.calculateDistance({
              mode: 'walking', //步行，驾车为'driving'  walking'; , { latitude: blat,      longitude: blon    } 
              from: {
                latitude: res.data.detail.from_latitude,
                longitude: res.data.detail.from_longitude
              },
              to: [{
                latitude: res.data.detail.to_latitude,
                longitude: res.data.detail.to_longitude
              }],
              success: function (res) {
                if (res.message == "query ok") {

                  var distance = res.result.elements["0"].distance;
                  var beishu = distance / 1000;
                  that.setData({
                    'distance': beishu,
                    '_distance': beishu.toFixed(1),
                    'distance_cal': parseInt(beishu)
                  })
                  var scale = that.data.scale;
                  if (beishu > 100 && beishu <= 1000) {
                    scale = 3
                  } else if (beishu > 30 && beishu <= 100) {
                    scale = 5
                  } else if (beishu > 20 && beishu <= 30) {
                    scale = 7
                  } else if (beishu > 10 && beishu <= 20) {
                    scale = 10
                  } else {
                    scale = 15
                  }
                  that.setData({
                    scale: scale
                  })
                }
              },
              fail: function (res) {
                // console.log(res);
              },
              complete: function (res) {
                // console.log(res);
              }
            });
          } else {
            
          }
          
        }        
      })
      .catch(res => {

      })
  },

  PayOrder: function (t) {
    var data = this.data;
    console.log(data);

    var that = this;
    var param = {
      'openid': wx.getStorageSync('openid'),
      'oid': that.data.id, //订单id
      'body': data.orderDetail.detail.detail_info,
      'total_fee': parseFloat(data.orderDetail.detail.base_price) + parseFloat(data.orderDetail.detail.tip_price) + parseFloat(data.orderDetail.detail.weight_price) + parseFloat(data.orderDetail.detail.distance_price),
      'type': 1,
    }


    // 预支付
    app.paotui.wxPreparePay(param)
      .then(res => {
        console.log('success');
        console.log(res);
        if (res.result == 'fail') {
          wx.showToast({
            title: '支付环境异常或者重复支付',
            icon: 'none'
          })
          return false;
        }
        if (res.data.data.return_msg == 'OK') {
          // 支付
          app.paotui.wxPay(res.data.data.prepay_id)
            .then(res_pay => {
              console.log('success1');
              console.log(res_pay);
              wx.requestPayment({
                timeStamp: res_pay.timeStamp + '',
                nonceStr: res_pay.nonceStr,
                package: res_pay.package,
                signType: res_pay.signType,
                paySign: res_pay.paySign,
                success: function (res) {
                  console.log('-----------------')
                  console.log(res)
                  wx.navigateTo({
                    url: '../orderList/orderList?uid=' + wx.getStorageSync('user_id')
                  })
                }
              })
            })
            .catch(res_pay => {
              console.log('fail');
              console.log(res_pay);
            })
        }
      })
      .catch(res => {
        console.log('fail');
        console.log(res);
      })
  },

  /**
   * 修改订单状态为已取消
   */
  changeOrderStatus: function(id, status) {
    app.paotui.changeOrderStatus(id, status)
      .then(res => {
        this.setData({
          'orderDetail.order_status': '3'
        })
      })
      .catch(res => {
        console.log('修改失败')
        console.log(res)
      })
  },

  /**
   * 再来一单
   */
  buyOneMore: function() {
    console.log('12345');
    var res = this.data.orderDetail;
    console.log(res)
    var from_user = { 'detailInfo': res.detail.from_address, 'userName': res.detail.from_user, 'telNumber': res.detail.from_phone }
    wx.setStorageSync('fromaddress_detail', JSON.stringify(from_user))
    var to_user = { 'detailInfo': res.detail.to_address, 'userName': res.detail.to_user, 'telNumber': res.detail.to_phone }
    wx.setStorageSync('toaddress_detail', JSON.stringify(to_user))
    wx.setStorageSync('toaddress_lat', res.detail.to_latitude)
    wx.setStorageSync('toaddress_lng', res.detail.to_longitude)
    wx.setStorageSync('fromaddress_lat', res.detail.from_latitude)
    wx.setStorageSync('fromaddress_lng', res.detail.from_longitude)
    var weight = res.detail.goods[1];
    if (weight.indexOf("小于") != -1) {
      weight = 1
    }
    wx.setStorageSync('qsj_weight', weight)
    wx.setStorageSync('qsj_name', res.detail.goods[0])
    wx.setStorageSync('qsj', res.detail.detail_info)
    wx.setStorageSync('tip_price', parseInt(res.detail.tip_price))
    wx.setStorageSync('remark', res.detail.remark)
    wx.setStorageSync('from_time', res.detail.from_time_hi)

    wx.navigateTo({
      url: '../orderConfirm/orderConfirm?id=' + this.data.id
    })
  },
  goComment: function() {
    let that = this;
    wx.navigateTo({
      url: "../orderProgress/orderProgress?order_id=" + that.data.id
    });
  },
  /**
   * 取消订单
   */
  cancelOrder: function() {
    let that = this;
    wx.showModal({
      title: '警告！',
      content: '您确定要取消该订单吗？',
      showCancel: true,
      cancelText: '否',
      confirmText: '是',
      success: function(res) {
        if(res.confirm) {
          that.changeOrderStatus(that.data.id, 3);
        } else {
          return false;
        }
      }
    })
  },
  makePhoneCall: function(e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone // 骑手电话
    })
  },
  // 倒计时
  countDown: function () {
    let that = this;
    var now = Date.parse(new Date()) / 1000; 
    var order_create_time = that.data.orderDetail.create_time;
    var disabled_time = that.data.orderDetail.create_time + 900; // 失效时间

    let countDownNum = 900-(now-order_create_time);
    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面
    that.setData({
      timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量
          
        //每隔一秒countDownNum就减一，实现同步
        countDownNum--;
        //然后把countDownNum存进data，好让用户知道时间在倒计着
        that.setData({
          countDownNum: that.formatSeconds(countDownNum)
        })
        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来
        if (countDownNum <= 0) {
          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能
          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭
          clearInterval(that.data.timer);
          //关闭定时器之后，将当前订单的状态置为已取消
          that.changeOrderStatus(that.data.id, 3);
        }    
      }, 1000)
    })
    
  },

  formatSeconds: function (value) {
    var secondTime = parseInt(value);// 秒
    var minuteTime = 0;// 分
    var hourTime = 0;// 小时
    if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
      //获取分钟，除以60取整数，得到整数分钟
      minuteTime = parseInt(secondTime / 60);
      //获取秒数，秒数取佘，得到整数秒数
      secondTime = parseInt(secondTime % 60);
      //如果分钟大于60，将分钟转换成小时
      if (minuteTime > 60) {
        //获取小时，获取分钟除以60，得到整数小时
        hourTime = parseInt(minuteTime / 60);
        //获取小时后取佘的分，获取分钟除以60取佘的分
        minuteTime = parseInt(minuteTime % 60);
      }
    }
      var result = "" + parseInt(secondTime) + "秒";

      if (minuteTime > 0) {
        result = "" + parseInt(minuteTime) + "分" + result;
      }
      if (hourTime > 0) {
        result = "" + parseInt(hourTime) + "小时" + result;
      }
      return result;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})