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

    this.setData({ windowWidth})
    this.render(chapter_id)

    wxApi.getNetworkType().then(({ networkType }) => {
      if (networkType == 'none') this.setPageMessage('net')
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

      const {
        chapter = {},
        chapter_list,
        json_content,
        comic
      } = data;
      
      const { chapter_name } = chapter
      const { comic_id } = comic
      this.setData({
        json_content,
        comic,
        chapter
      })
      
      return { chapter_list, comic_id, chapter_id, chapter_name}
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
    this.fetchComic(chapter_id).then(({ chapter_list, comic_id, chapter_id, chapter_name})=>{
      wxApi.setNavigationBarTitle(chapter_name)
      this.findChapterList(chapter_id, chapter_list)
      this.setReadingLog({ comic_id, chapter_id, chapter_name })
    });
  },

  createNavUrlByIndex: function (chapter_id, chapter_list=[]) {
    chapter_id = chapter_id+''
    const length = chapter_list.length
    const { comic_id} = this.data.comic
    let next_url = '', prev_url = '', next = null, prev = null
    const index = _.findIndex(chapter_list, { chapter_id })

    if (index != -1) {
      next = index + 1 > length ? null : chapter_list[index + 1]
      prev = index - 1 < 0 ? null : chapter_list[index - 1]
    }

    if (prev) prev_url = this.getReadurlByParam({ ...prev, comic_id})
    if (next) next_url = this.getReadurlByParam({ ...next, comic_id})

    return { prev_url, next_url}
  },

  getReadurlByParam: function ({chapter_id, chapter_name, comic_id}, url = '/pages/read/read') {
    return wxApi.appendParams(url, { chapter_id, chapter_name, comic_id });
  },

  findChapterList: function (chapter_id, chapter_list=[]){
    const chapter_nav = { ...this.createNavUrlByIndex(chapter_id, chapter_list)}
    this.setData({ chapter_nav })
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
