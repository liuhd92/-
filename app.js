//app.js
import paotui from './api/paotui.js'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.checkSession({
      success: res => {
        wx.setStorageSync('login_status', 'success');
      },
      fail: res => {
        if (res.errMsg == 'checkSession:fail Error: session time out, need relogin'){
          wx.login({
            success: function(res){
              var pt = new paotui();
              pt.userLogin(res.code)
              .then(res => {
                console.log('登录成功');
                console.log(res)
                wx.setStorageSync('login_status', 'success');
                wx.setStorageSync('openid', res.openid);
                wx.setStorageSync('session_key', res.session_key);
              })
              .catch(res => {
                console.log('登录失败');
                wx.setStorageSync('login_status', 'fail');
                console.log(res);
              })
              // 
              // paotui.
              // console.log('login success');
              // console.log(res)
            },
            fail: res => {
              wx.setStorageSync('login_status', 'fail');
            }
          })
        }
        
      }
    })
    

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            },
            fail: res => {
              console.log(res)
            },
            complete: res => {
              console.log('----------------------');
              console.log(res)
            }
          })
        }
      }
    })
  },

  globalData: {
    userInfo: null,
    login_status: wx.getStorageSync('login_status'),
    phone_status: wx.getStorageSync('phone_status'),
    qqmap_key: 'Z7SBZ-FZS6F-AVFJL-JNYVG-FTMQ2-5XF4N',
    base_price: 3,
  },
  // 定义一个类型为paotui的属性并且实例化
  paotui: new paotui()
})