// pages/forgetPassword/forgetPassword.js
var wxApi = require("../../utils/util.js");
//var hex_md5 = require("../../utils/md5.js");
var interval = null;  //倒计时
Page({

  /**
   * 页面的初始数据
   */
  data: {
      elephone:'',//手机号
      newPass:'', //密码
      codeNum:'',  //验证码
      phoneTitle:'请输入正确的手机号',
      passwordTitle:'请输入8-16位字母或数字',
      networkType:true,
      netTitle:'主人，您目前的网络好像不太好呢~～',  //无网络提示
      isRetrieve:false,   //是否正在找回密码
      code:'获取验证码',
      currentTime:61,
      disabled:false,
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
    //验证码接口
    postCode:function () {
      var that = this;
      var user_tel = that.data.elephone,sms_temp = 'change_password';
        wxApi.postCode({
            method:'POST',
            header:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data:{user_tel,sms_temp},
            success:function (res) {
                console.log(res,res.data);
                if (res.data.code == 1) {
                    wxApi.getShowToast(res.data.message);
                    return;
                }
                if (res.data.code == 0) {
                    wxApi.getShowToast(res.data.message);
                    return;
                }
                if (res.data.code == 3) {
                    wxApi.getShowToast(res.data.message);
                    return;
                }

            },
            fail:function (res) {
                console.log(res)
            }
        })
    },
    //获取验证码倒计时
    getCode:function (options) {
        var that = this;
        var currentTime = that.data.currentTime;
        that.postCode();
        interval = setInterval(function () {
            currentTime--;
            that.setData({
                code:'重新发送'+'('+currentTime+')'
            })
            if (currentTime <=0){
                clearInterval(interval);
                that.setData({
                    code:'重新获取',
                    currentTime:61,
                    disabled:false
                })
            }
        },1000)
    },
    //获取验证码事件
    onObtainCode:function (e) {
        var that = this;
        var phoneReg = /^(13[0-9]|14[579]|15[0-35-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        var phoneVal = that.data.elephone;
        if (that.data.elephone.length===0){
            that.setData({
                disabled:false
            })
        }else {
            //判断网络类型
            //判断手机号格式是否正确
            if (!phoneReg.test(phoneVal)){
                wxApi.getShowToast(that.data.phoneTitle);
                return;
            }
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
                    that.setData({
                        disabled:true
                    })
                    that.getCode();
                }
            }).catch((err) =>{
                that.setData({
                    networkType: true
                })
            })
        }

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
                var phoneReg = /^(13[0-9]|14[579]|15[0-35-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
                var user_tel = that.data.elephone,tel_vcode = that.data.codeNum,user_password = that.data.newPass;
                var passReg = /[0-9a-z]{8,16}/i;
                //判断手机号和密码是否为空
                if (user_tel.length === 0 ||user_password.length === 0 || tel_vcode.length === 0) {
                    return;
                }
                //判断手机号格式是否正确
                if (!phoneReg.test(user_tel)){
                    wxApi.getShowToast(that.data.phoneTitle);
                    return;
                }
                //判断密码格式是否正确
                if (!passReg.test(user_password)){
                    wxApi.getShowToast(that.data.passwordTitle);
                    return;
                }
                that.setData({
                    isRetrieve:true
                })
                wxApi.modifyPassword({
                    method:'POST',
                    header:{
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data:{user_tel,tel_vcode,user_password},
                    success:function (res) {
                        console.log(res,res.data);
                        if (res.data.code == 1) {
                            var message= res.data.message;
                            that.setData({
                                isRetrieve:false
                            })
                            wxApi.getShowToast(message);
                            wx.navigateTo({
                                url: '/pages/mymsg/mymsg'
                            })
                        }
                        else if (res.data.code == 0) {
                            var message= res.data.message;
                            that.setData({
                                isRetrieve:false
                            })
                            wxApi.getShowToast(message);
                        }

                    },
                    fail:function (res) {
                        console.log(res)
                        that.setData({
                            networkType:true,
                            isRetrieve:false
                        })
                    }
                })

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
