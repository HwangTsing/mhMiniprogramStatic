const isDev = true
const version = '1.1.0'
const baseUrl = !isDev ? 'https://apiv2.manhua.weibo.com/' : 'http://manhua.weibo.cn/'
// 测试接口
//const baseUrl = 'http://manhua.weibo.cn/'

module.exports = {
  baseUrl,
  isDev,
  version
}
