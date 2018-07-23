const isDev = true
const baseUrl = isDev ? 'http://manhua.weibo.cn/' : 'https://apiv2.manhua.weibo.com/'
// 测试接口
//const baseUrl = 'http://manhua.weibo.cn/'

module.exports = {
  baseUrl,
  isDev
}
