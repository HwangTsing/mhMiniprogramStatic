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
    this.chapter_name = decodeURIComponent(chapter_name)
    this.windowHeight = windowHeight
    this.windowWidth = windowWidth

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
    wxApi.setNavigationBarTitle(this.chapter_name)
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

  onPageScroll: function ({ scrollTop }) {
    if (this.scrollTimer) clearTimeout(this.scrollTimer)
    this.scrollTimer = setTimeout( ()=> {
      this.setReadingLog({ ...this.readingLog, scrollTop} )
    }, 60 )

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '各种有爱的动漫分享'
    }
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

      if (data.json_content == null) data.json_content = {}
      const version = wxApi.getVersion()
      const {
        chapter = {},
        chapter_list = [],
        json_content = {},
        json_content: { page=[] },
        is_allow_read,
        site_ver = version,
        comic
      } = data;

      const { chapter_name } = chapter
      const { comic_id } = comic
      this.setData({
        comic,
        chapter,
        site_ver
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

  render: function (chapter_id){
    //wxApi.pageScrollTo({scrollTop: 0});
    if (!chapter_id) return this.setPageMessage('noExist')
    this.fetchComic(chapter_id).then(({ chapter_list, comic_id, chapter_id, chapter_name} = {})=>{
      if (!comic_id || !chapter_id) return
      wxApi.setNavigationBarTitle(chapter_name)

      const _windowWidth = this.windowWidth
      const _chapter_id = chapter_id
      const PREFIX = 'comic_id_'
      const KEY = PREFIX + comic_id

      this.findChapterList(chapter_id, chapter_list)
      this.readingLog = { comic_id, chapter_id, chapter_name, scrollTop: 0, windowWidth: _windowWidth }

      wxApi.getStorage(KEY).then(({ data = {}, data: {chapter_id, scrollTop = 0, windowWidth} })=>{
        scrollTop = scrollTop * (windowWidth > 0 ? _windowWidth / windowWidth : 1)
        if (_chapter_id == chapter_id) wxApi.pageScrollTo({ scrollTop, duration: 0});
        this.setReadingLog({ ...this.readingLog, scrollTop, windowWidth: _windowWidth})
      }, ()=> {
        this.setReadingLog({ ...this.readingLog})
      })

    });
  },

  createNavUrlByIndex: function (chapter_id, chapter_list=[]) {
    let time = +new Date()
    chapter_id = chapter_id+''
    const { comic_id} = this.data.comic
    let prev_nav = {}, next_nav = {}, next = null, prev = null
    const { comic = { try_read_chapters: [] }, comic_order = {}, chapter_order = {}, comic: { comic_buy, try_read_chapters, pay_status }, comic_order: { order_status } } = this.isAllowRead
    const { chapter_id_arr = [] } = chapter_order


    //comic_buy    1章节购买 2全本购买
    //order_status 订单状态  0:默认 1:末付款 2:已付款
    //pay_status   付费状态  0:默认 1:免费 2:收费
    this.chapter_ids = _.pluck(chapter_list, 'chapter_id')
    if ( (comic_buy == 2 && order_status == 2) || pay_status == 1) { //漫画全本购买并已付款 or 免费章节
      this.can_read_chapters = this.chapter_ids
      this.allowRead = true
    } else { //漫画章节购买
      if (pay_status == 2) { //收费
        this.can_read_chapters = _.union(try_read_chapters, chapter_id_arr)
      }
    }
    // console.log('this.can_read_chapters', this.can_read_chapters)
    // console.log('can_read_chapters', this.can_read_chapters, chapter_id_arr)
    const index = _.findIndex(chapter_list, { chapter_id })
    if (index != -1) {
      next = this.findNextChapter(index, chapter_list)
      prev = this.findPrevChapter(index, chapter_list)
    }
    // console.log(+new Date() - time)
    if (prev) prev_nav = this.getReadurlByParam({ ...prev, comic_id})
    if (next) next_nav = this.getReadurlByParam({ ...next, comic_id})

    return { prev_nav, next_nav}
  },

  findNextChapter: function (index, chapters){
    const _index = index + 1
    return this.findChapter(_index, chapters, 'findNextChapter')
  },

  findPrevChapter: function (index, chapters) {
    const _index = index - 1
    return this.findChapter(_index, chapters, 'findPrevChapter')
  },

  findChapter: function (index, chapters) {
    const length = chapters.length
    if (index < 0 || index >= length) return null

    const can_read_chapters = this.can_read_chapters
    const { chapter_id, chapter_name } = chapters[index]

    let is_charge = false
    let charge_chapters = _.difference(this.chapter_ids, can_read_chapters)
    // console.log('charge_chapters', charge_chapters)
    if( _.indexOf(charge_chapters, chapter_id) != -1 ) {
      is_charge = true
    }
    //console.log(action, chapter_id, chapter_name, chapter_pay_price, _.indexOf(can_read_chapters, chapter_id))
    // if (!this.allowRead && _.indexOf(can_read_chapters, chapter_id) == -1) {
    //   return this[action](index, chapters)
    // }
    return { chapter_id, chapter_name, is_charge }
  },

  getReadurlByParam: function ({chapter_id, chapter_name, is_charge, comic_id}, url = '/pages/read/read') {
    url = wxApi.appendParams(url, { chapter_id, chapter_name, comic_id })
    return {url, is_charge}
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

  setReadingLog: function (values, position = 0) {
    const PREFIX = 'comic_id_'
    const { comic_id = '' } = values
    const KEY = PREFIX + comic_id

    if (comic_id) {
      wxApi.setStorage(KEY, {...values})
    }
  },

  onMyEvent: function(){
    console.log('onMyEvent');
  }

})
