Component({
  preventTouchMove:function() {},
  data: {
    "visible": false
  },
  methods:{
    open () {
      this.setData({"visible": true})
    },
    btnSure () {
      this.setData({"visible": false})
      //this.triggerEvent('myevent', { floorstatus:false});    
    }
  }
  
    
 
})