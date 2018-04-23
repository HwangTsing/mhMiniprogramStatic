const {
  baseUrl,
} = require('../config/index.js');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getPaths = (url = '') => {
  if (!/^(http[s]?:)/.test(url) ) {
    return baseUrl + url;
  }
  return url;
}
const ajax = (url, cfg = { data:{}}) => {

  const {
    data,
    header,
    method,
    dataType,
    complete,
    responseType,
  } = cfg;

  const promise = new Promise((resolve, reject) => {
    
    wx.request({
      url: getPaths(url),
      data,
      header,
      method,
      dataType,
      responseType,
      success({ data, statusCode, header }) {
        resolve(data, statusCode, header)
      },
      fail({ data, statusCode, header }) {
        resolve(data, statusCode, header)
      },
      complete,
    });
  })

  return promise;

}

const post = (url, cfg = {method: 'POST'}) => {
  return ajax(url, cfg)
}

const get = (url, cfg = {method: 'GET' }) => {
  return ajax(url, cfg);
}

const request = (url, cfg = {method: 'GET'}) => {
  return wx.request({
    url: getPaths(url),
    ...cfg,
  });
}

module.exports = {
  formatTime,
  ajax,
  get, 
  post,
  request,
}
