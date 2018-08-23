// pages/mymsg/mymsg.js
var wxApi = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myFollow: "",//关注数据
    userInfo: [], //用户信息,
    Cookie: ""
  },
  globalData: {},
  //弹出切换账号方法
  switch: function () {
    const pop = this.selectComponent('#switch')
    if (pop) pop.open();
  },
  //点击切换账户
  switchAccount: function (e) {
    this.switch();

  },
  //查看更多
  bindMoreTap: function (e) {
    wx.login({
      success: function (res) {
        console.log(res)
      }
    })

    wx.navigateTo({
      url: './components/more/more'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //判断网络类型
    wxApi.getNetworkType().then((res) => {
      let networkType = res.networkType;
      if (networkType === 'none' || networkType === 'unknown') {
        //无网络不进行任何操作
        this.setData({
          type: "net",
          userInfo: null,
          myFollow: null
        })

      } else {
        //有网络
        that.userFollow();
      }
    }).catch((err) => {
      this.setData({
        type: "server"
      })
    })


  },
  userFollow: function () {
    let that = this, header;
    /** 格式化用户需要的 cookie*/
    let Cookie = wx.getStorageSync("Set-Cookie");
    console.log(Cookie)
    let arr = Cookie.split('=').join(',').split(',');
    let Set_Cookie = 'app_uf=' + arr[1].split(';')[0] + ';' + 'app_us=' + arr[6].split(';')[0] + ';'
    // let Cookies= JSON.parse(Cookie)
    // console.log(typeof(Cookies)  )
    header = {
      'content-type': 'application/x-www-form-urlencoded',
      'cookie': Set_Cookie
    };
    //我的信息
    wxApi.user_info({
      method: "GET",
      header: header,
      success: function (res) {
        var data = res.data.data;
        let site_Image = res.data.site_image ? res.data.site_image : "";
        if (res.data.code == 1) {
          if (data && data.user_avatar && !/^http[s]?:\/\//ig.test(data.user_avatar)) {
            data.user_avatar = site_Image + data.user_avatar;
          }
          that.setData({
            type: null,
            userInfo: data
          })
        }

      },
      fail: function (res) {
        console.log(res);
      }

    })
    // 关注作品
    wxApi.myAttention({
      method: 'GET',
      header: header,
      success: function (res) {
        let siteImage = res.data.site_image ? res.data.site_image : "";
        let comic = res.data.data.comic;
        if (res.data.code == 1) {
          if (comic && comic.hcover && !/^http[s]?:\/\//ig.test(comic.hcover)) {
            comic.hcover = siteImage + comic.hcover;
          }
          that.setData({
            type: null,
            myFollow: comic
          })
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
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