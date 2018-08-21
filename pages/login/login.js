// pages/login/login.js
var wxApi = require("../../utils/util.js");
//var hex_md5 = require("../../utils/md5.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      phoneNumber:'',  //电话号码
      password:'',     //密码
      phoneTitle:'请输入正确的手机号',
      passwordTitle:'请输入8-16位字母或数字',
      networkType:true,
      netTitle:'主人，您目前的网络好像不太好呢~～',  //无网络提示
      isLogin:false   //是否正在登录
  },

    //键盘输入时触发
    phoneInputChange:function (e) {
        var that = this;
        that.data.phoneNumber = e.detail.value;
        console.log(that.data.phoneNumber);
        that.setData({
            phoneNumber:that.data.phoneNumber
        })
    },
    passwordInputChange:function (e) {
        var that = this;
        that.data.password = e.detail.value;
        console.log(that.data.password);
        that.setData({
            password:that.data.password
        })
    },
    //删除所填号码
    delPhone:function () {
      var that = this;
      that.setData({
          phoneNumber:''
      })
    },
    //删除所填密码
    delPassword:function () {
        var that = this;
        that.setData({
            password:''
        })
    },
    //忘记密码
    onForgetPw:function () {
        wx.navigateTo({
            url: '/pages/forgetPassword/forgetPassword'
        })
    },
    //点击登录
    onLogin:function () {
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
                var phoneReg = /^(13[0-9]|14[579]|15[0-35-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
                var phoneValue = that.data.phoneNumber,user_tel = that.data.phoneNumber;
                var passReg = /[0-9a-z]{8,16}/i;
                var passwordValue = that.data.password,password = that.data.password;
                //console.log(hex_md5.hexMD5(password));
                //判断手机号和密码是否为空
                if (phoneValue.length === 0 ||passwordValue.length === 0) {
                    return;
                }
                //判断手机号格式是否正确
                if (!phoneReg.test(phoneValue)){
                    wxApi.getShowToast(that.data.phoneTitle);
                    return;
                }
                //判断密码格式是否正确
                if (!passReg.test(passwordValue)){
                    wxApi.getShowToast(that.data.passwordTitle);
                    return;
                }

                that.setData({
                    isLogin:true
                })
                wxApi.loginUrl({
                    method:'POST',
                    header:{
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data:{user_tel,password},
                    success:function (res) {
                        console.log(res.data.code);
                        if (res.data.code == 1) {
                            var message = res.data.message;
                            console.log(message);
                            that.setData({
                                isLogin:false
                            })
                            wxApi.getShowToast(message);
                            wx.navigateTo({
                                url: '/pages/mymsg/mymsg'
                            })
                        }
                    },
                    fail:function (res) {
                        console.log(res);
                        that.setData({
                            networkType:true,
                            isLogin:false
                        })
                    }
                })
            }
        })


    },
    //微信登录
    onWechat:function () {

    },
    //立即注册
    onRegister:function () {
        wx.navigateTo({
            url: '/pages/register/register'
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
