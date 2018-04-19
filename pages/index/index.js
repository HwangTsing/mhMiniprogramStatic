//index.js
//获取应用实例
var app = getApp()

Page({
      data: {
          is_modal_Hidden:false,
          is_modal_Msg:'我是一个自定义组件',
          motto: 'Hello World',
          userInfo: {},
          hasUserInfo: false,
          canIUse: wx.canIUse('button.open-type.getUserInfo'),



          imgUrls:[
              "https://img.alicdn.com/simba/img/TB19IBHQVXXXXaQXXXXSutbFXXX.jpg",
              "https://img.alicdn.com/tfs/TB134OnRVXXXXabXXXXXXXXXXXX-520-280.jpg",
              'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
          ],
          indicatorDots: true, //是否显示指示点
          autoplay: true, //是否自动切换
          interval: 1000, //自动切换间隔时长
          duration: 1000, //滑动动画时长
          indicatorColor:'#e4e4e4',   //指示点颜色
          indicatorActiveColor:'#FFCC33',   //当前选中指示点颜色
          circular:true,  //衔接滑动
          vertical: false,  //滑动方向是否纵向
          networkType:'',  //网络
          isScroll:true,   //scroll-view滚动条
          isOpacity:false,  //蒙层
          listData:false,    //搜索结果列表(调取接口时listData为Array,本地测试为Boolean)

      },

      //事件处理函数
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
            isScroll:"{{false}}"
        })
    },
    bindInputChange:function () {
        this.setData({
            listData:true,
            isScroll:"{{false}}"
        })
    },
    /*查看更多*/
    bindMoreTap:function () {
        wx.navigateTo({
            url: '/pages/morelist/morelist'
        })
    },

    onLoad: function () {
       var that = this;
       /*获取个人头像等信息*/
        wx.getUserInfo({
            success: res => {
                app.globalData.userInfo = res.userInfo;
                console.log(app.globalData.userInfo);
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        })
        /*微信运动*/
        wx.getWeRunData({
            success(res) {
                const encryptedData = res.encryptedData;
                console.log(encryptedData);
            }
        });

        /*节点操作*/
        let query = wx.createSelectorQuery();
        query.select('#haha').boundingClientRect()
          query.exec(function (res) {
              //获取节点信息
              console.log(res);
              console.log(res[0].width);
              console.log(res[0].top);

          });

          if (app.globalData.userInfo) {
          this.setData({
            userInfo: app.globalData.userInfo,
            hasUserInfo: true
          })
        } else if (this.data.canIUse){
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          app.userInfoReadyCallback = res => {
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        } else {
          // 在没有 open-type=getUserInfo 版本的兼容处理
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
              this.setData({
                userInfo: res.userInfo,
                hasUserInfo: true
              })
            }
          })
        }

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
    getUserInfo: function(e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        })
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


    /*小程序生成分享二维码*/
    textDataImg:function () {
        console.log(111)
        var that = this;

        wx.downloadFile({
            url:app.globalData.avatarUtl,
            success:function (res) {

                //缓存头像图片
                that.setData({
                    portrait_temp: res.tempFilePath
                });
                //缓存canvas绘制小程序二维码
                wx.downloadFile({
                    url:that.data.qrcode,
                    success:function (res) {
                        console.log('二维码：'+res.tempFilePath);
                        //缓存二维码
                        that.setData({
                            qrcode_temp:res.tempFilePath
                        });
                        console.log('开始绘制图片');
                        that.drawImage();
                        setTimeout(function () {
                            that.canvasToImage()
                        },200)
                    }
                })
            }
        })
    },

    drawImage: function () {
        //绘制canvas图片
        var that = this;
        const ctx = wx.createCanvasContext('myCanvas');
        var bgPath = '../../images/share_png';
        var portaitPath = that.data.portrait_temp;
        var hostNickname =that.data.userInfo.nickName;


        var qrPath = that.data.qrcode_temp;
        var windowWidth = that.data.windowWidth;
        that.setData({
            scale:1.6
        });
        //绘制背景图片
        ctx.drawImage(bgPath,0,0,windowWidth,that.data.scale * windowWidth)

        //绘制头像
        ctx.save();
        ctx.beginPath();
        ctx.arc(windowWidth/2,0.32*windowWidth,0.15*windowWidth,0.2*Math.PI);
        ctx.clip();
        ctx.drawImage(portaitPath,0.7*windowWidth/2,0.17*windowWidth,0.3*windowWidth,0.3*windowWidth);
        ctx.restore();

        //绘制第一段文本
        ctx.setFillStyle('#fff');
        ctx.setFontSize(0.037 * windowWidth);
        ctx.setTextAlign('center');
        ctx.fillText('邀请你一起来领券啦~',windowWidth/2,0.57 * windowWidth);
        //绘制二维码
        ctx.drawImage(qrPath,0.64 * windowWidth/2,0.75 * windowWidth, 0.36 * windowWidth,0.36 * windowWidth);

        //绘制第三段文本
        ctx.setFillStyle('#fff');
        ctx.setFontSize(0.37 * windowWidth);
        ctx.setTextAlign('center');
        ctx.fillText('长按二维码',windowWidth/2, 0.36 * windowWidth);
        ctx.draw();


    },
    canvasToImage:function () {
        var that = this
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: that.data.windowWidth,
            height: that.data.windowWidth * that.data.scale,
            destWidth: that.data.windowWidth * 4,
            destHeight: that.data.windowWidth * 4 * that.data.scale,
            canvasId: 'myCanvas',
            success: function (res) {
                console.log('朋友圈分享图生成成功:' + res.tempFilePath)
                wx.previewImage({
                    current: res.tempFilePath, // 当前显示图片的http链接
                    urls: [res.tempFilePath] // 需要预览的图片http链接列表
                })
            },
            fail: function (err) {
                console.log('失败')
                console.log(err)
            }
        })
    },


    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
    },

})
