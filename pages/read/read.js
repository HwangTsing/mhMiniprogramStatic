const wxApi = require('../../utils/util.js');
const { _ } = require('../../utils/underscore.js');

// pages/read/read.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: 320,
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  fetchComic: function (chapter_id) {
    const create_source = "microprogram";
    return wxApi.get('wbcomic/comic/comic_play', {
      data: {
        chapter_id,
        create_source
      }
    }).then(({ code, message, data }) => {

      const {
        chapter = {},
        chapter_list,
        json_content,
        comic
      } = data;
      
      const { chapter_name} = chapter
      
      this.setData({
        json_content,
        comic,
        chapter
      })
      
      return { chapter_list, chapter_id, chapter_name}
    })
  },

  scrollTo: function (x = 0, y = 0){

  },

  tapScrollHandler: function ({detail}){
    const windowHeight = this.windowHeight
    console.log(detail, windowHeight, detail.y / windowHeight)
  },

  render: function (chapter_id = 258951){
    wx.pageScrollTo({scrollTop: 0, duration: 0});
    
    this.fetchComic(chapter_id).then(({ chapter_list, chapter_id, chapter_name})=>{
      this.findChapterList(chapter_id, chapter_list)
      wxApi.setNavigationBarTitle(chapter_name)
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

  onMyEvent: function(){
    console.log('onMyEvent');
  }

})
