// pages/register/register.js
var wxApi = require("../../utils/util.js")
//var hex_md5 = require("../../utils/md5.js");
var interval = null;  //倒计时
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
      isRegister:false,   //是否正在注册
      code:'获取验证码',
      currentTime:61,
      disabled:false,
      isPhone:false,   //是否显示删除号码按钮
      isPass:false,    //是否显示删除密码按钮
      isCode:false,    //是否显示删除验证码按钮
      pFocus:false,    //号码输入框是否自动聚焦
      mFocus:false,    //密码输入框是否自动聚焦
      cFocus:false,    //验证码输入框是否自动聚焦
  },

    //填写手机号
    onElephone:function (e) {
        var that = this;
        that.data.registerPhone = e.detail.value;
        that.setData({
            registerPhone:that.data.registerPhone,
            isPhone:true
        })
    },
    //填写密码
    onPassword:function (e) {
        var that = this;
        that.data.registerPass = e.detail.value;
        that.setData({
            registerPass:that.data.registerPass,
            isPass:true
        })
    },
    //填写验证码
    onCode:function (e) {
        var that = this;
        that.data.codeNum = e.detail.value;
        that.setData({
            codeNum:that.data.codeNum,
            isCode:true
        })
    },
    //失焦事件
    blurTele:function (e) {
        var that = this;
        that.setData({
            isPhone:false
        })
    },
    blurPw:function (e) {
        var that = this;
        that.setData({
            isPass:false
        })
    },
    blurCd:function (e) {
        var that = this;
        that.setData({
            isCode:false
        })
    },
    //聚焦事件
    focusTele:function (e) {
        var that = this;
        //console.log(e,that.data.elephone);
        if (e.detail.value.length !==0) {
            that.setData({
                isPhone:true
            })
        }
    },
    //聚焦事件
    focusPw:function (e) {
        var that =this;
        //console.log(e,that.data.newPass);
        if (e.detail.value.length !==0) {
            that.setData({
                isPass:true
            })
        }
    },
    focusCd:function (e) {
        var that =this;
        //console.log(e,that.data.codeNum);
        if (e.detail.value.length !==0) {
            that.setData({
                isCode:true
            })
        }
    },
    //删除所填手机号
    delRegisterPhone:function () {
        var that = this;
        that.setData({
            registerPhone:'',
            pFocus:true
        })
    },
    //删除所填密码
    delRegisterPass:function () {
        var that = this;
        that.setData({
            registerPass:'',
            mFocus:true
        })
    },
    //删除所填验证码
    delCodeNum:function () {
        var that = this;
        that.setData({
            codeNum:'',
            cFocus:true
        })
    },
    //验证码接口
    postCode:function () {
        var that = this;
        var user_tel = that.data.registerPhone,sms_temp = 'regist_account';
        wxApi.postCode({
            method:'POST',
            header:{
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data:{user_tel,sms_temp},
            success:function (res) {
                console.log(res,res.data);
                if (res.data.code == 1) {
                    that.getCode();
                    wxApi.getShowToast(res.data.message);
                    return;
                }
                if (res.data.code == 0) {
                    wxApi.getShowToast(res.data.message);
                    that.setData({
                        code:'重新获取',
                        disabled:false
                    })
                    return;
                }
                if (res.data.code == 3) {
                    that.setData({
                        code:'重新获取',
                        disabled:false
                    })
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
    registerObtain:function () {
        var that = this;
        var phoneReg = /^(13[0-9]|14[579]|15[0-35-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        var phoneVal = that.data.registerPhone;
        if (that.data.registerPhone.length===0){
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
                    that.postCode();
                }
            }).catch((err) =>{
                that.setData({
                    networkType: true
                })
            })
        }
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
    onFinish:function () {
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
                var user_tel = that.data.registerPhone,user_password = that.data.registerPass,tel_vcode = that.data.codeNum;
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
                    isRegister:true
                })
                wxApi.postRegister({
                    method:'POST',
                    header:{
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data:{user_tel,user_password,tel_vcode},
                    success:function (res) {
                        console.log(res,res.data);
                        if (res.data.code == 1) {
                            wx.setStorage({
                                key: 'Set-Cookie',
                                data: res.header['Set-Cookie']
                            })
                            var message= res.data.message;
                            that.setData({
                                isRegister:false
                            })
                            wxApi.getShowToast(message);
                            wx.navigateTo({
                                url: '/pages/mymsg/mymsg'
                            });
                            /*wx.navigateBack({
                                delta:3
                            })*/
                        }
                        else if (res.data.code == 0) {
                            var message= res.data.message;
                            that.setData({
                                isRegister:false
                            })
                            wxApi.getShowToast(message);
                        }

                    },
                    fail:function (res) {
                        console.log(res)
                        that.setData({
                            networkType:true,
                            isRegister:false
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
