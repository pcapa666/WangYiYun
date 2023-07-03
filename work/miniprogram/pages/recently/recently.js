// pages/recently/recently.js
import request from '../../util/request'
import PubSub from 'pubsub-js'

const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recentList:[],
    total:0,
    index:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getRecentList();
     //在onLoad中订阅事件
     PubSub.subscribe('switchType',(_,data) => {
      let {index} = this.data
      let recentList = appInstance.globalData.songList
      if(data === 'pre'){
          (index === 0) && (index = recentList.length)
          index-=1;
      } else {
          (index === recentList.length - 1) && (index = -1)
          index+=1;
      }
      //通过index获取到当前播放歌曲的位置
      let musicId = recentList[index].data.id;
      //更新下标
      this.setData({index})
      //再将消息发布回去
      PubSub.publish('musicId',musicId)
    })
  },
  async getRecentList(){
    let cookie = wx.getStorageSync('cookie');
    let {data:res} = await request('/record/recent/song',{limit:50,cookie})
    this.setData({
      recentList:res.data.list,
      total:res.data.total
    })
  },

  toSongDetail(event){
    let id = event.currentTarget.id
    appInstance.globalData.songList = this.data.recentList
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId='+id,
    })
  },

  //播放全部
  allRecentPlay(){
    let {recentList} = this.data
    appInstance.globalData.songList = recentList
    console.log(recentList[0])
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId='+recentList[0].data.id,
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