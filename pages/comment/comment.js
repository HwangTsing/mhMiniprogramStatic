const wxApi = require('../../utils/util.js');
const app = getApp();
// pages/read/read.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        comicCommentData: null,//存储的数据
        userList:null,//存储用户信息
        pageNum: 1,//页码
        rowsNum: 10,//每次获取的数据条数
        height: 0, //滚动区的高度
        isLoads: false,//是否先加载完效果成图
        pageTotal: 0,//一共可以下拉加载次数
        message: '',//加载提示语,
        isMessage:true,//是否显示加载提示语
        comicId: 0,//记录漫画的id
        networkType: true,//是否有网络
        url:null,
        type:'loading'
    },

    /*
    * ***getDataInfo 初始化数据
    * @comic_id 漫画id
    * @page_num  当前页码
    * @rows_num 每页返回多少条
    * */
    getDataInfo(comicId, pageNum, rowsNum) {
        this.setData({
            isLoads: true
        })
        wxApi.get('wbcomic/comic/comic_comment_list', {
            data: {
                comic_id: comicId,
                page_num: pageNum,
                rows_num: rowsNum,
                create_source: "wx"
            }
        }).then((res) => {
            //res {code, message, data}
            let dataList = res.data ? res.data : null; //存储数据变量
            let dataArray = this.data.comicCommentData ? this.data.comicCommentData : []; //定义空数组 , 存储格式化后的数据列表
            let userList = this.data.userList ? this.data.userList : {}; //定义空数组 , 存储格式化后的数据列表
            //判断是否存在数据,存在进行格式化数据,不存在什么都不做

            if (res.code === 1 && dataList && dataList.data) {
                if (dataList.data.length !== 0) {
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
                        if (reply_list && reply_list.length>0) {
                            reply_content = [];//给回复对象重新赋值
                            reply_list.forEach((item, index) => {
                                if (dataList.reply_content[item.reply_id]) { //判断当前的回复评论id是否存在
                                    let data = {
                                        data: dataList.reply_content[item.reply_id],
                                        user: dataList.user[item.user_id]
                                    }
                                    if(data.user && data.user.user_nickname){
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
                        if (user && user.user_avatar && !/^http[s]?:\/\//ig.test(user.user_avatar)) {
                            user.user_avatar = dataList.site_image + user.user_avatar;
                        }

                        //格式化时间
                        item.create_time = wxApi.formatTime(item.create_time, {y: true, h: true});

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
                }

                if( dataList.user){
                    for(let key in dataList.user){
                        let datas=dataList.user[key];
                        userList[key]=datas;
                    }
                    console.log(dataList.user)
                    // dataList.user.forEach((item,index)=>{
                    //     console.log(item)
                    //     //userList[item] //存储用户信息
                    // });
                }
                /*
               * *** 赋值到this 中 comicCommentData
               * */
                //console.log(dataList)
                let page_total=dataList.page_total;
                this.setData({
                    comicCommentData: dataArray, //存储数据
                    userList:userList,
                    isLoads: false,//改为可以下拉加载
                    pageNum: Number(pageNum) + 1,//修改页码状态
                    pageTotal: page_total,//保存可以下拉加载的次数
                    message: page_total > pageNum ? '加载中' : '没更多了',//存储提示词
                    isMessage:true,
                    comicId: comicId,//记录漫画的id
                    networkType: true,//是否有网络,
                    type:null
                })

            }
        }).catch((err)=>{
            console.log(err)
            this.setData({
                isLoads: false,
                networkType: false,//是否有网络
                isMessage:false,
            })
        })
    },
    /*
    * //下拉加载事件
    * */
    onScroll() {
        let comicId = this.data.comicId;
        let pageNum = this.data.pageNum;
        let rowsNum = this.data.rowsNum;

        let pageTotal = this.data.pageTotal;
        let isLoads = this.data.isLoads;
        if(isLoads){
            return
        }
        if ( pageTotal < pageNum) {
            //如果加载状态是true,一共可以下拉加载次数是否小于当前页码
            // 条件成立 什么都不做
            return
        } else {
            this.getDataInfo(comicId, pageNum, rowsNum);
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wxApi.getNetworkType().then((NetworkType)=>{
            let networkType = NetworkType.networkType
            if (networkType === 'none' || networkType === 'unknown') {
                //无网络什么都不做
                this.setData({
                    networkType: false,
                    type:'net'
                })

            } else {
                //有网络
                let comicId = options.comic_id;
                let pageNum = this.data.pageNum;
                let rowsNum = this.data.rowsNum;
                this.getDataInfo(comicId, pageNum, rowsNum);
                this.setData({
                    networkType: true,
                    type:null
                })
            }
        }).catch((err)=>{
            this.setData({
                networkType: false,
                type:'net'
            })
        })

        const url = wxApi.getPageUrl();//获取当前页面带有参数的路径
        console.log(url)
        const { windowHeight } = wxApi.getSystemInfoSync(); //获取设备信息
        this.setData({
            height: windowHeight
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

    }
})
