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
    scrollData: [
      {
        text: '全部'
      },
      {
        text: '进行中'
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

  },
  onLoad: function (options) {
    this.getOrderList(wx.getStorageSync('user_id'), 0); // 默认展示进行中的订单
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
    }
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