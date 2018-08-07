// pages/details/details.js
var wxApi = require("../../utils/util.js");//导入wxApi
const { _ } = require('../../utils/underscore.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isData: true,
    dataAry: null,
    comicCommentData: null,
    isSeeMore: false,//是否显示查看更多
    isSort: 2,//是否排序 1默认|2倒叙
    history: null,
    see: '看到：',
    isBtn: false,
    title:"",
    tabData: [
      {
        status: 0,
        title: '详情'
      },
      {
        status: 1,
        title: '目录'
      }
    ],
    status: 0,
    networkType: true,//是否有网络
    type: 'loading',
  },
  popUp: function() {
    const pop = this.selectComponent('#popup')
    if(pop) pop.open();
  },
  //跳转接口方法
  navigateToHistory: function (chapter_id, comic_id) {
    var that=this;
    let arr = this.data.dataAry.chapter_list;
    return arr.filter( (element, index) => {
      if (chapter_id === element.chapter_id) {
        if (element.isLocked === true) {
          this.popUp()
        }else{
          wx.navigateTo({
            url: `/pages/read/read?chapter_id=${chapter_id}&comic_id=${comic_id}`
          })
        }
      }
    })
   
  },
  //点击开始阅读|和据需阅读的事件
  onReadClick: function (event) {
    let key = "comic_id_" + this.data.dataAry.comic.comic_id;
    wxApi.getStorage(key).then((res) => { //获取阅读历史

      let data = res.data;
      this.navigateToHistory(data.chapter_id, data.comic_id)
    }).catch((err) => {
      let isSort = this.data.isSort;
      let arr = this.data.dataAry;
      var can_read_chapters = this.can_read_chapters;
      if (arr.chapter_list && arr.chapter_list[0]) {
        let index = 0;
        this.navigateToHistory(arr.chapter_list[index].chapter_id, arr.comic.comic_id);
      }//错误时候



    });
  },
  onTabTap: function (event) {
    var status = event.currentTarget.dataset.status;
    var self = this;
    this.setData({
      status: status
    })
  },
  /*
  * //通过组件传递的消息,执行事件
  * */
  ClickCatalog() { //通过组件传递的消息,执行事件

    if (!this.data.dataAry) {
      return
    }
    else {

      let key = "comic_id_" + this.data.dataAry.comic.comic_id;
      wxApi.getStorage(key).then((res) => {
        this.setData({
          history: res.data
        })
      }).catch((err) => {
        this.setData({
          history: null
        })//错误时候
      });
    }

  },
  /*
  * 点击排序按钮 目录进行排序
  * @ isSort 1 正序 2倒叙
  * */
  catalogSort() {
    let isSort = this.data.isSort == 1 ? 2 : 1; //设置点击后的值
    let dataAry = this.data.dataAry;//获取数据
    if (dataAry.chapterList && dataAry.chapterList.length !== 0) {
      dataAry.chapterList.reverse(); //翻转数组顺序
      this.setData({
        isSort: isSort,
        dataAry: dataAry
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    /*
    * *** wbcomic/comic/comic_show?comic_id=68491 摘要页接口
    * *** wbcomic/comic/comic_comment_list?comic_id=24&page_num=1&rows_num=10&_debug_=yes 评论列表
    * */
   console.log(options)
    //comic_id
    let comic_id = options.comic_id;
    let comic_name=options.comic_name
    //comic_id= options.comic_id ? options.comic_id : 68023;//24 68491
    // comic_id = 68491;
    let page_num = 1;//页码
    let rows_num = 10;//每页条数
    let comicShowUrl = 'wbcomic/comic/comic_show';//摘要页接口前缀
    let comicCommentListUrl = 'wbcomic/comic/comic_comment_list';//摘要页评论接口
     
    /*
    * ***comicShowFn  摘要页接口promise对象
    * @ comicShowUrl 必要参数 请求接口前缀
    * @ comic_id 必要参数 传递的参数
    * */
    // comic_id  69273
    let comicShowFn = wxApi.get(`${comicShowUrl}?comic_id=${comic_id}`);
    this.setData({
      title: comic_name
    })

    /*
    * ***comicCommentListFn  摘要页评论promise对象
    * @ comicCommentListUrl  必要参数 请求接口前缀
    * @ comic_id 必要参数 传递的参数
    * @ page_num 必要参数 当前页码
    * @ rows_num 必要参数 当前评论条数
    * */
    let comicCommentListFn = wxApi.get(`${comicCommentListUrl}?comic_id=${comic_id}&page_num=${page_num}&rows_num=${rows_num}`);

    wxApi.getNetworkType().then((NetworkType) => {
      let networkType = NetworkType.networkType;
      if (networkType === 'none' || networkType === 'unknown') {
        //无网络什么都不做
        this.setData({
          networkType: false,
          type: 'net'
        })
      } else {
        //有网络
        /*
        *  调用 摘要页接口promise对象
        *  comic.upload_type： 根据这个字段 判断是否展示多个作者 1 author：字段作者列表 0 展示comic作者信息
        *  comic.directory_display：判断是目录展示方式 1表示9宫格，2表示横板
        *  comic.cover_display： 1表示使用 cover 2表示使用hcover
        **/
        comicShowFn.then((res) => {
          if (res.code === 1) {
            if (res.data.comic.comic_id) {
              //修改导航Title 文案
              // wx.setNavigationBarTitle({
              //   title:comic_name ? comic_name : '微博动漫'
              // })
              //存储 comic信息
              let DATA = res.data;
              let chapterList = null;
              DATA.comic.cover = DATA.comic.cover.replace(/_(s|m)\./img, '_b.')

              const {
                comic = {
                  try_read_chapters: []
                },
                comic_order = {},
                chapter_order = {},
                comic: {
                  comic_buy,
                  try_read_chapters,
                  pay_status
                },
                comic_order: {
                  order_status
                }
              } = DATA.is_allow_read
              const { chapter_id_arr = [] } = chapter_order

              //comic_buy    1章节购买 2全本购买
              //order_status 订单状态  0:默认 1:末付款 2:已付款
              //pay_status   付费状态  0:默认 1:免费 2:收费
              if ((comic_buy == 2 && order_status == 2) || pay_status == 1) { //漫画全本购买并已付款
                this.can_read_chapters = 'false';
              } else { //漫画章节购买
                if (pay_status == 2) { //收费
                  this.can_read_chapters = _.union(try_read_chapters, chapter_id_arr)
                } else {
                  this.can_read_chapters = 'false'
                }
              }
              //    console.log(this.can_read_chapters)
              if (this.can_read_chapters !== 'false' && this.can_read_chapters) {
                //chapterList = [];
                // console.log(DATA.chapter_list)
                DATA.chapter_list.forEach((item, index) => {
                  let tmpIsLocked = true;
                  this.can_read_chapters.forEach((id, i) => {
                    if (item.chapter_id === id) { //如果相等,就修改付费为免费章节,忽略过滤
                      tmpIsLocked = false;
                      // chapterList.push(item)
                    }
                  });
                  item.isLocked = tmpIsLocked;
                  //chapterList.push(item)
                });
                //DATA.chapterList = chapterList//.reverse();
              }
              DATA.chapterList = DATA.chapter_list.slice()
              DATA.chapterList.reverse()
              // console.log(DATA)
              this.setData({
                dataAry: DATA,
                type: null
              })

              let key = "comic_id_" + res.data.comic.comic_id;
              wxApi.getStorage(key).then((res) => { //获取阅读历史
                this.setData({
                  history: res.data
                })
              }).catch((err) => {
                this.setData({
                  history: null
                })//错误时候
              });
            }
            else {
              this.setData({
                dataAry: "{}",
                type: 'out'
              })
            }
          }
        }).catch((err) => {
          this.setData({
            networkType: false,
            type: 'net'
          })//错误时候
        });

        /*
        *
        * ***comicCommentListFn  调用 摘要页评论promise对象
        * */
        comicCommentListFn.then((res) => {
          //comicCommentData
          let dataList = res.data ? res.data : null; //存储数据变量

          //判断是否存在数据,存在进行格式化数据,不存在什么都不做
          if (res.code === 1 && dataList && dataList.data && dataList.data.length !== 0) {
            let dataArray = []; //定义空数组 , 存储格式化后的数据列表
            dataList.data.forEach((item, index) => { //循环整个数据组
              //判断单条评论内容是否存在 默认null;
              let content = dataList.content //dataList.content 是否存在
                ?
                (
                  dataList.content[item.comment_id] //dataList.content[item.comment_id] 是否存在
                    ?
                    dataList.content[item.comment_id]
                    :
                    null
                ) : null;

              let reply_list = dataList.reply_list  //dataList.reply_list 是否存在
                ?
                (
                  dataList.reply_list[item.comment_id]  //dataList.reply_list[item.comment_id] 是否存在
                    ?
                    dataList.reply_list[item.comment_id]
                    :
                    null
                ) : null;
              reply_list = reply_list && reply_list.length > 0 ? reply_list : null;//判断格式化后的数组是否为空

              let reply_content; //存储回复评论的数据
              if (reply_list && reply_list.length > 0) {
                reply_content = [];//给回复对象重新赋值
                reply_list.forEach((item, index) => {
                  if (dataList.reply_content[item.reply_id]) { //判断当前的回复评论id是否存在
                    let data = {
                      data: dataList.reply_content[item.reply_id],
                      user: dataList.user[item.user_id]
                    }
                    if (data.user && data.user.user_nickname) {
                      reply_content.push(data);//存储找到的数据
                    }
                  }
                })
              } else {
                reply_content = null;
              }


              //存储 单项数据
              let user = dataList.user[item.user_id] ? dataList.user[item.user_id] : null;
              //判断用户头是否有HTTPS|http 有什么也不做,没有拼接前缀
              if (user.user_avatar && !/^http[s]?:\/\//ig.test(user.user_avatar)) {
                user.user_avatar = dataList.site_image + user.user_avatar;
              }

              //格式化时间
              item.create_time = wxApi.formatTime(item.create_time, { y: true, h: true });

              //存储单个格式后的数据
              let obj = {
                data: {
                  item,
                  user
                },
                content,
                reply_list,
                reply_content
              }

              dataArray.push(obj) //存储格式化的数据到列表

            })


            /*
           * *** 赋值到this 中 comicCommentData
           * */
            if (dataArray.length > 3) {//判断是否要显示查看更多评论按钮
              this.setData({
                isSeeMore: true,
                comicCommentData: dataArray.slice(0, 3)
              })
              //isSeeMore
            } else {
              this.setData({
                comicCommentData: dataArray
              })
            }

          }
        }).catch((err) => {
          this.setData({
            networkType: false
          })//错误时候
        });
      }

    }).catch((err) => {
      this.setData({
        networkType: true,
        type: 'server'
      })
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      wx.setNavigationBarTitle({
              title:this.data.title ? this.data.title : '微博动漫'
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.ClickCatalog(); //每次显示页面检测 getStorage
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
    return {
      title: '各种有爱的动漫分享'
    }
  }

})
