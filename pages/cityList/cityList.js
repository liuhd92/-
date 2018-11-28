// pages/demo/demo.js
//获取应用实例
const app = getApp();
let City = require('../../utils/allcity.js');
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
// 实例化API核心类
var qqMap = new QQMapWX({
  key: app.globalData.qqmap_key
});
Page({

  data: {
    city:City
  },

  bindtap(e){
    console.log(e)
    console.log(e.detail)
    qqMap.geocoder({
      address: e.detail.name,
      success: function (res) {
        console.log(res);
        if(res.message == 'query ok'){
          // var pages = getCurrentPages();//当前页面栈
          // if (pages.length > 1){
          //   var beforPage = pages[pages.length-2]; // 活的上一个页面实例对象
          //   beforPage.localLocation(res.result.location.lat, res.result.location.lng);
          // }
          wx.setStorageSync('fromaddress_lat', res.result.location.lat)
          wx.setStorageSync('fromaddress_lng', res.result.location.lng)


          wx.navigateBack({
            // url: '../index/index?lat=' + res.result.location.lat + '&lng=' + res.result.location.lng,
            url: '../index/index',
          })
        }
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
  },
  input(e){
    this.value = e.detail.value
  },
  searchMt(){
    // 当没有输入的时候，默认inputvalue 为 空字符串，因为组件 只能接受 string类型的 数据 
    if(!this.value){
      this.value = '';
    }
    this.setData({
      value:this.value
    })
  },
  chooseAddress: function (e) {
    wx.chooseAddress({
      success: function (res) {
        console.log(res)
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
  },
  
})