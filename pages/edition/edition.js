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
        console.log(boyId);
        this.setData({
            isBoy:true,

        })
        that.data.timer = setTimeout(function () {
            wx.redirectTo({
                url: '/pages/index/index?boyid='+boyId
            })
        },1000);

    },

    onGirlTap:function (event) {
        var that = this;
        var girlId=event.currentTarget.dataset.index;
        console.log(girlId);
        this.setData({
            isGirl:true,
            idsed:3

        })
        that.data.timer = setTimeout(function () {
            wx.redirectTo({
                url: '/pages/index/index?girlid='+girlId
            })
        },1000);

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
