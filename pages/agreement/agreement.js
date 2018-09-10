// pages/agreement/agreement.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    this.setData({
        start_time : new Date().getTime(),
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let start_time = this.data.start_time;
    this.selectComponent("#statistics").pageStatistics(start_time);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    let start_time = this.data.start_time;
    this.selectComponent("#statistics").pageStatistics(start_time);
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