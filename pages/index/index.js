//index.js
var wxApi = require("../../utils/util.js");

Page({
      data: {
          imgUrls:[],
          indicatorDots: true, //是否显示指示点
          autoplay: true, //是否自动切换
          interval: 1000, //自动切换间隔时长
          duration: 1000, //滑动动画时长
          indicatorColor:'#fff',   //指示点颜色
          indicatorActiveColor:'#FFCC33',   //当前选中指示点颜色
          circular:true,  //衔接滑动
          vertical: false,  //滑动方向是否纵向
          networkType:'',  //网络
          isCancel:false,   //推荐页男女分版弹层
          boyid:'',
          girlid:'',
          isScroll:true,   //scroll-view滚动条
          isOpacity:false,  //蒙层
          listData:false,    //搜索结果列表(调取接口时listData为Array,本地测试为Boolean)
          isScrollSearch:false,    //滚动
          searchListData:[]
      },

    //事件处理函数
    //关闭男女分版弹层事件
    onCancelTap:function () {
        var that = this;
        this.setData({
            isCancel:!that.data.isCancel,
            isScroll:true
        })
    },
    /*input聚焦和失焦,监听*/
    focusInputEvent: function () {
          var that= this;
        this.setData({
            isOpacity: true
        })
    },
    blurInputEvent: function () {
          var that = this;
        this.setData({
            isOpacity:false,
            isScroll:true
        })
    },
    bindInputChange:function () {
        this.setData({
            listData:true,
            isScroll:false
        })
    },
    /*查看更多*/
    bindMoreTap:function () {
        wx.navigateTo({
            url: '/pages/morelist/morelist'
        })
    },

    /*滚动触发事件*/
    //滚动条滚到顶部的时候触发
    upper: function(e) {
        console.log(e);
    },
    //滚动条滚到底部的时候触发
    lower: function(e) {
        console.log(e);

    },
    //滚动条滚动后触发
    scroll: function(e) {
        var that = this;
        console.log(e);
        console.log(e.detail.scrollTop);
        var scrollTop = e.detail.scrollTop;
        if (scrollTop >67){
            this.setData({
                isScrollSearch:true
            })
        }
        if (scrollTop === 0){
            this.setData({
                isScrollSearch:false
            })

        }


        var sessionTop = wx.setStorageSync('sessionTop',e.detail.scrollTop);
    },
    initData: function (id) {
        var that = this;
        if (id === 0){
            //console.log(app.globalData.wxApi);
            wxApi.recommendBoy({
                method:'GET',
                data:{},
                header:'application/html',
                success:function (data) {
                    console.log(data.data.data);
                    var data = data.data.data;
                    var imgUrls = data.h5_recommend_male_rotation_map;
                    console.log(imgUrls);
                    that.setData({
                        imgUrls:imgUrls
                    })
                },
                fail:function (data) {

                }
            })
        }else if (id === 1) {
            wxApi.recommendGirl({}).then(function (data) {
                console.log(data.data);
                var data = data.data;
                var imgUrls = data.h5_recommend_female_rotation_map;
                console.log(imgUrls);
                that.setData({
                    imgUrls:imgUrls
                })
            })
        }


    },

    onLoad: function (options) {
        var that = this;
        console.log(options);
        var boyid = options.boyid;
        var girlid = options.girlid;
        this.setData({
            boyid:boyid,
            girlid:girlid
        })
        if (boyid) {
            this.setData({
                isScroll:false
            })
            this.initData(0);
        }else if(girlid){
            this.setData({
                isScroll:false
            })
            this.initData(1);
        }

       /*获取个人头像等信息*/
        /*wx.getUserInfo({
            success: res => {
                app.globalData.userInfo = res.userInfo;
                console.log(app.globalData.userInfo);
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        })*/

        /*节点操作*/
        let query = wx.createSelectorQuery();
            query.select('#haha').boundingClientRect()
            query.exec(function (res) {
              //获取节点信息
              console.log(res);
              console.log(res[0].width);
              console.log(res[0].top);
            });


        //获取设备 -- 系统信息
        wx.getSystemInfo({
            success: res => {
                //console.log(res.model);
                if (res.model == 'iPhone X') {
                    this.setData({
                        isIphone: true,

                    })
                }
            },

        })


    },

    onShow: function () {
      var that = this;
      wx.getNetworkType({  //判断网络类型
          success: function(res) {
              console.log(res);
              /* that.setData({
                   netWorkType:res.networkType
               })*/
              if (res.networkType === 'none') {
                  wx.showToast({
                      title:'无网络',
                      icon:'loading',
                      duration:1000,
                      mask:true
                  })
              }
          }
      });
      /*wx.onNetworkStatusChange(function(res) {  //判断当前是否有网络连接
          console.log(res);
      })*/
    },

   /* onPageScroll:function(e){ // 获取滚动条当前位置
        console.log(e)
    },

    goTop: function (e) {  // 一键回到顶部
        if (wx.pageScrollTo) {
            wx.pageScrollTo({
                scrollTop: 0
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    }*/

    /*scroll: function(e) {
        console.log(e)
    },*/


    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
    },

})
