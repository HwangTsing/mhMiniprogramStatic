const wxApi = require('../../utils/util.js');
const { _ } = require('../../utils/underscore.js');

// pages/read/read.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: 320,
    scrollY: 0,
    comicNavHolder: false,
    messageType: '',
    chapter: {},
    comic: {},
    json_content: {
      page: []
    },
    chapter_nav: null
  },

  onLoad: function (options) {
    const { chapter_id, chapter_name } = options;
    const { windowWidth, windowHeight } = wxApi.getSystemInfoSync()

    this.chapter_id = chapter_id
    this.chapter_name = chapter_name
    this.windowHeight = windowHeight

    wxApi.getNetworkType().then(({ networkType }) => {
      if (_.indexOf(['none', '2g'], networkType) != -1) {
        this.setPageMessage('net')
      } else {
        this.setData({ windowWidth })
        this.render(chapter_id)
      }
    }, () => {
      this.setData({ windowWidth })
      this.render(chapter_id)
    })

    // wxApi.onNetworkStatusChange(({ isConnected, networkType }) => {
    //   const {type} = this.data;
    //   if (!isConnected || networkType == 'none') return this.setPageMessage('net')
    //   console.log('type', this.data.messageType)
    //   //this.setPageMessage('')
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wxApi.setNavigationBarTitle(this.chapter_name);
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

  onPageScroll: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    // return {
    //   path: '/pages/index/index',
    //   success: function(res) {},
    //   fail: function(res) {}
    // }
  },

  setPageMessage: function (type) {
    wxApi.setMessageType(this, type)
  },

  fetchComic: function (chapter_id) {
    const create_source = "microprogram";
    return wxApi.get('wbcomic/comic/comic_play', {
      data: {
        chapter_id,
        create_source
      }
    }).then(({ code, message, data } = {}) => {
      if (!data || !code) {
        this.setPageMessage('server')
        return {}
      }

      if (data.json_content == null) data.json_content = { page: [] }

      const {
        chapter = {},
        chapter_list = [],
        json_content = { page: [] },
        json_content: { page },
        is_allow_read,
        comic
      } = data;

      const { chapter_name } = chapter
      const { comic_id } = comic
      this.setData({
        comic,
        chapter
      })
      this.isAllowRead = is_allow_read;

      if ( page.length > 0) this.setData({ json_content })
      if (!chapter_list.length) {
        this.setPageMessage('out')
      } else if (!(page&&page.length)) {
        this.setPageMessage('lose')
      }

      return { chapter_list, comic_id, chapter_id, chapter_name}
    }, () => {
        this.setPageMessage('server')
    })
  },

  tapScrollHandler: function ({ detail: { y }, currentTarget: { offsetTop }, touches: [{ clientY }] }){
    const scrollY = y - clientY
    const _scrollTop = scrollY < offsetTop ? (clientY - offsetTop + scrollY) : clientY
    const scrollTop = _scrollTop < this.windowHeight / 2 ? (scrollY - this.windowHeight < 0 ? 0 : scrollY - this.windowHeight) : scrollY + this.windowHeight

    wxApi.pageScrollTo({ scrollTop })
  },

  render: function (chapter_id = 9){
    //wxApi.pageScrollTo({scrollTop: 0});
    if (!chapter_id) return this.setPageMessage('noExist')
    this.fetchComic(chapter_id).then(({ chapter_list, comic_id, chapter_id, chapter_name} = {})=>{
      if (!comic_id || !chapter_id) return
      wxApi.setNavigationBarTitle(chapter_name)
      this.findChapterList(chapter_id, chapter_list)
      this.setReadingLog({ comic_id, chapter_id, chapter_name })
    });
  },

  createNavUrlByIndex: function (chapter_id, chapter_list=[]) {
    let time = +new Date()
    chapter_id = chapter_id+''
    const { comic_id} = this.data.comic
    let next_url = '', prev_url = '', next = null, prev = null
    const { comic = { try_read_chapters: [] }, chapter_order = {}, comic: { try_read_chapters, pay_status, pay_price } } = this.isAllowRead

    const { chapter_id_arr = [] } = chapter_order
    this.comicPayStatus = pay_status
    this.comicPayPrice = pay_price

    if (pay_status == 2 && pay_price > 0) {
      this.can_read_chapters = _.union(try_read_chapters, chapter_id_arr)
    } else {
      this.can_read_chapters = try_read_chapters
    }

    // console.log('can_read_chapters', this.can_read_chapters, chapter_id_arr)
    const index = _.findIndex(chapter_list, { chapter_id })

    if (index != -1) {
      next = this.findNextChapter(index, chapter_list)
      prev = this.findPrevChapter(index, chapter_list)
    }
    console.log(+new Date() - time)
    if (prev) prev_url = this.getReadurlByParam({ ...prev, comic_id})
    if (next) next_url = this.getReadurlByParam({ ...next, comic_id})

    return { prev_url, next_url}
  },

  findNextChapter: function (index, chapters){
    const _index = index + 1
    
    return this.findChapter(_index, chapters, 'findNextChapter')
  },

  findPrevChapter: function (index, chapters) {
    const _index = index - 1
    return this.findChapter(_index, chapters, 'findPrevChapter')
  },

  findChapter: function (index, chapters, action) {
    const length = chapters.length
    if (index < 0 || index >= length) return null

    const can_read_chapters = this.can_read_chapters
    const { chapter_id, chapter_name, chapter_pay_price } = chapters[index]
    let isNeed = false
    console.log(action, chapter_id, chapter_name, chapter_pay_price, _.indexOf(can_read_chapters, chapter_id))
    if (this.comicPayStatus == 2 && this.comicPayPrice > 0) {
      if (_.indexOf(can_read_chapters, chapter_id) == -1) isNeed = true
    } else {
      if (chapter_pay_price > 0 && _.indexOf(can_read_chapters, chapter_id) == -1) isNeed = true
    }

    if (isNeed) {
      return this[action](index, chapters)
    }

    return { chapter_id, chapter_name }
  },

  getReadurlByParam: function ({chapter_id, chapter_name, comic_id}, url = '/pages/read/read') {
    return wxApi.appendParams(url, { chapter_id, chapter_name, comic_id });
  },

  findChapterList: function (chapter_id, chapter_list=[]){
    const chapter_nav = { ...this.createNavUrlByIndex(chapter_id, chapter_list)}
    const { json_content: { page } } = this.data
    const comicNavHolder = page.length > 0
    this.setData({ chapter_nav, comicNavHolder })
  },

  chapterNavTap: function (e){
    const chapter_id = wxApi.getParam(e.detail.url, 'chapter_id');

    this.render(chapter_id)
    //this.triggerEvent('navchapter',{}, {})
  },

  setReadingLog: function (values) {
    const PREFIX = 'comic_id_'
    const { comic_id = '' } = values
    const KEY = PREFIX + comic_id

    if (comic_id) wxApi.setStorage(KEY, {...values})
  },

  onMyEvent: function(){
    console.log('onMyEvent');
  }

})
