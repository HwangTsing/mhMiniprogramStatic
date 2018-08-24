
var wxApi = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moreData: null,   //数据
    type: "loading"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //console.log(options);
    var that = this;
    //判断网络类型
    wxApi.getNetworkType().then((res) => {
      let networkType = res.networkType;
      if (networkType === 'none' || networkType === 'unknown') {
        //无网络不进行任何操作
        this.setData({
          type: "net",
          moreData:null,
        })

      } else {
        //有网络
        wx.setNavigationBarTitle({//动态设置当前页面的标题
          title: "我的关注"
        });
        that.moreList();
      }
    }).catch((err) => {
      this.setData({
        type: "server",
        moreData:null,
      })
    })
  },
  moreList: function (location_en) {
    let that = this, header;

    /** 格式化用户需要的 cookie*/
    let Cookie = wx.getStorageSync("Set-Cookie");
    console.log(Cookie)
    let arr = Cookie.split('=').join(',').split(',');
    let Set_Cookie = 'app_uf=' + arr[1].split(';')[0] + ';' + 'app_us=' + arr[6].split(';')[0] + ';'
    header = {
      'content-type': 'application/x-www-form-urlencoded',
      'cookie': Set_Cookie
    };
    wxApi.myAttention({
      method: 'GET',
      header: header,
      success: function (res) {
        let siteImage = res.data.site_image ? res.data.site_image : "";
        let comic = res.data.data.comic;
        let dataList=[];
        console.log(res)
        if (res.data.code == 1) {
          if(res.data.data.data.length>0){
            res.data.data.data.forEach((item, index) => {
              if (comic[item.comic_id]) {
                let obj = {
                  comic: comic[item.comic_id],
                  data: item,
                  history_chapter: res.data.data.history_chapter[comic[item.comic_id].history_chapter_id]
                };
  
                if (comic && comic.hcover && !/^http[s]?:\/\//ig.test(comic.hcover)) {
                  comic.hcover = siteImage + comic.hcover;
                }
                dataList.push(obj)
                that.setData({
                  type: null,
                  moreData: dataList, 
                })
                
                
              }
            });
          }else{
                that.setData({
                  type: "follow",
                  moreData: dataList, 
                })
          }
          

        }

      },
      fail: function () {
        that.setData({
          type: "server",
          moreData:null,
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
   this.onLoad()
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

  onShareAppMessage: function () {
    return {
      title: '各种有爱的动漫分享'
    }
  }

})
