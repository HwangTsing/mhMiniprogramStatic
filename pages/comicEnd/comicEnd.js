const wxApi = require('../../utils/util.js');
const app = getApp();
/* 完结  */
Page({

    /**
     * 页面的初始数据
     */
    data: {
        comicEndList: null,//存储的数据
        networkType: true,//是否有网络
        url:'wbcomic/home/recommend_list?location_en=ending_works_list',
        type:'loading',
        siteImage:''
    },

    /**
     * *** formatData 格式化数据  返回值:数组
    */
    formatData(myArray){
        const comicEndList=this.data.comicEndList; //保存this中的数据
        let ary=comicEndList?comicEndList:[];//判断保存的数据是否存在  不存就是空数组存在就是原来的数组
        if(!myArray||myArray.length==0){ //如果传递的数组 不存在返回原来的数据
            return ary;
        }
        myArray.forEach( (item,index) => {
            //console.log(item)
            let { extra, cate_list:cateList }=item; //解构当前对象
            let comic = extra?extra:null; //存储comic信息
            let data = extra && extra.comic_id?{comic_id:extra.comic_id}:{}; //存点击跳转信息
            let cate=null; //存储标签信息
            if(cateList){ 
                cate=cateList[0]?cateList[0]:null
            }

            let obj={
                comic,
                data,
                cate,
                lastChapter:null,// 完结列表无最新章节
            };
            ary.push(obj); //添加到数组中
        } )

        return ary;// 返回格式化换完成的数据

    },
    /* 
        *** getComicEndList 获取完结列表数据信息
        @ url 必须传递的参数 请求数据的url
        @ data 保留参数后期扩展使用 选填
    */
    getComicEndList(url="",data={}){
        //发起get请求
        wxApi.get(url,{data}).then( ({ code, data, message }) =>{
            //console.log(code, data, message)
            let {
                ending_works_list:endList //解构后的别名
            }=data;//拆分data对象
            let comicEndList=this.formatData(endList) //调用格式化数据方法
            //console.log(comicEndList)
            if(comicEndList.length>0){ //判断格式化的数据是否值
                this.setData({ //有值:格式化数据后存储
                    comicEndList,
                    type:null,
                    networkType:true
                })
            }else{
                this.setData({ //无值
                    comicEndList,
                    type:'nothing',
                    networkType:true
                })
            }
        }).catch( e => {
            this.setData({
                networkType: false,
                type: 'server',
            })
        } )
       
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       this.getComicEndList(this.data.url);
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
