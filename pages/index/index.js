//index.js
var wxApi = require("../../utils/util.js");

Page({
      data: {
          isBoy:false,   //男版
          isGirl:false,   //女版
          timer:null,     //倒计时
          imgUrls:[],
          title:[],
          keyIndex:[],
          indicatorDots: true, //是否显示指示点
          autoplay: true, //是否自动切换
          interval: 1000, //自动切换间隔时长
          duration: 1000, //滑动动画时长
          indicatorColor:'#fff',   //指示点颜色
          indicatorActiveColor:'#FFCC33',   //当前选中指示点颜色
          circular:true,  //衔接滑动
          vertical: false,  //滑动方向是否纵向
          networkType:true,  //是否有网络
          isCancel:false,   //推荐页男女分版弹层
          recommendList:[],   //推荐页数据
          isScroll:true,   //scroll-view滚动条
          isOpacity:false,  //蒙层
          listData:false,    //搜索显示隐藏
          isScrollSearch:false,    //滚动
          searchListData:[],
          inputValue:'',
          isLower:false,    //滑动到底部提示没有数据了
          isToast:false,   //男女分版切换toast
          id:0,
          idg:1,
          searchList:[],   //搜索列表
          scrolType:'',
          message:'',    //提示语
          total:1    //总页码

      },
      metaData:{
          mca:''
      },
    searchData:{
          word:'',
          page_num:1,
          rows_num:20
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
            header:'application/html',
            success:function (data) {
                //console.log(data)
                console.log(data.data.data);
                var site_image = data.data.data.site_image;
                var location_list = data.data.data.location_list;
                console.log(location_list);
                var recommendList = that.data.recommendList;
                var title= that.data.title,keyIndex = that.data.keyIndex;
                if (data.data.code == 1){
                    if (that.data.id === 0 || that.data.id === 1){
                        recommendList = [];
                        title = [];
                        keyIndex = [];
                    }
                    location_list.forEach((item,index)=> {
                        //console.log(item.location_en);
                        var key = item.location_en;
                        console.log(key);
                        console.log(data.data.data[key]);
                        title.push(item.location_cn);
                        keyIndex.push(key)
                        recommendList.push(data.data.data[key]);
                    });

                    console.log(recommendList);

                    if (recommendList[2].length >=4){
                        var girlPopularWorks = recommendList[2].slice(0,4);
                    }else  if (recommendList[2].length < 4){
                        var girlPopularWorks = recommendList[2]
                    }
                    if  (recommendList[3].length >=3){
                        var newArrivalWorks = recommendList[3].slice(0,3);
                    }else if (recommendList[3].length < 3) {
                        var newArrivalWorks = recommendList[3]
                    }
                    if (recommendList[4].length >= 4) {
                        var hotSerialWorks = recommendList[4].slice(0,4);
                    }else if (recommendList[4].length < 4){
                        var hotSerialWorks = recommendList[4]
                    }
                    if  (recommendList[5].length >=3){
                        var xiaobianRecommend = recommendList[5].slice(0,3);
                    }else if (recommendList[5].length < 3) {
                        var xiaobianRecommend = recommendList[5]
                    }
                    if (recommendList[6].length >= 4) {
                        var weekRecommend = recommendList[6].slice(0,4);
                    }else  if (recommendList[6].length < 4){
                        var weekRecommend = recommendList[6]
                    }
                    that.setData({
                        keyIndex:keyIndex,
                        title_fine:title[1],
                        title_hot:title[2],
                        title_new:title[3],
                        title_hotserial:title[4],
                        title_xbrecommend:title[5],
                        title_weekrecommend:title[6],
                        recommendList:recommendList,
                        imgUrls:recommendList[0],
                        girlFineWorks:recommendList[1],
                        girlPopularWorks:girlPopularWorks,
                        newArrivalWorks:newArrivalWorks,
                        hotSerialWorks:hotSerialWorks,
                        xiaobianRecommend:xiaobianRecommend,
                        weekRecommend:weekRecommend,
                        isToast:false
                    })
                }

            },
            fail:function (data) {

            }
        })

    },
    searchDatas:function () {
        var that = this;
        var page_num = '',rows_num='',word='';
        if (!!this.searchData.word){
            word = this.searchData.word;
            console.log(word)
        }
        if (!!this.searchData.page_num) {
            page_num = +this.searchData.page_num;
        }
        if (!!this.searchData.rows_num){
            rows_num = this.searchData.rows_num;
        }
        if (page_num >that.data.total){
            return;
        }else {
            wxApi.searchList({
                method:'GET',
                data:{word,rows_num,page_num},
                header:'',
                success:function (data) {
                    if (data.data.data.data.length !==0){
                        console.log(data.data);
                        console.log(data.data.data.data);
                        that.data.total = data.data.data.page_total;
                        var site_cover = data.data.data.site_cover;

                        if (that.data.scrolType !== ''){
                            data.data.data.data.forEach((item,index) =>{
                                //判断图片路径是否带有https||http前缀，有则什么都不做，没有加上
                                if (item.cover && !/^http[s]?:\/\//ig.test(item.cover)){
                                    item.cover = site_cover + item.cover;
                                }
                            })
                            var searchList = that.data.searchList.concat(data.data.data.data);
                            console.log(searchList);

                        }else {
                            that.data.searchList = data.data.data.data;
                            that.data.searchList.forEach((item,index) =>{
                                //判断图片路径是否带有https||http前缀，有则什么都不做，没有加上
                                if (item.cover && !/^http[s]?:\/\//ig.test(item.cover)){
                                    item.cover = site_cover + item.cover;
                                }
                            })
                            var searchList = that.data.searchList;
                            console.log(searchList);
                        }
                        that.setData({
                            searchList:searchList,
                            inputValue: word,
                            listData:true,
                            isScroll:false,
                            message: that.data.total > page_num ? '加载更多...' : '没有更多了',//提示语
                        })
                    }else if (data.data.data.data.length === 0){//搜索没有匹配的数据时提示图
                        that.setData({

                        })
                    }
                },
                fail:function (data) {
                    that.setData({

                    })
                }

            });
        }



    },

    /*事件处理函数*/
    //事件
    /*boy and girl*/
    onBoyTap:function (event) {
        var that = this;
        var boyid=event.currentTarget.dataset.index;
        console.log(boyid);
        this.setData({
            isBoy:!that.data.isBoy

        });
        that.data.timer = setTimeout(function () {
            that.setData({
                boyid:boyid
            })
        },1000);
        if (boyid) {
            this.metaData.mca = "h5_recommend_male";
            this.initData();
        }
        //#############本地存储############//
        wx.setStorage({
            key:'id',
            data:boyid,
            success:function (res) {
                console.log(res);
            }
        })
    },

    onGirlTap:function (event) {
        var that = this;
        var girlid=event.currentTarget.dataset.index;
        console.log(girlid);
        this.setData({
            isGirl:!that.data.isGirl,
            idsed:3
        });
        that.data.timer = setTimeout(function () {
            that.setData({
                girlid:girlid
            })
        },1000);
        if(girlid){
            this.metaData.mca = "h5_recommend_female";
            this.initData();
        }
        //#############本地存储############//
        wx.setStorage({
            key:'id',
            data:girlid,
            success:function (res) {
                console.log(res);
            }
        })
    },
    //banner跳转详情
    swipTap:function (e) {
        var comic_id = e.currentTarget.dataset.typeid;
        wx.navigateTo({
            url: '/pages/details/details?comic_id='+comic_id
        })
    },
    //关闭男女分版弹层事件
    onCancelTap:function () {
        var that = this;
        this.setData({
            isCancel:!that.data.isCancel,
            isScroll:true
        })
    },
    /*input聚焦和失焦,监听*/
    focusInputEvent: function () {
          var that= this;
        this.setData({
            isOpacity: true
        })
    },
    blurInputEvent: function () {
          var that = this;
        this.setData({
            isOpacity:false,
            isScroll:false
        })
    },
    bindInputChange:function (e) {
        var that = this;
         that.searchData.word = e.detail.value;
        console.log(that.searchData.word);
        var word = that.searchData.word;
        if (word === ''){
            this.setData({
                searchList:[]
            })
            that.data.scrolType = '';
            that.searchData.page_num = 1;
        }else {
            that.searchDatas();
        }

    },
    //删除搜索框内容事件
    onDel:function () {
        var that = this;
        this.setData({
            inputValue:'',
            searchList:[]
        });
        that.data.scrolType = '';
        that.searchData.page_num = 1;
    },
    //取消
    onCancel:function(){
        var that = this;
        this.setData({
            isOpacity:false,
            listData:false,
            isScroll:true,
            inputValue:'',
            searchList:[]
        });
        that.data.scrolType = '';
        that.searchData.page_num = 1;
    },
    /*查看更多*/
    bindMoreTap:function (e) {
        var location_en = e.currentTarget.dataset.index;
        var title = e.currentTarget.dataset.title;
        wx.navigateTo({
            url: '/pages/morelist/morelist?location_en='+location_en+'&title='+title
        })
    },

    /*滚动触发事件*/
    //滚动条滚到顶部的时候触发
    upper: function(e) {

    },
    //滚动条滚到底部的时候触发
    lower: function(e) {
        console.log(e.type);
        var that = this;
        that.data.scrolType = e.type;
        this.setData({
            isLower:!that.data.isLower
        })
        that.searchData.page_num++;

        that.searchDatas();

    },
    //滚动条滚动后触发
    scroll: function(e) {
        var that = this;
        var scrollTop = e.detail.scrollTop;
        if (scrollTop >67){
            this.setData({
                isScrollSearch:true
            })
        }
        if (scrollTop === 0){
            this.setData({
                isScrollSearch:false
            })

        }
    },

    onLoad: function (options) {
        var that = this;
        wx.getNetworkType({  //判断网络类型
            success: function(res) {
                console.log(res);
                let networkType = res.networkType;
                if (networkType === 'none' || networkType === 'unknown') {
                    //无网络什么都不做
                    this.setData({
                        networkType: false
                    })
                    return
                }else {
                    //########### 获取初次男女分版存储 ##############//
                    wx.getStorage({
                        key:'id',
                        success:function (res) {
                            console.log(res.data);
                            var data = res.data;
                            console.log(data);
                            if (data === "0"){
                                that.setData({
                                    boyid:"0"
                                });
                                that.metaData.mca = "h5_recommend_male";
                                that.initData();
                            }else  if (data === "1"){
                                that.setData({
                                    girlid:"1"
                                });
                                that.metaData.mca = "h5_recommend_female";
                                that.initData();
                            }
                        }
                    });

                    //################# 获取推荐页男女选择存储 #########################//
                    wx.getStorage({
                        key:'id',
                        success:function (res) {
                            console.log(res);
                            var id = res.data;
                            if (id === 0){
                                that.metaData.mca = "h5_recommend_female";
                                that.initData();
                                that.setData({
                                    id:1,
                                    idg : 1,
                                    boyid:"0"
                                })
                            }else if (id === 1){
                                that.metaData.mca = "h5_recommend_male";
                                that.initData();
                                that.setData({
                                    id:0,
                                    idg : 0,
                                    girlid:"1"
                                })
                            }

                        }
                    });
                }
            },
            fail:function (res) {
                return;
            }
        });

    },

    //男女分版切换
    onToastTap:function (e) {
        var that = this;
        that.data.id = Number(e.currentTarget.dataset.id);
        var id = that.data.id;
        console.log(id);
        if (id === 0){
            this.metaData.mca = "h5_recommend_female";
            this.initData();
            this.setData({
                isToast:true,
                id : 1
            })
        }else  if (id === 1){
            this.metaData.mca = "h5_recommend_male";
            this.initData();
            this.setData({
                isToast:true,
                id : 0
            })
        }
        //#############本地存储############//
        wx.setStorage({
            key:'id',
            data:id,
            success:function (res) {
                console.log(res);
            }

        })
    },
    onToastTap02:function (e) {
        var that = this;
        that.data.idg = Number(e.currentTarget.dataset.id);
        var idg = that.data.idg;
        console.log(idg);
        if (idg === 1){
            this.metaData.mca = "h5_recommend_male";
            this.initData();
            this.setData({
                isToast:true,
                idg : 0
            })
        }
        else if (idg === 0){
            this.metaData.mca = "h5_recommend_female";
            this.initData();
            this.setData({
                isToast:true,
                idg : 1
            })
        }
        //#############本地存储############//
        wx.setStorage({
            key:'id',
            data:idg,
            success:function (res) {
                console.log(res);
            }
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

})
