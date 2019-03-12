//获取应用实例
const app = getApp();

//用户登陆状态
const login_status = app.globalData.login_status;
//获取手机号的状态
const phone_status = app.globalData.phone_status;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: [],
    winHeight: "",//窗口高度
    
    scrollData: [
      {
        text: '全部'
      },
      {
        text: '配送中'
      },
      {
        text: '待接单'
      },
      {
        text: '已取消'
      },
      {
        text: '待支付'
      },
      {
        text: '已完成'
      },
      
    ],
    currentTab:0,
    scrollLeft: 0,

  },
  onLoad: function (options) {
    this.getOrderList(wx.getStorageSync('user_id'), 0); // 默认展示配送中的订单
    console.log(options)
    this.getOrderList(wx.getStorageSync('user_id'), 0);
    var that = this;
    // 高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
      
        var calc = clientHeight * rpxR - 180;
        console.log(calc)
        that.setData({
          winHeight: calc,
          
        });
      }
    });
  },

  /**
   * 进入订单详情页
   */
  enterDetailTab: function(e) {
    console.log('点击了进入详情页');
    wx.navigateTo({
      url: '../daizhifu/daizhifu?id=' + e.currentTarget.dataset.id
    })
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  // 点击tag标签效果
  scrollClick:function(e){
    var curscroll = e.currentTarget.dataset.current;
    console.log(curscroll)
    if (this.data.currentTab == curscroll){
      return false;
      
    }else{
      this.setData({
        currentTab: curscroll
      })
      this.getOrderList(wx.getStorageSync('user_id'), curscroll);
      this.checkCor();
    }
  },

  /**
   * 再来一单
   */
  buyOneMore: function (e) {
    console.log(e)
    // 获取订单详情
    let that = this;
    app.paotui.getOrderDetail(e.currentTarget.dataset.id)
      .then(res => {
        console.log(res)
        console.log(e.currentTarget.dataset.id)
        if (res.code == 0) {
          var res = res.data;
          // 数据入缓存
          var from_user = { 'detailInfo': res.detail.from_address, 'userName': res.detail.from_user, 'telNumber': res.detail.from_phone }
          wx.setStorageSync('fromaddress_detail', JSON.stringify(from_user))
          var to_user = { 'detailInfo': res.detail.to_address, 'userName': res.detail.to_user, 'telNumber': res.detail.to_phone }
          wx.setStorageSync('toaddress_detail', JSON.stringify(to_user))
          wx.setStorageSync('toaddress_lat', res.detail.to_latitude)
          wx.setStorageSync('toaddress_lng', res.detail.to_longitude)
          wx.setStorageSync('fromaddress_lat', res.detail.from_latitude)
          wx.setStorageSync('fromaddress_lng', res.detail.from_longitude)
          wx.setStorageSync('qsj_weight', res.detail.goods[1] == '小于1' ? 1 : res.detail.goods[1])
          wx.setStorageSync('qsj_name', res.detail.goods[0])
          wx.setStorageSync('qsj', res.detail.detail_info)
          wx.setStorageSync('tip_price', parseInt(res.detail.tip_price))
          wx.setStorageSync('remark', res.detail.remark)
          wx.setStorageSync('from_time', res.detail.from_time_hi)

        }
      })
      .catch(res => {

      })


    wx.navigateTo({
      url: '../orderConfirm/orderConfirm?id=' + that.data.id
    })
  },
  
  // 获取订单列表
  getOrderList: function (uid, status) {

    app.paotui.getOrderList(uid, status)
      .then(res => {
        console.log(res.data)
        if (res.code == 0){
          this.setData({
            'orderInfo': res.data
          });
        } else if (res.code == 10314){
          wx.showToast({
            title: '暂无',
          })
          this.setData({
            'orderInfo': []
          })
        }
        console.log('订单列表获取成功');
        console.log(res);
      })
      .catch(res => {
        console.log('订单列表获取失败');
        console.log(res);
      })
  },

  /**
     * 取消订单
     */
  cancelOrder: function () {
    let that = this;
    wx.showModal({
      title: '警告！',
      content: '您确定要取消该订单吗？',
      showCancel: true,
      cancelText: '否',
      confirmText: '是',
      success: function (res) {
        if (res.confirm) {
          that.setOrderDisabled(that.data.id, 3);
        } else {
          return false;
        }
      }
    })
  },

  // payMoney: function(e) {
  //   console.log(e)
  //   console.log('去支付了');
  //   let that = this;
  //   that.changeOrderStatus(e.currentTarget.dataset.id, 2);
  // },

  // /**
  //  * 修改订单状态为已支付
  //  */
  // changeOrderStatus: function (id, status) {
  //   app.paotui.changeOrderStatus(id, status)
  //     .then(res => {
  //       this.setData({
  //         'orderDetail.order_status': '3'
  //       })
  //     })
  //     .catch(res => {
  //       console.log('修改失败')
  //       console.log(res)
  //     })
  // },

  // 下拉刷新
  onPullDownRefresh: function(){
    console.log(this.data)
    app.paotui.getOrderList(wx.getStorageSync('user_id'), this.data.currentTab)
      .then(res => {
        console.log(res.data)
        if (res.code == 0) {
          this.setData({
            'orderInfo': res.data
          });
        }
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      })
      .catch(res => {
        console.log('订单列表获取失败');
        console.log(res);
      })

    console.log(this)
    

  }
})