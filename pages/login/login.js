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
      isLogin:false,   //是否正在登录
      isPhone:false,   //是否显示删除号码按钮
      isPass:false,    //是否显示删除密码按钮
      pFocus:false,    //号码输入框是否自动聚焦
      mFocus:false,    //密码输入框是否自动聚焦
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      comic_id:"",
      chapter_name:"",
      chapter_id:"",
      Setfollow:null,
  },

    //键盘输入时触发
    phoneInputChange:function (e) {
        var that = this;
        that.data.phoneNumber = e.detail.value;
        console.log(that.data.phoneNumber);
        that.setData({
            phoneNumber:that.data.phoneNumber,
            isPhone:true
        })
    },
    passwordInputChange:function (e) {
        var that = this;
        that.data.password = e.detail.value;
        console.log(that.data.password);
        that.setData({
            password:that.data.password,
            isPass:true
        })
    },
    //失焦事件
    blurPhone:function (e) {
        var that = this;
        that.setData({
            isPhone:false
        })
    },
    blurPass:function (e) {
        var that = this;
        that.setData({
            isPass:false
        })
    },
    //聚焦事件
    focusPhone:function (e) {
        var that = this;
        //console.log(e,that.data.phoneNumber);
        if (e.detail.value.length !==0) {
            that.setData({
                isPhone:true
            })
        }
    },
    focusPass:function (e) {
        var that =this;
        //console.log(e,that.data.password);
        if (e.detail.value.length !==0) {
            that.setData({
                isPass:true
            })
        }
    },

    //删除所填号码
    delPhone:function () {
      var that = this;
      that.setData({
          phoneNumber:'',
          pFocus:true
      })
    },
    //删除所填密码
    delPassword:function () {
        var that = this;
        that.setData({
            password:'',
            mFocus:true
        })
    },
    //忘记密码
    onForgetPw:function () {
        wx.redirectTo({
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
                        console.log(res,res.data);
                        if (res.data.code == 1) {
                            wx.setStorage({
                                key: 'Set-Cookie',
                                data: res.header['Set-Cookie']
                            })
                            var message = res.data.message;
                            console.log(message);
                            that.setData({
                                isLogin:false
                            })
                            wxApi.getShowToast(message);

                            let {comic_id,chapter_name,Setfollow,chapter_id}=that.data;
                            let pages = getCurrentPages();//当前页面
                            let prevPage = pages[pages.length-2];//上一页面
<<<<<<< HEAD

                           if(comic_id &&  chapter_name &&　btnLog ){
                                // prevPage.setData({//直接给上移页面赋值
                                //   SetbtnLog: 2,
                                // });
=======
                           
                           if(comic_id && chapter_name && Setfollow ){
                                prevPage.setData({//直接给上移页面赋值
                                  Setfollow: 2,
                                });
>>>>>>> feature_six
                                wx.navigateBack({
                                  delta:1
                                })
                             }
                            else if(comic_id ||  chapter_name || chapter_id){
                                wx.navigateBack({
                                  delta:1
                                })
<<<<<<< HEAD
                           }else if(comic_id &&  chapter_name ){

                                prevPage.setData({//直接给上移页面赋值
                                  Setfollow: 2,
                                });
                                wx.navigateBack({
                                  delta:1
                                  // url: '/pages/details/details?comic_id='+comic_id + '&comic_name='+chapter_name + '&follow=2'
=======
                            }
                            else{
                                wx.redirectTo({
                                  url: '/pages/mymsg/mymsg'
>>>>>>> feature_six
                                })
                            }

                         }else if (res.data.code == 0) {
                            var message = res.data.message;
                            console.log(message);
                            that.setData({
                                isLogin:false
                            })
                            wxApi.getShowToast(message);
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
        }).catch((err) =>{
            that.setData({
                networkType: true
            })
        })


    },
    //获取用户授权信息
    getUserInfo:function () {
        // 查看是否授权
        wx.getSetting({
            success: function(res){
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        withCredentials:true,
                        success: function(res) {
                            console.log(res)
                        }
                    })
                }
            }
        })
    },
    //获取 access_token
    getAccessToken:function () {
        var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET';
        var grant_type = 'client_credential',appid = 'wx67d874436ca14559',secret='5935d5c40e34b474ec602515340fbcf3';
        wx.request({
            url:url,
            method:'GET',
            header: {
                'content-type': 'application/json'
            },
            data:{grant_type,appid,secret},
            success:function(res){
                console.log(res)
            },
            fail:function (res) {
                console.log(res)
            }
        })
    },
    //微信登录
    onWechat:function () {

    },
    //立即注册
    onRegister:function () {
        wx.redirectTo({
            url: '/pages/register/register'
        })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.getUserInfo();
    console.log(options)
    let comic_id=options.comic_id;
    let chapter_name=options.chapter_name;
    let chapter_id=options.chapter_id;
    let Setfollow=options.Setfollow;
  

    if(comic_id &&chapter_name &&　!Setfollow &&　!chapter_id){
      this.setData({
      comic_id:comic_id,
      chapter_name:chapter_name
      })
    }else if(Setfollow){
      this.setData({
        comic_id:comic_id,
        chapter_name:chapter_name,
        Setfollow:Setfollow
      })
    }else if(chapter_id){
        this.setData({
        comic_id:comic_id,
        chapter_name:chapter_name,
        chapter_id:chapter_id
      })
    }
    else{
      this.setData({
        comic_id:null,
        chapter_name:null,
        Setfollow:null
      })
    }

  },
  //点击该按钮时，会返回获取到的用户信息
  bindGetUserInfo: function(e) {
        //console.log(e.detail.userInfo);
        //this.getAccessToken();
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
