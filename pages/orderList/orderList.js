// pages/orderList/orderList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollData: [
      {
        text: '进行中'
      },
      {
        text: '已完成'
      },
      {
        text: '未进行'
      },
      {
        text: '删除'
      },
      {
        text: '全部'
      }
    ],
    currentTab:0,

  },
  onLoad: function (options) {
      
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
    }
  },
  
})