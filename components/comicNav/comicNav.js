Component({
  properties: {
    text: String,
    nav: Object,
    action: String
  },
  data: {
    navClass: '',
    floorstatus: false
  },
  attached () {
    this.popup = this.selectComponent('#popup')
  },
  methods: {
    chargePop () {
      this.popup.open()
    }
  }
})