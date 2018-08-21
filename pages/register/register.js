// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      registerPhone:'', //手机号
      registerPass:'',  //密码
      codeNum:'',  //验证码
      isCheck:true,
      phoneTitle:'请输入正确的手机号',
      passwordTitle:'请输入8-16位字母或数字',
      networkType:true,
      netTitle:'主人，您目前的网络好像不太好呢~～',  //无网络提示
      isLogin:false   //是否正在注册
  },

    //填写手机号
    onElephone:function (e) {
        var that = this;
        that.data.registerPhone = e.detail.value;
        that.setData({
            registerPhone:that.data.registerPhone
        })
    },
    //填写密码
    onPassword:function (e) {
        var that = this;
        that.data.registerPass = e.detail.value;
        that.setData({
            registerPass:that.data.registerPass
        })
    },
    //填写验证码
    onCode:function (e) {
        var that = this;
        that.data.codeNum = e.detail.value;
        that.setData({
            codeNum:that.data.codeNum
        })
    },
    //删除所填手机号
    delRegisterPhone:function () {
        var that = this;
        that.setData({
            registerPhone:''
        })
    },
    //删除所填密码
    delRegisterPass:function () {
        var that = this;
        that.setData({
            registerPass:''
        })
    },
    //删除所填验证码
    delCodeNum:function () {
        var that = this;
        that.setData({
            codeNum:''
        })
    },
    //获取验证码
    registerObtain:function () {

    },
    //点击选中or不选中
    onImage:function () {
        this.setData({
            isCheck:!this.data.isCheck
        })
    },
    //协议
    onAgreement:function () {
        wx.navigateTo({
            url: '/pages/agreement/agreement'
        })
    },
    //完成
    onComplete:function () {

    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
