


Component({
  data: {
    floorstatus:true
  },
  methods:{
    btnSure: function () {
      this.triggerEvent('myevent', { floorstatus:false});    
    }
  }
 
})