// pages/search/search.js
var wxApi = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      windowWidth: '320px',
      windowHeight:'504px',
      focus:true,
      timer:null,     //倒计时
      networkType:true,  //是否有网络
      isScroll:true,   //scroll-view滚动条
      isCancel:false,
      searchList:[],   //搜索列表
      scrolType:'',
      message:'',    //提示语
      total:0,    //总页码
      noSearch:true,   //是否有搜索结果
      isLoad:false,     //是否加载失败
      allHotTitle:[],   //所有热词
      hotTitle:[],      //当前热词数组  12条
      onIndex:0,        //第几次点击热门搜索换一换
  },
  searchData:{
    word:'',
    page_num:1,
    rows_num:10
  },

    //搜索结果列表数据
    searchDatas:function () {
        var that = this;
        var page_num = '',rows_num='',word='';
        if (!!this.searchData.word){
            word = this.searchData.word;
        }
        if (!!this.searchData.page_num) {
            page_num = +this.searchData.page_num;
        }
        if (!!this.searchData.rows_num){
            rows_num = this.searchData.rows_num;
        }

        wxApi.searchList({
            method:'GET',
            data:{word,rows_num,page_num},
            success:function (data) {
                if (data.data.data.data.length !==0){
                    var site_cover = data.data.data.site_cover;

                    if (that.data.scrolType !== ''){
                        data.data.data.data.forEach((item,index) =>{
                            //判断图片路径是否带有https||http前缀，有则什么都不做，没有加上
                            if (item.cover && !/^http[s]?:\/\//ig.test(item.cover)){
                                item.cover = site_cover + item.cover;
                            }
                        })
                        var searchList = that.data.searchList.concat(data.data.data.data);

                    }else {
                        that.data.searchList = data.data.data.data;
                        that.data.searchList.forEach((item,index) =>{
                            //判断图片路径是否带有https||http前缀，有则什么都不做，没有加上
                            if (item.cover && !/^http[s]?:\/\//ig.test(item.cover)){
                                item.cover = site_cover + item.cover;
                            }
                        })
                        var searchList = that.data.searchList;
                    }
                    let page_total = data.data.data.page_total;
                    that.setData({
                        searchList:searchList,
                        isScroll:false,
                        total:page_total,
                        message: page_total > page_num ? '加载更多...' : '没有更多了',//提示语
                        networkType:true,
                        noSearch:true
                    })
                }else if (data.data.data.data.length === 0){//搜索没有匹配的数据时提示图
                    that.setData({
                        searchList:[],
                        noSearch:false,
                        isScroll:false
                    })
                }
            },
            fail:function (data) {
                that.setData({
                    networkType:true,
                    isLoad:true
                })
            }

        });

    },
    //热门搜索数据
    popRecData:function () {
        var that = this;
        wxApi.popRecList({
            method:'GET',
            success:function (data) {
                //console.log(data.data.data);
                that.data.allHotTitle = data.data.data;
                that.setData({
                    allHotTitle:that.data.allHotTitle
                })
                that.hotChange(that.data.onIndex);
            },
            fail:function (data) {
                that.setData({

                })
            }
        })
    },
    //刷新一下更换一次热词
    hotChange:function (onIndex) {
        var that = this;
        that.data.hotTitle =that.data.allHotTitle.slice(onIndex*12,(onIndex+1)*12);
        that.setData({
            searchTitle:that.data.hotTitle
        })
    },
    //点击刷新换一换热词搜索
    clickChange:function () {
        var that = this;
        that.data.onIndex ++ ;
        var page = (that.data.allHotTitle.length) /12;
        if (that.data.onIndex >= page){
            that.data.onIndex = 0;
        }
        that.hotChange(that.data.onIndex);
    },
    onHotTap:function (e) {
       let comic_id = e.currentTarget.dataset.hotid;
        //console.log(comic_id);
        wx.navigateTo({
            url: '/pages/details/details?comic_id='+comic_id
        })
    },
    /*input聚焦和失焦,监听*/
    focusInputEvent: function () {
        var that= this;
        this.setData({
            isScroll:false
        })
    },
    blurInputEvent: function () {
        var that = this;
        this.setData({
            isScroll:true,
        })
    },
    bindInputChange:function (e) {
        var that = this;
        that.searchData.word = e.detail.value;
        //console.log(that.searchData.word);
        var word = that.searchData.word;//判断网络类型
        wxApi.getNetworkType().then((res) =>{
            let networkType = res.networkType;
            if (networkType === 'none' || networkType === 'unknown') {
                //无网络不进行任何操作
                this.setData({
                    networkType: false
                })

            }else {
                //有网络
                if (word === ''){
                    this.setData({
                        searchList:[],
                        noSearch:true,
                        word:''
                    })
                    that.data.scrolType = '';
                    that.searchData.page_num = 1;
                }else {
                    that.setData({
                        isScroll:false,
                        isCancel:false,
                        word:that.searchData.word
                    })
                    that.searchDatas();
                }
            }
        }).catch((err) =>{
            this.setData({
                networkType: true,
                isLoad:true
            })
        })

    },
    //删除搜索框内容事件
    onDel:function () {
        var that = this;
        this.setData({
            word:'',
            searchList:[],
            noSearch:true   //关闭提示重新搜索
        });
        that.data.scrolType = '';
        that.searchData.page_num = 1;
    },
    //取消
    onCancel:function(){
        var that = this;
        that.setData({
            isScroll:true,
            noSearch:true,
            word:'',
            searchList:[],
            isCancel:true

        });
        that.data.scrolType = '';
        that.searchData.page_num = 1;
        wx.navigateBack({
            url: '/pages/index/index'
        })
    },
    //滚动条滚到底部的时候触发
    lower: function(e) {
        console.log(1111)
        console.log(e.type);
        var that = this;
        that.data.scrolType = e.type;
        console.log(that.data.scrolType)
        //判断网络类型
        wxApi.getNetworkType().then((res) =>{
            let networkType = res.networkType;
            if (networkType === 'none' || networkType === 'unknown') {
                //无网络不进行任何操作
                this.setData({
                    networkType: false,
                    searchList:[]
                })

            }else {
                //有网络
                let total = that.data.total;
                console.log(total);
                that.searchData.page_num++;
                if (total < that.searchData.page_num){
                    return;
                }else {
                    that.searchDatas();
                }

            }
        }).catch((err) =>{
            this.setData({
                networkType: true,
                isLoad:true
            })
        })

    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that  = this;
      that.setData({
          word:that.searchData.word
      });
      //判断网络类型
      wxApi.getNetworkType().then((res) =>{
          let networkType = res.networkType;
          if (networkType === 'none' || networkType === 'unknown') {
              //无网络不进行任何操作
              this.setData({
                  networkType: false
              })

          }else {
              //有网络
              that.popRecData();

          }
      }).catch((err) =>{
          this.setData({
              networkType: true,
              isLoad:true
          })
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
