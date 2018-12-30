const app = getApp();
Page({
  data: {
    staticImg: app.globalData.staticImg,
    current: 0,
    good: {
      attitude_good: false,
      time_good: false,
      professional_good: false,
      efficiency_good: false,
      again_good: false,
      keepon_good: false,
      all_weather_good: false,
      warmth_good: false,
    },
    middle: {
      attitude_middle: false,
      efficiency_middle: false,
      rid_attitude_middle: false,
      arrival_middle: false,
      time_middle: false,
      packaging_good: false,
      packaging_middle: false,
      rid_attitude_bad: false,
    },
    bad: {
      attitude_bad: false,
      time_bad: false,
      professional_bad: false,
      efficiency_bad: false,
      again_bad: false,
      packaging_bad: false,
    },
    
    environment_good: false,
    userStars: [
      "images/star.png",
      "images/star.png",
      "images/star.png",
      "images/star.png",
      "images/star.png",
    ],
    wjxScore: 5,
    // textarea
    min: 5,//最少字数
    max: 300, //最多字数 (根据自己需求改变) 
    pics: [],
    pj_face: 0,
  },

  // 星星点击事件
  starTap: function (e) {
    console.log(e)
    var that = this;
    var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
    var tempUserStars = this.data.userStars; // 暂存星星数组
    var len = tempUserStars.length; // 获取星星数组的长度
    for (var i = 0; i < len; i++) {
      if (i <= index) { // 小于等于index的是满心
        tempUserStars[i] = "images/star.png";
        that.setData({
          wjxScore: i + 1,
        })
      } else { // 其他是空心
        tempUserStars[i] = "images/wjx.png"
      }
    }
    // 重新赋值就可以显示了
    that.setData({
      userStars: tempUserStars
    })
  },


  change_color: function(e) {
    let that = this;
    var pj_face = e.currentTarget.dataset.id;
    that.setData({pj_face: pj_face})
  },

  // 标签
  label: function (e) {
    var that = this;
    switch(e.currentTarget.dataset.tag) {
      case 'attitude_good':
        that.setData({
          "good.attitude_good": !e.currentTarget.dataset.index
        })
        break;
      case 'time_good':
        that.setData({
          "good.time_good": !e.currentTarget.dataset.index
        })
        break;
      case 'professional_good':
        that.setData({
          "good.professional_good": !e.currentTarget.dataset.index
        })
        break;
      case 'efficiency_good':
        that.setData({
          "good.efficiency_good": !e.currentTarget.dataset.index
        })
        break;
      case 'again_good':
        that.setData({
          "good.again_good": !e.currentTarget.dataset.index
        })
        break;
      case 'keepon_good':
        that.setData({
          "good.keepon_good": !e.currentTarget.dataset.index
        })
        break;
      case 'all_weather_good':
        that.setData({
          "good.all_weather_good": !e.currentTarget.dataset.index
        })
        break;
      case 'warmth_good':
        that.setData({
          "good.warmth_good": !e.currentTarget.dataset.index
        })
        break;
    }

    var good = that.data.good;
    var tag = {};
    for (var i in good) {
      // console.log(i+' : '+middle[i])
      if (good[i] == true) {
        tag[i] = true;
      }
    }
    that.setData({
      tag: tag
    })
  },

  label1: function (e) {

    var that = this;
    switch (e.currentTarget.dataset.tag) {
      case 'attitude_middle':
        that.setData({
          "middle.attitude_middle": !e.currentTarget.dataset.index
        })
        break;
      case 'efficiency_middle':
        that.setData({
          "middle.efficiency_middle": !e.currentTarget.dataset.index
        })
        break;
      case 'rid_attitude_middle':
        that.setData({
          "middle.rid_attitude_middle": !e.currentTarget.dataset.index
        })
        break;
      case 'arrival_middle':
        that.setData({
          "middle.arrival_middle": !e.currentTarget.dataset.index
        })
        break;
      case 'time_middle':
        that.setData({
          "middle.time_middle": !e.currentTarget.dataset.index
        })
        break;
      case 'packaging_good':
        that.setData({
          "middle.packaging_good": !e.currentTarget.dataset.index
        })
        break;
      case 'packaging_middle':
        that.setData({
          "middle.packaging_middle": !e.currentTarget.dataset.index
        })
        break;
      case 'rid_attitude_bad':
        that.setData({
          "middle.rid_attitude_bad": !e.currentTarget.dataset.index
        })
        break;
    }

    var middle = that.data.middle;
    var tag = {};    
    for (var i in middle) {
      // console.log(i+' : '+middle[i])
      if(middle[i] == true) {
        tag[i] = true;
      }
    }
    that.setData({
      tag: tag
    })
  },

  label2: function (e) {
    var that = this;
    switch (e.currentTarget.dataset.tag) {
      case 'attitude_bad':
        that.setData({
          "bad.attitude_bad": !e.currentTarget.dataset.index
        })
        break;
      case 'time_bad':
        that.setData({
          "bad.time_bad": !e.currentTarget.dataset.index
        })
        break;
      case 'professional_bad':
        that.setData({
          "bad.professional_bad": !e.currentTarget.dataset.index
        })
        break;
      case 'efficiency_bad':
        that.setData({
          "bad.efficiency_bad": !e.currentTarget.dataset.index
        })
        break;
      case 'again_bad':
        that.setData({
          "bad.again_bad": !e.currentTarget.dataset.index
        })
        break;
      case 'packaging_bad':
        that.setData({
          "bad.packaging_bad": !e.currentTarget.dataset.index
        })
        break;
    }

    var bad = that.data.bad;
    var tag = {};
    for (var i in bad) {
      // console.log(i+' : '+middle[i])
      if (bad[i] == true) {
        tag[i] = true;
      }
    }
    that.setData({
      tag: tag
    })
  },

  submitReview: function(e) {
    let that = this;
    var star = that.data.wjxScore; // 星级
    var face = that.data.pj_face; // 评价--脸
    var tag = that.data.tag; // 标签内容
    var moreReview = that.data.moreReview; // 评价
    var param = {
      'uid': wx.getStorageSync('user_id'),
      'oid': that.data.order_id,
      'stars': star,
      'type': face,
      'tags': JSON.stringify(tag),
      'content': moreReview
    }
    app.paotui.order_comment(param)
      .then(res => {
        console.log('success');
        if(res.code == 0) {
          wx.showToast({
            title: '评论成功！',
            icon: 'success',
            duration: 2000,
          })
          setTimeout(function() {
            wx.navigateBack({
              url: '../daizhifu/daizhifu?id=' + that.data.order_id
            })
          }, 3000);
          
        }
        console.log(res)
      })
      .catch(res => {
        console.log('fail');
        console.log(res)
      })
    
  },

  giveMoney: function(e) {
    this.setData({
      'give': e.detail.value
    })
  },

  PayOrder: function (t) {
    var that = this;
    var param = {
      'openid': wx.getStorageSync('openid'),
      'oid': that.data.order_id, //订单id
      'body': '打赏骑手',
      'total_fee': that.data.give,
    }

    // 预支付
    app.paotui.wxPreparePay(param)
      .then(res => {
        console.log('success');
        console.log(res);
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
                    wx.navigateTo({
                      url: '../orderProgress/orderProgress?course_id=' + that.data.order_id,
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
 
  // 留言
  //字数限制  
  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最多字数限制
    if (len > this.data.max) return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len, //当前字数  
      moreReview: value // 评价内容
    });
  },
  // 图片
  choose: function (e) {//这里是选取图片的方法
    var that = this;
    var pics = that.data.pics;
    wx.chooseImage({
      count: 5 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {

        var imgsrc = res.tempFilePaths;
        pics = pics.concat(imgsrc);
        console.log(pics);
        // console.log(imgsrc);
        that.setData({
          pics: pics,
          // console.log(pics),
        });
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

  },
  uploadimg: function () {//这里触发图片上传的方法
    var pics = this.data.pics;
    console.log(pics);
    app.uploadimg({
      url: 'https://........',//这里是你图片上传的接口
      path: pics//这里是选取的图片的地址数组
    });
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      'order_id': options.order_id
    })
  },
  // 删除图片
  deleteImg: function (e) {
    var pics = this.data.pics;
    var index = e.currentTarget.dataset.index;
    pics.splice(index, 1);
    this.setData({
      pics: pics
    });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var pics = this.data.pics;
    wx.previewImage({
      //当前显示图片
      current: pics[index],
      //所有图片
      urls: pics
    })
  },
})