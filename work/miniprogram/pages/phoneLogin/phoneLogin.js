
import request from '../../util/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    unikey: '',//key
    qrurl: '',
    qrimgs: '',//二维码图片
    qrCheckData: {},//状态
    isLogin: false//是否登录
  },

  async getKey(){
    let {data:res} = await request('/login/qr/key',{timerstamp: new Date().getTime()})
    if(res.data.code===200){
      this.setData({
        unikey:res.data.unikey
      })
      this.loginQqr(this.data.unikey)
    }
  },

  async loginQqr(key){
    let {data:res} = await request('/login/qr/create',{
        key,
        qrimg: true,
        timerstamp: new Date().getTime(),//传入参数时间戳
    })
    if(res.code===200){
      this.setData({
        qrurl:res.data.qrurl,
        qrimgs:res.data.qrimg
      })
      this.qrCheck()
    }
  },

  async qrCheck() {
       let qrCheckData = await request('/login/qr/check', {
           key: this.data.unikey,
           timerstamp: new Date().getTime(),//传入参数时间戳
           withCredentials: true     
       })
       
       if(qrCheckData.statusCode===200){
         if(qrCheckData.data.code !== 803){
             setTimeout(() => {
               this.qrCheck();
             },2000)
         } else {
           console.log(qrCheckData)
           wx.setStorageSync('cookie',qrCheckData.data.cookie)
           wx.showToast({
             title: '登录成功,3秒后跳转...',
           },3000)
           wx.reLaunch({
            url: '/pages/detail/detail',
          })
         }
       }
    },

  onLoad(options) {
    this.getKey()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})