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
                data.data.data.week.forEach((item,index) => {
                    readData.push(item);
                    that.setData({
                        index:index
                    })
                });
                console.log(readData);
                that.setData({
                    readData,
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
        var that = this;
      wxApi.newList({
          method:'GET',
          success:function (data) {
              console.log(data.data.data.week);
              let newData = [];
              data.data.data.week.forEach((item,index) => {
                  newData.push(item);
                  that.setData({
                      index:index
                  })
              });
              console.log(newData);
              that.setData({
                  newData,
                  type:null,
              })
          },
          fail:function (data) {
              this.setData({

              })
          }
      })
    },
    /*综合榜数据*/
    rankList:function () {
        var that = this;
        wxApi.rankList({
            method:'GET',
            success:function (data) {
                console.log(data.data.data.week);
                let rankData = [];
                data.data.data.week.forEach((item,index) => {
                    rankData.push(item);
                    that.setData({
                        index:index
                    })
                });
                console.log(rankData);
                that.setData({
                    rankData,
                    type:null,
                })
            },
            fail:function (data) {
                this.setData({

                })
            }
        })
    },


    /*tab事件*/
    onTabTap: function (event) {
        //console.log(event)
        var that = this;
        var status = event.currentTarget.dataset.id;
        if (that.data.status == status){
            return;
        }else {
            this.setData({
                status :event.currentTarget.dataset.id
            });
            if (status === 0) {
                that.setData({
                    type:'loading'
                })
                that.readList();
            }
            else if (status === 1) {
                that.setData({
                    type:'loading'
                })
                that.newList();
            }
            else if (status === 2) {
                that.setData({
                    type:'loading'
                })
                that.rankList();
            }
        }

    },
    /*** 滑动切换tab***/
    bindChange: function (e) {
        //console.log(e)
        let currentId = e.detail.current;
        let source = e.detail.source;
        var that = this;
        that.setData({
            status: currentId
        });
        if (source) {
            if (currentId === 0) {
                that.setData({
                    type:'loading'
                })
                that.readList();
            }
            else if (currentId === 1) {
                that.setData({
                    type:'loading'
                })
                that.newList();
            }
            else if (currentId === 2) {
                that.setData({
                    type:'loading'
                })
                that.rankList();
            }
        }

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
              that.setData({
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