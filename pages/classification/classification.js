// pages/classification/classification.js
var wxApi = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

      comicCate: {},
      comicPay: {},
      comicEnd: {},
      cate_id:0,
      end_status:0,

  },


    classLabelList:function () {
      var that = this;
      wxApi.classLabelList({
          method:'GET',
          success:function (data) {
            console.log(data.data.data);
            if (data.data.code == 1) {
                that.data.comicCate = data.data.data.cate_list;
                console.log(that.data.comicCate);
                that.data.comicPay = data.data.data.comic_pay_status_list;
                console.log(that.data.comicPay);
                that.data.comicEnd = data.data.data.end_status_list;
                console.log(that.data.comicEnd);
                that.setData({
                    comicCate:that.data.comicCate,
                    comicEnd:that.data.comicEnd
                })

            }

          },
          fail:function (data) {

          }
      })
    },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.classLabelList();
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
