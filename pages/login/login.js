// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      phoneNumber:'',  //电话号码
      password:'',     //密码
  },

    //键盘输入时触发
    phoneInputChange:function (e) {
        var that = this;
        that.data.phoneNumber = e.detail.value;
        console.log(that.data.phoneNumber);
        that.setData({
            phoneNumber:that.data.phoneNumber
        })
    },
    passwordInputChange:function (e) {
        var that = this;
        that.data.password = e.detail.value;
        console.log(that.data.password);
        that.setData({
            password:that.data.password
        })
    },
    //删除所填号码
    delPhone:function () {
      var that = this;
      that.setData({
          phoneNumber:''
      })
    },
    //删除所填密码
    delPassword:function () {
        var that = this;
        that.setData({
            password:''
        })
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
