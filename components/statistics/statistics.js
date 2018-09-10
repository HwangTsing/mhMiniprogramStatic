const wxApi = require("../../utils/util.js")
const app = getApp();
Component({
    /**
    * 组件的属性列表
    */
    properties: {
        baseUrl:{
            type:String,
            value:'',
        },
        comicId:{
            type:String,
            value:''
        },
        bannerIndex:{
            type:String,
            value:''
        },
        

    },
    options:{
        multipleSlots:true
    },

    /**
    * 组件的初始数据
    */
    data: {
        statisticsUrl:"",
        sysInfo:{},
    },
    attached (){
    },
    ready:function(){
        let sysInfo;
        let _this = this;
        wxApi.getStorage('sysInfo').then((res)=>{
            _this.setData({
                sysInfo:res.data
            })
        }).catch((res)=>{
            sysInfo = wxApi.getSystemInfoSync()
            wxApi.setStorage('sysInfo',sysInfo);
            _this.setData({
                sysInfo:sysInfo
            })
        })

    },

    /**
    * 组件的方法列表
    */
    methods: {
        changePath:function(event_id,attach_info){
            let _this = this
            let event_time = new Date().getTime();
            let sysInfo = this.data.sysInfo;
            Promise.all([wxApi.getStorage('id'),wxApi.getStorage('session_id'),wxApi.getStorage('device_id')]).then((res)=>{
                attach_info.gender = res[0].data == 1 ? 2 : 1;
                let eventId = JSON.stringify(event_id);
                let attachInfo = JSON.stringify(attach_info);
                let paramArr = ["",res[2].data,sysInfo.system,sysInfo.model,'1.2.0',eventId,attachInfo,event_time,res[1].data,'mini_prog','Weixin'];
                console.log(this.properties.baseUrl+paramArr.join("\\001"))
                this.setData({
                    statisticsUrl:this.properties.baseUrl+paramArr.join("\\001")
                })
            })
        },
        shareStatistics:function(){
            let _this = this
            let event_time = new Date().getTime();
            let sysInfo = this.data.sysInfo;
            Promise.all([wxApi.getStorage('id'),wxApi.getStorage('session_id'),wxApi.getStorage('device_id')]).then((res)=>{
                let eventId = "{l1_id:'99',l2_id:'033',l3_id:'001'}";
                let attachInfo = JSON.stringify({gender:res[0].data == 1 ? 2 : 1});
                let paramArr = ["",res[2].data,sysInfo.system,sysInfo.model,'1.2.0',eventId,attachInfo,event_time,res[1].data,'mini_prog','Weixin'];
                console.log(this.properties.baseUrl+paramArr.join("\\001"))
                this.setData({
                    statisticsUrl:this.properties.baseUrl+paramArr.join("\\001")
                })
            })
        },
        pageStatistics:function(start_time){
            let _this = this;
            let page_name = wxApi.getCurrentRoute();
            let refer_page_name = app.globalData.refer_page_name;
            let end_time = new Date().getTime();
            this.setData({
                statisticsUrl:"http://apiv2.manhua.weibo.com/static/tongji/tp?s="
            })
            let sysInfo = this.data.sysInfo;
            Promise.all([wxApi.getStorage('id'),wxApi.getStorage('session_id'),wxApi.getStorage('device_id')]).then((res)=>{
                let attachInfo = JSON.stringify({gender:res[0].data == 1 ? 2 : 1});
                let paramArr = ["",res[2].data,sysInfo.system,sysInfo.model,'1.2.0',start_time,end_time,page_name,refer_page_name,attachInfo,res[1].data,'mini_prog','Weixin'];
                console.log(this.properties.baseUrl+paramArr.join("\\001"))
                this.setData({
                    statisticsUrl:this.properties.baseUrl+paramArr.join("\\001")
                })
                app.globalData.refer_page_name = page_name;
            })
        }
    }
})
