const wxApi = require('../../utils/util.js');
const app = getApp();



Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabList:null,//日期时间列表
        comicList:null,//数据列表
        pubDay:'',//选中的日期时间
        pageNum: 1,//页码
        rowsNum: 10,//每次获取的数据条数
        height: 0, //滚动区的高
        message: '',//加载提示语,
        isMessage:true,//是否显示加载提示语
        networkType: true,//是否有网络
        url:'wbcomic/comic/daypub_list',
        type:'loading'
    },

    //http://api.manhua.weibo.com/wbcomic/comic/daypub_list?_debug_=yes&page_num=1&rows_num=20&pub_day=20180331
    /*
    
    pub_day	    放送时间（第一次请求传空，以服务器时间为准，之后带相应参数）
    page_num	页数
    rows_num	每页条数
    async function a(){
    await 
}
    */
    formatData( { myData=[], comicList={}, chapterList={}, cateList={} }={} ){
        let ary=this.data.comicList;
        ary=ary?ary:[];
        
        myData.forEach( ( itme,index ) => {
             let obj={
                data:itme,
                comic:comicList[itme.comic_id]?comicList[itme.comic_id]:{}, 
                cate:cateList[itme.comic_id][0]?cateList[itme.comic_id][0]:{}
             } 
             obj.lastChapter=chapterList[obj.comic.last_chapter_id]?chapterList[obj.comic.last_chapter_id]:{};
             
             ary.push(obj);

        });
        return ary;
    },
    daypubList: function({ url='', pubDay="", pageNum=1, rowsNum=10 }={}){
        let data={
            pub_day: pubDay,
            page_num: pageNum,
            rows_num: rowsNum,
        }
        
         wxApi.get(url,{data}).then(({code,data,message,tab_list:tabList})=>{
            console.log(code,data,message,tabList)
            if(!pubDay){
                this.setData({
                    tabList
                });
            };
            let { 
                    data:myData,
                    comic_list:comicList ,
                    chapter_list:chapterList , 
                    cate_list:cateList  
                } = data;
            let comicAry=this.formatData({
                myData,
                comicList,
                chapterList,
                cateList
            });
            console.log(comicAry)
            this.setData({
                comicList:comicAry,
            });     
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.daypubList({
            url:this.data.url
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
        console.log('onHide')
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
