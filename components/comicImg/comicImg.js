Component({
  properties: {
    order: {
      type: String,
      value: '1',
    },
    src: {
      type: String,
      value: '',
    },
    image_id: String,
    scale: Number,
    width: Number,
  },
  data: {
    loading: false,
    disabled: false,
    showDoanloadImgBtn: true,
  },
  attached() {
    const {width, scale, src} = this.properties
    this.loaded = 0
    this.loadingState = false
    this.loaderror = false
    this.src = src.replace(/http:\/\//i, 'https://')

    console.log('loading...', this.src)
    this.setData({
      width: width,
      height: width/scale,
      src: this.src
    });
  },
  methods: {
    load(e) {
      const { detail = {}, detail: {width, height} } = e
      const scale = width / height
      const { width: _width, scale: _scale} = this.properties
      if (_scale != scale)  {
        this.setData({
          height: _width / scale,
        })
      }
      if (this.loaded > 3) {
        this.setButtonState(true)
      }
      if (this.loaderror && !this.loadingState) {
        this.loaderror = false
        this.downloadImg()
      }
    },
    setButtonState(hidden = true) {
      const showDoanloadImgBtn = hidden 
      const loading = hidden
      const disabled = hidden
      this.setData({
        showDoanloadImgBtn,
        disabled,
        loading
      })
    },
    error(e) {
      console.log('error.')
      this.loadingState = false
      this.loaderror = true
      if (this.loaded < 3) {
        this.downloadImg()
      } else {
        this.setButtonState(false)
      }
    },
    downloadImg() {
      let { src, disabled, loading } = this.data
      const version = +new Date()
      src = this.src + '?v=' + version
      console.log('downloadImg.', src)
      if (this.loadingState) return
      this.loadingState = true
      disabled = !disabled
      loading = !loading
      this.loaded += 1
      this.setData({ src, disabled, loading })
    }
  }
})