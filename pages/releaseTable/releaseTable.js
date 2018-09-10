const wxApi = require('../../utils/util.js');
const app = getApp();
var _timer = null;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'wbcomic/comic/daypub_list',
    tabList: null,//日期时间列表
    comicList: null,//数据列表
    pubDay: '',//选中的日期时间
    pageNum: 1,//页码
    rowsNum: 10,//每次获取的数据条数
    height: 0, //滚动区的高
    message: '',//加载提示语,
    isMessage: false,//是否显示加载提示语
    networkType: true,//是否有网络
    type: 'loading',
    siteImage: '',
    pageTotal: 1,
    last_click_id: 1,
    cur_click_id: 1,
    isLoading: false,
    event_id:"{l1_id:'02',l2_id:'017',l3_id:'007'}",
    statisticsBaseurl:"https://apiv2.manhua.weibo.com/static/tongji/tu?s=", //统计用户行为url
  },

  /* 接受子组件 点击 头部导航发送的数据 */
  ClickPubDay: function (e) {
    this.setData({lowerState: 0})
    wxApi.getNetworkType().then((NetworkType) => {
      let networkType = NetworkType.networkType;
      let pubDay = e.detail.pub_day; //保存子组件发送的点击日期
      let event_id = e.detail.event_id;
      if (networkType === 'none' || networkType === 'unknown') {
        //无网络什么都不做
        this.setData({
          networkType: false,
          type: null,
          pageNum: this.data.pageNum,
          rowsNum: 10,
          comicList: this.data.comicList,
          isMessage: true
        })
        wxApi.getShowToast("主人，您目前的网络好像不太好呢~～")
      } else {
        if (_timer) clearTimeout(_timer)
        this.setData({
            pubDay, //存储日期
            pageNum: 1,
            rowsNum: 10,
            type: 'loading',
            networkType: true,
            comicList: null,//数据列表
            event_id:event_id
        });
        // console.log('====================================')
        // console.log(pubDay, 'last_click_id', last_click_id)

        _timer = setTimeout(() => {
           const last_click_id = this.setLastClickId()
           this.isLoad({ //开始调用 获取数据
             url: this.data.url,
             pubDay: this.data.pubDay,
             pageNum: this.data.pageNum,
             rowsNum: this.data.rowsNum,
             goTop: false,
             cur_click_id: last_click_id
           })
        }, 800);

      }
    })

  },

  //http://api.manhua.weibo.com/wbcomic/comic/daypub_list?_debug_=yes&page_num=1&rows_num=20&pub_day=20180331
  /*

  pub_day	    放送时间（第一次请求传空，以服务器时间为准，之后带相应参数）
  page_num	页数
  rows_num	每页条数
  */

  /**
   * *** formatData 格式化数据  返回值:数组
   * @myData 传递的res.data.data数组  默认值为空 如果未传递 返回this.data.comicList或者空数组
   * @comicList 传递的res.data.comic_list对象 默认值为空对象 如果是返回中没comic字段
   * @chapterList 传递的res.data.chapter_list对象 默认值为空对象 如果是返回中没lastChapter字段
   * @cateList 传递的res.data.cate_list对象 默认值为空对象 如果是返回中没cate 字段
  */
  formatData({ myData = [], comicList = {}, chapterList = {}, cateList = {} } = {}) {
    let ary = this.data.comicList;
    ary = ary ? ary : [];

    myData.forEach((itme, index) => {

      /* 格式化标签 */
      let cate = cateList[itme.comic_id];
      if (cate) {
        cate = cate[0] ? cate[0] : null
      } else {
        cate = null
      };

      let obj = {
        data: itme,
        comic: comicList[itme.comic_id] ? comicList[itme.comic_id] : null,
        cate
      }

      obj.lastChapter = chapterList[obj.comic.last_chapter_id] ? chapterList[obj.comic.last_chapter_id] : null;

      ary.push(obj);
    });
    return ary;
  },
  /**
   * *** daypubList 封装的get 请求  无返回值
   * @ url 请求路径 默认值空字符串
   * @ pubDay 请求的日期默认空字符串
   * @ pageNum 请求的第几页 默认1
   * @ rowsNum 每次请求多少条数据 默认10
   *  目的存储当前页数据
  */
  daypubList: function ({ url = '', pubDay = "", pageNum = 1, rowsNum = 10, goTop = false , cur_click_id = 0 } = {}) {
    let data = {
      page_num: pageNum,
      rows_num: rowsNum,
      pub_day: pubDay,
    }

    wxApi.get(url, { data }).then(({ code, data, message, tab_list: tabList }) => {
      // console.log(pubDay, 'cur_click_id', cur_click_id)
      if (!pubDay) { //如果 请求的日期存在不存储 日期列表
        this.setData({ //不存在存储日期列表
          tabList,
          pubDay: tabList[tabList.length - 1].pub_day
        });

        wxApi.getNodeInfo('#topNav').then((res) => { //在这获取导航条的高度
          if (res && res.height) {
            this.setData({ //不存在存储日期列表
              height: this.data.height - res.height
            });
          }
        })
      };
      if(pageNum == 1) this.setData({ comicList: [] })
      let {  //解构 res.data
        data: myData,
        comic_list: comicList,
        chapter_list: chapterList,
        cate_list: cateList,
        site_image: siteImage,
        page_total: pageTotal
      } = data;
      let comicAry = this.formatData({ //格式化数据 返回数组格式数据
        myData,
        comicList,
        chapterList,
        cateList
      });
      if (goTop) { //如果是true  执行回到顶部
        wxApi.pageScrollTo({ //滚动条回到顶部
          scrollTop: 0
        })
      }

      this.setData({ //存储数据
        comicList: comicAry,
        siteImage: siteImage,
        isLoading: false,
        pageTotal: pageTotal,
        message: pageTotal > pageNum ? '加载中' : '今天没有了，不如换一天看看～',//存储提示词,
        isMessage: true,
        type: null,
        cur_click_id
      })

    }).catch((err) => { //错误的时候
      this.setData({
        networkType: false,
        type: null,
        isMessage: false,
      })//错误时候
      wxApi.getShowToast("主人，服务器开小差了～")
    })

  },
  //点击今天没有了跳转
  release_message(e) {

    wxApi.getNetworkType().then((NetworkType) => {
      let networkType = NetworkType.networkType;
      // let pubDay = e.detail.pub_day; //保存子组件发送的点击日期
      if (networkType === 'none' || networkType === 'unknown') {
        //无网络什么都不做
        this.setData({
          networkType: false,
          type: null,
          pageNum: this.data.pageNum,
          rowsNum: 10,
          comicList: this.data.comicList,
          isMessage: true,
        })
        wxApi.getShowToast("主人，您目前的网络好像不太好呢~～")
      } else {
        //判断今天没有了的message
        if (this.data.message === "今天没有了，不如换一天看看～") {
          var tabList = this.data.tabList; //总体的日期
          var pubDay = parseInt(this.data.pubDay);  //当前页面的日期
          var comicList = this.data.comicList;//当前页面的数据
          if (pubDay === parseInt(tabList[0].pub_day) || comicList.length < 0) {
            pubDay = parseInt(tabList[6].pub_day)
          } else {
            // pubDay = pubDay - 1
            for (var i = 0; i < tabList.length; i++) {
              if (pubDay === parseInt(tabList[i].pub_day)) {
                pubDay = parseInt(tabList[i - 1].pub_day)
              }

            }
          }
          this.setData({
            pubDay, //存储日期
            pageNum: 1,
            rowsNum: 10,
            type: 'loading',
            networkType: true,
            comicList: null,//数据列表
          });
          this.isLoad({ //开始调用 获取数据
            url: this.data.url,
            pubDay: this.data.pubDay,
            pageNum: this.data.pageNum,
            rowsNum: this.data.rowsNum,
            goTop: false
          })

        }
      }
    })



  },

  /**
   *  isLoad 判断是否有网 有网就请求没有网络什么也不做
   * @ url 请求路径 默认值空字符串 用于请求(daypubList)
   * @ pubDay 请求的日期默认空字符串 用于请求(daypubList)
   * @ pageNum 请求的第几页 默认1 用于请求(daypubList)
   * @ rowsNum 每次请求多少条数据 默认10  用于请求 (daypubList)
  */
  isLoad: function ({ url = '', pubDay = "", pageNum = 1, rowsNum = 10, goTop = false , cur_click_id = 0 } = {}) {

    wxApi.getNetworkType().then((NetworkType) => {
      let networkType = NetworkType.networkType;
      if (networkType === 'none' || networkType === 'unknown') {
        //无网络什么都不做
        this.setData({
          networkType: false,
          type: null,
          isMessage: true,
        })
        wxApi.getShowToast("主人，您目前的网络好像不太好呢~～")
      } else {
        this.setData({
          isLoading: true
        })
        this.daypubList({  //调用get请求 获取数据
          url,
          pubDay,
          pageNum,
          rowsNum,
          goTop,
          cur_click_id
        })
      }
    }).catch((err) => {
      this.setData({
        networkType: false,
        type: 'server',
        isMessage: false,
      })
    })
  },
  setLastClickId () {
    const last_click_id = this.getNow()
    this.setData({
        last_click_id
    })
    return last_click_id
  },
  getNow () {
      return +new Date()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wxApi.getNetworkType().then((NetworkType) => {
      let networkType = NetworkType.networkType;
      if (networkType === 'none' || networkType === 'unknown') {
        //无网络什么都不做
        this.setData({
          networkType: false,
          type: "net",
          isMessage: false,
        })
      } else {
        this.isLoad({ //调用判断是否存在网络
          url: this.data.url,
          pubDay: this.data.pubDay,
          pageNum: this.data.pageNum,
          rowsNum: this.data.rowsNum,
          cur_click_id: 1,
        });
      }
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    const { windowHeight } = wxApi.getSystemInfoSync(); //获取设备信息
    this.setData({
      height: windowHeight
    })
  },

  /*
  * *** scroll-view 的上滑无限加载事件
  *   **onScroll
  */
  onScroll() {
    const data = this.data;
    let { pageNum, rowsNum, pageTotal, isLoading } = data;
    wxApi.getNetworkType().then((res) => {
      let networkType = res.networkType;
      if (networkType === 'none' || networkType === 'unknown') {
        //无网络不进行任何操作
        this.setData({
          networkType: false,
          type: null,
        })
        wxApi.getShowToast("主人，您目前的网络好像不太好呢~～")
      } else {
        //有网络
        //topNav
        if (!isLoading && pageNum < pageTotal) {
          this.setData({
            lowerState: 1,
            pageNum: pageNum + 1//条件成立后pageNum+1 然后在请求
          });
          this.isLoad({ //调用判断是否存在网络
            url: this.data.url,
            pubDay: this.data.pubDay,
            pageNum: this.data.pageNum,
            rowsNum: this.data.rowsNum
          });

        }
        else {
          return
        }
      }
    })

  },

  /**
   * isOnPageScroll onPageScroll:调用的页面滚动 方法
   * obj //滚动信息
  */
  isOnPageScroll(obj) {
    /*
        pageNum: 1,//页码
        rowsNum: 10,//每次获取的数据条数
        pageTotal:1,
        isLoading:false
    */
    const data = this.data;
    let { pageNum, rowsNum, pageTotal, isLoading } = data;

    const nodeFn = wxApi.getNodeInfo('#release_table_container'); //调用封装的 获取节点信息

    nodeFn.then((res) => {
      /* console.log(obj,res);
          res:(bottom:674,datase:{},height:2825,id:"release_table_container",left:0,right:414,top:-2151width:414)
          obj:滚动的位置信息{scrollTop: 1703}
      */
      const phoneInfo = wxApi.getSystemInfoSync(); //获取设备信息
      let {
        windowHeight, //设备的高度
        windowWidth //设备的宽度
      } = phoneInfo;//获取到的设备信息

      let {  //格式化获取的元素信息
        id, width, height, top, bottom, left, right, datase
      } = res;// 格式化获取的元素信息

      let isBottom = (windowHeight + obj.scrollTop) + 20;
      // console.log(isBottom >= height , !isLoading , pageNum < pageTotal,pageNum,pageTotal,isBottom , height)


      if (isBottom >= height && !isLoading && pageNum < pageTotal) {
        this.setData({
          pageNum: pageNum + 1//条件成立后pageNum+1 然后在请求
        });
        this.isLoad({ //调用判断是否存在网络
          url: this.data.url,
          pubDay: this.data.pubDay,
          pageNum: this.data.pageNum,
          rowsNum: this.data.rowsNum
        });

      } else {
        return
      }

    }).catch((err) => {
      console.error(err)
    })
  },

  onPageScroll(obj) { //检测页面滚动条
    //this.isOnPageScroll(obj);
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
        start_time : new Date().getTime(),
    })
    wx.setNavigationBarTitle({//动态设置当前页面的标题
      title: "放送表"
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let start_time = this.data.start_time;
    this.selectComponent("#statistics").pageStatistics(start_time);
    // console.log('onHide')
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
    this.selectComponent("#statistics").shareStatistics();
    

    return {
      title: '各种有爱的动漫分享'
    }
  }
})
