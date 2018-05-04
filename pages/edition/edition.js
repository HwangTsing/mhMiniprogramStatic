// pages/edition/edition.js
Page({


  /**
   * 页面的初始数据
   */
  data: {
        isBoy:false,   //男版
        isGirl:false,   //女版
        timer:null,     //倒计时

  },

   //事件
    /*boy and girl*/
    onBoyTap:function (event) {
        var that = this;
        var boyId=event.currentTarget.dataset.index;
        this.setData({
            isBoy:!that.data.isBoy,

        })
        that.data.timer = setTimeout(function () {
            wx.redirectTo({
                url: '/pages/index/index?boyid='+boyId
            })
        },1000);

        /*本地存储*/
         var isData= that.data.isBoy;
        wx.setStorage({   //存储本地缓存
            key:'boyId',
            data:boyId,
            success:function (res) {
                //console.log(res);
            }
        });
        wx.setStorage({   //存储本地缓存
            key:'isBoy',
            data:isData,
            success:function (res) {
                //console.log(res);
                that.setData({
                    isBoy:that.data.isData
                })
            }
        });

    },

    onGirlTap:function (event) {
        var that = this;
        var girlId=event.currentTarget.dataset.index;
        //console.log(girlId);
        this.setData({
            isGirl:!that.data.isGirl,
            idsed:3

        })
        that.data.timer = setTimeout(function () {
            wx.redirectTo({
                url: '/pages/index/index?girlid='+girlId
            })
        },1000);

        /*本地存储*/
        var isData = that.data.isGirl;
        wx.setStorage({
            key:'girlId',
            data:girlId,
            success:function (res) {
                //console.log(res);
            }
        })
        wx.setStorage({
            key:'isGirl',
            data:isData,
            success:function (res) {
                //console.log(res);
                that.setData({
                    isGirl:that.data.isData,
                    idsed:3
                })
            }
        })

    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      wx.getStorage({    //获取缓存
          key:'isBoy',
          success:function (res) {
              //console.log(res);
              var data = res.data;
              that.setData({
                  isBoy:data
              })
              if (data){
                  wx.getStorage({    //获取缓存
                      key:'boyId',
                      success:function (res) {
                          console.log(res);
                          var boyid = res.data;
                          that.data.timer = setTimeout(function () {
                              wx.redirectTo({
                                  url: '/pages/index/index?boyid='+boyid
                              })
                          },1000);
                      }
                  });
              }
          }
      });

      wx.getStorage({    //获取缓存
          key:'isGirl',
          success:function (res) {
              console.log(res);
              var data = res.data;
              that.setData({
                  isGirl:data,
                  idsed:3
              })
              if (data){
                  wx.getStorage({    //获取缓存
                      key:'girlId',
                      success:function (res) {
                          //console.log(res);
                          var girlid = res.data;
                          that.data.timer = setTimeout(function () {
                              wx.redirectTo({
                                  url: '/pages/index/index?girlid='+girlid
                              })
                          },1000);
                      }
                  });

              }
          }
      });

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
    clearTimeout(this.data.timer);

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
