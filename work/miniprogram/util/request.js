/* 发送ajax请求 */
/* 1. 封装功能函数 */

import config from './config'

export default (url,data={isLogin:false},method="GET") => {
  return new Promise((resolve,reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      // header:{
      //   // 'content-type': 'application/json',
      //   'cookie': data.isLogin?wx.getStorageSync('cookie'):""
      // },
      success:(res) => {
        resolve(res)  //作为promis的返回
      },
      fail:err => {
        reject(err)
      }
    })
  })
}