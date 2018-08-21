// pages/forgetPassword/forgetPassword.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      elephone:'',//手机号
      newPass:'', //密码
      codeNum:'',  //验证码
      networkType:true,
      netTitle:'主人，您目前的网络好像不太好呢~～',  //无网络提示
      isLogin:false   //是否正在找回密码
  },
    //填写手机号
    onPhone:function (e) {
        var that = this;
        that.data.elephone = e.detail.value;
        console.log(that.data.elephone);
        that.setData({
            elephone:that.data.elephone
        })

    },
    //填写新密码
    onNewpd:function (e) {
        var that = this;
        that.data.newPass = e.detail.value;
        console.log(that.data.newPass);
        that.setData({
            newPass:that.data.newPass
        })
    },
    //填写验证码
    onObtaincode:function (e) {
        var that = this;
        that.data.codeNum = e.detail.value;
        console.log(that.data.codeNum);
        that.setData({
            codeNum:that.data.codeNum
        })
    },
    //删除所填号码
    delElephone:function () {
        var that = this;
        that.setData({
            elephone:''
        })
    },
    //删除所填新密码
    delPass:function () {
        var that = this;
        that.setData({
            newPass:''
        })
    },
    //删除所填验证码
    delCode:function () {
        var that = this;
        that.setData({
            codeNum:''
        })
    },
    //获取验证码
    onObtainCode:function () {

    },
    //完成
    onComplete:function () {
        var that = this;
        //判断网络类型
        wxApi.getNetworkType().then((res) => {
            let networkType = res.networkType;
            if (networkType === 'none' || networkType === 'unknown') {
                //无网络不进行任何操作
                this.setData({
                    networkType: false
                });
                wxApi.getShowToast(that.data.netTitle);

            }else {
                //有网络

            }
        }).catch((err) =>{
            that.setData({
                networkType: true
            })
        })
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
