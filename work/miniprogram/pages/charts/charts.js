// pages/charts/charts.js
import request from '../../util/request'
import PubSub from 'pubsub-js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    Charts:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getCharts()
    // console.log(this.data.Charts);
  },
  async getCharts(){
    let Charts = await request('/toplist/detail');
    // console.log(Charts.data.list);
    if(Charts.data.code === 200){
      this.setData({
        Charts:Charts.data.list.slice(0,4)
      })
      console.log(this.data.Charts);
    }
  },
  goChartsSong(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/chartsSong/chartsSong?id='+id,
    })
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