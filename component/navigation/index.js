/**
 * 导航组件
 */
Component({
  /**
   * 组件的data
   */
  data: {
    top: 900,//初始显示坐标 单位rpx
    
    tophome:"",
    showNav: false //显示导航
  },
  /**
   * 组件的方法列表
   */
  onload: function (options){
    
  },
  
  methods: {
    move(e) {//移动时触发的方法
      let that = this;
      that.setData({
        top: e.changedTouches[0].pageY,//重置坐标
        // left: e.changedTouches[0].pageX,
        
      })
    },
    navigation(e) {//显示或隐藏导航菜单
      console.log('123');
      var top1 = e.changedTouches[0].pageY;
      console.log(top1);
      this.setData({
        showNav: !this.data.showNav,
        tophome: top1 - 115
      })
    },
    goHome() {
      wx.reLaunch({//菜单功能 回首页
        url: '/pages/index/index'
      })
    },
    goExit() {
      wx.redirectTo({//菜单功能 退出
        url: "/pages/orderList/orderList",
      })
    }
  }
})