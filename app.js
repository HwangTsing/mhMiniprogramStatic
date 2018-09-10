//app.js
let wxApi = require("utils/util.js");
App({
  onLaunch: function () {
  	let tmpUserInfo;
  	wxApi.getStorage('device_id').then((res)=>{
  		tmpUserInfo = res.data
  	}).catch((res)=>{
  		wxApi.setStorage('device_id',wxApi.creatTmpUuid());
  	})
  	wxApi.getStorage('session_id',(res)=>{
  		let nowTime = new Date().getTime();
  		if(nowTime - res.data > 30000){
	  		wxApi.setStorage('session_id',nowTime+'');
  		}
  	}).catch((res)=>{
  		let session_id = new Date().getTime();
	  	wxApi.setStorage('session_id',session_id+'');
  	})
  },
  onHide:function(){
  	let session_id = new Date().getTime();
  	wx.setStorage('session_id',session_id+'');
  },
  globalData: {
    // wxApi: null,
    isConnected:true,//是否有网络
    refer_page_name:''
  }
})
