//index.js
var wxApi = require("../../utils/util.js");

Page({
      data: {
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
          networkType:'',  //网络
          isCancel:false,   //推荐页男女分版弹层
          boyid:'',
          girlid:'',
          recommendList:[],   //推荐页数据
          isScroll:true,   //scroll-view滚动条
          isOpacity:false,  //蒙层
          listData:false,    //搜索结果列表(调取接口时listData为Array,本地测试为Boolean)
          isScrollSearch:false,    //滚动
          searchListData:[],
          inputValue:'',
          isLower:false,    //滑动到底部提示没有数据了
          isToast:false,   //男女分版切换toast
          id:0,
          idg:1,
          searchList:[],   //搜索列表
          cates:[],
          hasMore:true,   //是否还有数据
          scrolType:'',

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
        wxApi.searchList({
                method:'GET',
                data:{word,rows_num,page_num},
                header:'',
                success:function (data) {
                    if (data.data.data.data.length !==0){
                        console.log(data.data);
                        console.log(data.data.data.data);
                        var total = data.data.data.page_total;
                        var cates = that.data.cates;
                        /* searchList.forEach((item,index)=>{
                             cates.push(item.cates);
                         })*/
                        console.log(cates);
                        if (that.data.scrolType !== ''){
                            var searchList = that.data.searchList.concat(data.data.data.data);
                            console.log(searchList);
                        }else {
                            that.data.searchList = data.data.data.data;
                            var searchList = that.data.searchList;
                            console.log(searchList);
                        }
                        that.setData({
                            searchList:searchList,
                            inputValue: word,
                            listData:true,
                            isScroll:false
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


    },

    /*事件处理函数*/
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
        /*console.log(e);
        console.log(e.detail.scrollTop);*/
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


        var sessionTop = wx.setStorageSync('sessionTop',e.detail.scrollTop);
    },

    onLoad: function (options) {
        var that = this;
        console.log(options);
        var boyid = options.boyid;
        var girlid = options.girlid;
        this.setData({
            boyid:boyid,
            girlid:girlid,
            isScroll:false
        })
        if (boyid) {
            this.metaData.mca = "h5_recommend_male";
            this.initData();
        }else if(girlid){
            this.metaData.mca = "h5_recommend_female";
            this.initData();
        }

       /*获取个人头像等信息*/
        /*wx.getUserInfo({
            success: res => {
                app.globalData.userInfo = res.userInfo;
                console.log(app.globalData.userInfo);
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        })*/

        /*节点操作*/
        let query = wx.createSelectorQuery();
            query.select('#haha').boundingClientRect()
            query.exec(function (res) {
              //获取节点信息
              console.log(res);
              console.log(res[0].width);
              console.log(res[0].top);
            });


        //获取设备 -- 系统信息
        wx.getSystemInfo({
            success: res => {
                //console.log(res.model);
                if (res.model == 'iPhone X') {
                    this.setData({
                        isIphone: true,

                    })
                }
            },

        })


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
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.searchlist = this.selectComponent("#searchlist");
    },
    onShow: function () {
      var that = this;
      wx.getNetworkType({  //判断网络类型
          success: function(res) {
              console.log(res);
              /* that.setData({
                   netWorkType:res.networkType
               })*/
              if (res.networkType === 'none') {
                  wx.showToast({
                      title:'无网络',
                      icon:'loading',
                      duration:1000,
                      mask:true
                  })
              }
          }
      });
    },

   /* onPageScroll:function(e){ // 获取滚动条当前位置
        console.log(e)
    },

    goTop: function (e) {  // 一键回到顶部
        if (wx.pageScrollTo) {
            wx.pageScrollTo({
                scrollTop: 0
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    }*/


    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        wx.stopPullDownRefresh();
    },

})
