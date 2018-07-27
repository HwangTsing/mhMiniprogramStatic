//index.js
var wxApi = require("../../utils/util.js");

Page({
      data: {
          windowWidth: '320px',
          windowHeight:'504px',
          isBoy:false,   //男版
          isGirl:false,   //女版
          genderButtonDisabled: false,
          isShowGenderView: false,//是否显示男女版选择层
          timer:null,     //倒计时
          imgUrls:[],
          indicatorDots: true, //是否显示指示点
          autoplay: true, //是否自动切换
          interval: 3000, //自动切换间隔时长
          duration: 500, //滑动动画时长
          indicatorColor:'#fff',   //指示点颜色
          indicatorActiveColor:'#FFCC33',   //当前选中指示点颜色
          circular:true,  //衔接滑动
          vertical: false,  //滑动方向是否纵向
          networkType:true,  //是否有网络
          isScroll:true,   //scroll-view滚动条
          isToast:false,   //男女分版切换toast
          id:0,
          idg:1,
          isLoad:false,     //是否加载失败
      },
      metaData:{
        mca:''
      },

    initData: function () {
        var that = this;
        var mca = '';
        if (!!this.metaData.mca){
            mca = this.metaData.mca;
        }
        wxApi.recommendList({
            method:'GET',
            data:{mca},
            success:function (data) {
                var site_image = data.data.data.site_image;
                var location_list = data.data.data.location_list;
                var recommendList = {}, title={},keyIndex = {};
                if (data.data.code == 1){
                    if (that.data.id === 0 || that.data.id === 1){

                    }
                    location_list.forEach((item,index)=> {
                        var key = item.location_en;
                        recommendList[key] = data.data.data[key]||[];
                        if (recommendList[key].length === 0){
                            return;
                        }else {
                            title[key] = item.location_cn || '';
                            keyIndex[key] = key;
                        }

                    });
                    //轮播图
                    const imgUrls = recommendList[mca+'_rotation_map'] ? recommendList[mca+'_rotation_map'] : [];
                    //标题
                    const title_f = title[mca+'_fine_works'] ? title[mca+'_fine_works'] :'';
                    const title_p = title[mca+'_popular_works'] ? title[mca+'_popular_works'] : '';
                    const title_n = title[mca+'_new_arrival'] ? title[mca+'_new_arrival'] : '';
                    const title_h = title[mca+'_hot_serial'] ? title[mca+'_hot_serial'] : '';
                    const title_x = title[mca+'_xiaobian_recommend'] ? title[mca+'_xiaobian_recommend'] :'';
                    const title_w = title[mca+'_week_recommend'] ? title[mca+'_week_recommend'] : '';
                    //key
                    const keyIndex_f = keyIndex[mca+'_fine_works'] ? keyIndex[mca+'_fine_works'] : '';
                    const keyIndex_p = keyIndex[mca+'_popular_works'] ? keyIndex[mca+'_popular_works'] : '';
                    const keyIndex_n = keyIndex[mca+'_new_arrival'] ? keyIndex[mca+'_new_arrival'] : '';
                    const keyIndex_h = keyIndex[mca+'_hot_serial'] ? keyIndex[mca+'_hot_serial'] : '';
                    const keyIndex_x = keyIndex[mca+'_xiaobian_recommend'] ? keyIndex[mca+'_xiaobian_recommend'] : '';
                    const keyIndex_w = keyIndex[mca+'_week_recommend'] ? keyIndex[mca+'_week_recommend'] : '';
                    //精品佳作
                    const FineWorks = recommendList[mca+'_fine_works'];
                    //人气作品
                    const PopularWorks = recommendList[mca + '_popular_works'] ? recommendList[mca+'_popular_works'].slice(0,4) : [];
                    //最新上架
                    const newArrivalWorks = recommendList[mca + '_new_arrival'] ? recommendList[mca+'_new_arrival'].slice(0,3) : [];
                    //热门连载
                    const hotSerialWorks = recommendList[mca + '_hot_serial'] ? recommendList[mca+'_hot_serial'].slice(0,4) : [];
                    const xiaobianRecommend = recommendList[mca + '_xiaobian_recommend'] ? recommendList[mca+'_xiaobian_recommend'].slice(0,3) : [];
                    const weekRecommend = recommendList[mca + '_week_recommend'] ? recommendList[mca+'_week_recommend'].slice(0,4) : [];
                    //重置轮播图
                    that.setData({imgUrls:[]})
                    that.setData({
                        imgUrls,
                        title_f,
                        title_p,
                        title_n,
                        title_h,
                        title_x,
                        title_w,
                        keyIndex_f,
                        keyIndex_p,
                        keyIndex_n,
                        keyIndex_h,
                        keyIndex_x,
                        keyIndex_w,
                        FineWorks,
                        PopularWorks,
                        newArrivalWorks,
                        hotSerialWorks,
                        xiaobianRecommend,
                        weekRecommend,
                        isToast:false,
                        networkType:true,
                        type:null
                    })

                }

            },
            fail:function (data) {
                that.setData({
                    networkType:true,
                    isLoad:true,
                    isToast:false
                })
            }
        })

    },

    /*事件处理函数*/
    /*boy and girl*/
    onBoyTap:function (event) {
        var that = this;
        var boyid = event.currentTarget.dataset.index;
        const { genderButtonDisabled } = that.data
        const id = 0

        if(genderButtonDisabled) return
        this.setData({
            isBoy:!that.data.isBoy,
            genderButtonDisabled: true
        });

        that.data.timer = setTimeout(function () {
            that.setData({ boyid, id })
        },1000);
        setTimeout(()=>this.setData({genderButtonDisabled: false}), 20000)
        //判断网络类型
        wxApi.getNetworkType().then((res) =>{
            let networkType = res.networkType;
            if (networkType === 'none' || networkType === 'unknown') {
                //无网络不进行任何操作
                this.setData({
                    networkType: false,
                    isLoad: true
                })
            }else {
                //有网络
                if (boyid) {
                    this.metaData.mca = "mini_recommend_male";
                    this.setData({
                        type:'loading'
                    })
                    this.initData();
                    try {
                        wx.setStorageSync('id', boyid + '')
                    }catch(e){}
                }
            }
        }).catch((err) =>{
            this.setData({
                networkType:true,
                isLoad:true
            })
        })

    },

    onGirlTap:function (event) {
        var that = this;
        var girlid=event.currentTarget.dataset.index;
        const { genderButtonDisabled } = that.data
        const id = 1
        if(genderButtonDisabled) return
        this.setData({
            isGirl:!that.data.isGirl,
            genderButtonDisabled: true,
            idsed:3
        });

        setTimeout(function () {
            that.setData({ girlid, id })
        },1000);

        setTimeout(()=>this.setData({genderButtonDisabled: false}), 20000)

        //判断网络类型
        wxApi.getNetworkType().then((res) =>{
            let networkType = res.networkType;
            if (networkType === 'none' || networkType === 'unknown') {
                //无网络不进行任何操作
                this.setData({
                    networkType: false,
                    isLoad: true
                })

            }else {
                //有网络
                if(girlid){
                    this.metaData.mca = "mini_recommend_female";

                    this.setData({
                        type:'loading'
                    })
                    this.initData();
                    try {
                        wx.setStorageSync('id', girlid + '')
                    }catch(e){}
                }
            }
        }).catch((err) =>{
            this.setData({
                networkType: true,
                isLoad:true
            })
        })
    },
    //banner跳转详情
    swipTap:function (e) {
        var comic_id = e.currentTarget.dataset.typeid;
        wx.navigateTo({
            url: '/pages/details/details?comic_id='+comic_id
        })
    },
    /*放送*/
    releaseTap:function () {
        wx.navigateTo({
            url: '/pages/releaseTable/releaseTable'
        })
    },
    /*分类*/
    classTap:function () {
        wx.navigateTo({
            url: '/pages/classification/classification'
        })
    },
    /*榜单*/
    listTap:function () {
        wx.navigateTo({
            url: '/pages/rankinglist/rankinglist'
        })
    },
    /*完结*/
    endTap:function () {
        wx.navigateTo({
            url: '/pages/comicEnd/comicEnd'
        })
    },

    /*查看更多*/
    bindMoreTap:function (e) {
        var location_en = e.currentTarget.dataset.index;
        var title = e.currentTarget.dataset.title;
        wx.navigateTo({
            url: '/pages/morelist/morelist?location_en='+location_en+'&title='+title
        })
    },

    //滚动条滚到顶部的时候触发
    upper: function(e) {

    },

    onLoad: function (options) {
        var that = this;
        //判断网络类型
        let { windowWidth,windowHeight } = wxApi.getSystemInfoSync();
        if (windowWidth > 0) {
            windowWidth = windowWidth + 'px';
            windowHeight = windowHeight + 'px';
            this.setData({ windowWidth, windowHeight})
        }
        wxApi.getNetworkType().then((res) =>{
            let networkType = res.networkType;
            if (networkType === 'none' || networkType === 'unknown') {
                //无网络不进行任何操作
                this.setData({
                    networkType: false,
                    isLoad: true
                })

            }else {
                //有网络
                //################# 获取推荐页男女选择存储 #########################//
                wx.getStorage({
                    key:'id',
                    success:function (res) {
                        var id = res.data;

                        if (id === '0'){
                            that.metaData.mca = "mini_recommend_male";
                            that.setData({
                                type:'loading',
                                id: 0,
                                idg : 0,
                                boyid:"0"
                            })
                            that.initData()
                        }else if (id === '1'){
                            that.metaData.mca = "mini_recommend_female";
                            that.setData({
                                type:'loading',
                                id:  1,
                                idg: 1,
                                girlid:"1"
                            })
                            that.initData()
                        }else {
                            that.setData({
                                isShowGenderView: true
                            })
                        }
                    },
                    fail() {
                        that.setData({
                            isShowGenderView: true
                        })
                    }
                });
            }
        }).catch((err) =>{
            this.setData({
                networkType: true,
                isLoad:true
            })
        })

    },

    //男女分版切换
    onToastTap:function (e) {
        var that = this;
        that.data.id = Number(e.currentTarget.dataset.id);
        var id = that.data.id;
        let _saveId;
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
                if (id === 0){
                    this.metaData.mca = "mini_recommend_female";
                    this.initData();
                    this.setData({
                        isToast:true,
                        id : 1,
                        idg : 1
                    })
                    _saveId = 1
                }else  if (id === 1){
                    this.metaData.mca = "mini_recommend_male";
                    this.initData();
                    this.setData({
                        isToast:true,
                        id : 0,
                        idg : 0
                    })
                    _saveId = 0
                }
                //#############本地存储############//
                wx.setStorage({
                    key:'id',
                    data: _saveId + '',
                    success:function (res) {

                    }

                })
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
        this.searchlist = this.selectComponent("#searchlist");
    },
    onShow: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
    },

    onPageScroll() {
        //if(this.__pageScrollState == 1) return false;
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
