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
        console.log('success------')
        console.log('check session success');
        console.log(res)
        wx.setStorageSync('login_status', 'success');
      },
      fail: res => {
        console.log('fail------')
        console.log('check session fail');
        console.log(res)
        if (res.errCode == '-13001' || res.errMsg == 'checkSession:fail Error: session time out, need relogin' || res.errMsg == 'checkSession:fail session time out, need relogin'){
          console.log(res)
          wx.login({
            success: function(res){
              console.log('login success')
              console.log(res)
              var pt = new paotui();
              pt.userLogin(res.code)
              .then(res => {
                console.log('登录成功');
                console.log(res)
                wx.setStorageSync('login_status', 'success');
                wx.setStorageSync('openid', res.openid);
                wx.setStorageSync('session_key', res.session_key);
                console.log(wx.getStorageSync('openid'));
                console.log(res.openid)
                pt.firstOrder(res.openid)
                  .then(res => {
                    wx.setStorageSync('first_order', res.data.msg);
                    console.log(res)
                  })
                  .catch(res => {
                    console.log(res);
                  })
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
              console.log('login fail');
              console.log(res)
              wx.setStorageSync('login_status', 'fail');
            },
            complete: res => {
              console.log('login done');
              console.log(res)
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
    base_price: 2,
    kf_phone: '17558828866',
    phone_status: false,
    // promote_url: 'http://www.paotui.org/api/promote/booth',
    promote_url: 'https://www.caccqc.cn/api/promote/booth',
  },

  // 定义一个类型为paotui的属性并且实例化
  paotui: new paotui()
})