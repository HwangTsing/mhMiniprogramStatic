const wxApi = require('../../utils/util.js');

// pages/repiy/repiy.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        commentData: null,//存储的数据
        userList:null,
        replyList:null,
        pageNum: 1,//页码
        rowsNum: 10,//每次获取的数据条数
        height: 0, //滚动区的高度
        isLoads: false,//是否先加载完效果成图
        pageTotal: 0,//一共可以下拉加载次数
        message: '',//加载提示语,
        isMessage:true,//是否显示加载提示语
        commentId: 0,//记录评论的id
        networkType: true,//是否有网络
        type:'loading'
    },

    /*
    * ***getDataInfo 初始化数据
    * @comic_id 漫画id
    * @page_num  当前页码
    * @rows_num 每页返回多少条
    * */
    getDataInfo(commentId, pageNum, rowsNum) {
        this.setData({
            isLoads: true //设置是否可以滚动加载
        })
        // wbcomic/comic/comic_reply_list?comment_id=219&page_num=1&rows_num=10&_debug_=yes
        wxApi.get('wbcomic/comic/comic_reply_list', {
            data: {
                comment_id: commentId,
                page_num: pageNum,
                rows_num: rowsNum
            }
        }).then(({code,message,data}) => {
            let replyList=this.data.replyList?this.data.replyList:[];
            let userList = this.data.userList ? this.data.userList : {}; //定义空数组 , 存储格式化后的数据列表

            //console.log(code,message,data)
            if(code===1&&data.data.length!==0){
                data.data.forEach((item,index)=>{
                    /* 存储用户信息 */
                    let user=data.user[item.user_id]?data.user[item.user_id]:{
                        user_avatar:'',
                        user_nickname:''
                    };
                    //判断用户头是否有HTTPS|http 有什么也不做,没有拼接前缀
                    if (user && user.user_avatar && !/^http[s]?:\/\//ig.test(user.user_avatar)) {
                        user.user_avatar = data.site_image + user.user_avatar;
                    }
                    /* 存储评论内容 */
                    let content=data.content[item.reply_id]?data.content[item.reply_id]:{
                        reply_id:item.reply_id,
                        reply_content:''
                    };

                    /* 存储评论信息(id,时间戳等) */
                    let contentId= item;
                    contentId.create_time=wxApi.formatTime(contentId.create_time, {y: true, h: true});//格式化时间
                    let Data={
                        user,
                        content,
                        contentId,
                        replyContent:null,
                        isReplyContent:false
                    }
                    replyList.push(Data); //保存到创建的数组中
                })

                /* 存储用户信息 */
                if( data.user){ //未修改改完成
                    for(let key in data.user){
                        let datas=data.user[key];
                        userList[key]=datas;
                    }
                }
            }
            let page_total=data.page_total;
            this.setData({
                replyList: replyList, //存储数据
                userList:userList,
                isLoads: false,//改为可以下拉加载
                pageNum: Number(pageNum) + 1,//修改页码状态
                pageTotal: page_total,//保存可以下拉加载的次数
                message: page_total > pageNum ? '加载中' : '没更多了',//存储提示词
                isMessage:true,
                commentId: commentId,//记录漫画的id
                networkType: true,//是否有网络
                type:null
            })
        }).catch((err)=>{
            this.setData({
                isLoads: false,
                networkType: false,//是否有网络
                isMessage:false,
            })
        });

    },

    /*
    * 下拉加载事件
    * */
    onScroll() {
        //下拉加载事件
        let commentId = this.data.commentId;
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
            this.getDataInfo(commentId, pageNum, rowsNum);
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wxApi.getNetworkType().then((NetworkType)=>{
            let networkType = NetworkType.networkType;

            if (networkType === 'none' || networkType === 'unknown') {
                //无网络什么都不做
                this.setData({
                    networkType: false,
                    type:'net'
                })
                return
            } else {
                //有网络
                let commentData=JSON.parse(options.data);
                //console.log(commentData)
                let Data={
                    user:{
                        user_avatar:commentData.user_avatar,
                        user_nickname:commentData.user_nickname
                    },
                    content:{
                        comment_id:commentData.comment_id,
                        comment_content:commentData.comment_content
                    },
                    contentId:{
                        comment_id:commentData.comment_id,
                        comic_id:commentData.comic_id,
                        create_time:commentData.create_time,
                    },
                    replyContent:null,
                    isReplyContent:false
                }
                this.setData({
                    commentData: Data
                });

                let commentId = commentData.comment_id;
                let pageNum = this.data.pageNum;
                let rowsNum = this.data.rowsNum;

                this.getDataInfo(commentId,pageNum,rowsNum); //初始化数据
            }
        }).catch((err)=>{
            this.setData({
                networkType: false,
                type:'net'
            })
        })

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
