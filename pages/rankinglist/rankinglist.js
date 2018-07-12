// pages/rankinglist/rankinglist.js
var wxApi = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      statusList:[
          {
              status:0,
              title:'阅读榜'
          },
          {
              status:1,
              title:'新作榜'
          },
          {
              status:2,
              title:'综合榜'
          }
      ],
      status:0,
      windowHeight:''
  },
    /*阅读榜数据*/
    readList:function () {
        var that = this;
        wxApi.readList({
            method:'GET',
            success:function (data) {
                console.log(data.data.data.week);
                let readData=[];
                readData = data.data.data.week;
                console.log(readData);
                that.setData({
                    readData:readData,
                    type:null,
                })
            },
            fail:function (data) {
                that.setData({

                })
            }
        })
    },
    /*新作榜数据*/
    newList:function () {
      wxApi.newList({
          method:'GET',
          success:function (data) {
              console.log(data);
          },
          fail:function (data) {
              this.setData({

              })
          }
      })
    },
    /*综合榜数据*/
    rankList:function () {
        wxApi.rankList({
            method:'GET',
            success:function (data) {

            },
            fail:function (data) {
                this.setData({

                })
            }
        })
    },


    /*tab事件*/
    onTabTap: function (event) {
        var that = this;
        var status = event.currentTarget.dataset.id;
        console.log(status);
        if (that.data.status == status){
            return;
        }else {
            this.setData({
                status :event.currentTarget.dataset.id
            })
        }

    },
    /*** 滑动切换tab***/
    bindChange: function (e) {
        console.log(e.detail.current);
        var that = this;
        that.setData({
            status: e.detail.current
        });
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      //  高度自适应
      wx.getSystemInfo( {
          success: function( res ) {
              var clientHeight=res.windowHeight,
                  clientWidth=res.windowWidth,
                  rpxR=750/clientWidth;
              var  calc=clientHeight*rpxR;
              that.data.windowHeight = calc;
              that.setData( {
                    type:'loading',
                  windowHeight: that.data.windowHeight
              });
          }
      });
      that.readList();
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
      return {
          title: '各种有爱的动漫分享'
      }
  }
})
