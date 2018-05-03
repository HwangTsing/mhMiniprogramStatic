const wxApi = require('../../utils/util.js');

// pages/read/read.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: 320,
    chapter: {},
    comic: {},
    json_content: {
      page: []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wxApi.get('wbcomic/comic/comic_play', {
      data: {
        chapter_id: options.chapter_id,
        create_source: "h5"
      }
    }).then(({code, message, data}) => {
      const { windowWidth } = wxApi.systemInfo();
      data.windowWidth = windowWidth;
      this.setData({...data})
    })

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
