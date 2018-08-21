// pages/mymsg/mymsg.js
var wxApi = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myFollow: "",//关注数据
  },
  //弹出切换账号方法
  switch: function () {
    const pop = this.selectComponent('#switch')
    if (pop) pop.open();
  },
  //点击切换账户
  switchAccount: function (e) {
    this.switch();
  },
  //查看更多
  bindMoreTap: function (e) {
    wx.login({
      success:function(res){
        console.log(res)
      }
    })
    // wx.navigateTo({
    //   url: './components/more/more'
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var mca = "mini_recommend_male"; var that = this;
    wxApi.recommendList({
      method: 'GET',
      data: { mca },
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          myFollow: res.data.data.mini_recommend_male_fine_works
        })

      }
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