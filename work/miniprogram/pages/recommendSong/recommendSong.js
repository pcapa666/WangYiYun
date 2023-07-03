// pages/recommendSong/recommendSong.js
import request from '../../util/request'
import PubSub from 'pubsub-js'

const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    month:'',
    recommendList:[],
    index:0, //当前播放歌曲的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth() + 1
    })
    this.getRecommendList();

    //在onLoad中订阅事件
    PubSub.subscribe('switchType',(_,data) => {
      console.log(data);
      let {index} = this.data
      let recommendList = appInstance.globalData.songList
      if(data === 'pre'){
          (index === 0) && (index = recommendList.length)
          index-=1;
      } else {
          (index === recommendList.length - 1) && (index = -1)
          index+=1;
      }
      //通过index获取到当前播放歌曲的位置
      let musicId = recommendList[index].id;
      //更新下标
      this.setData({index})
      //再将消息发布回去
      PubSub.publish('musicId',musicId)
    })
  },

  async getRecommendList(){
    let recommendListData = await request('/recommend/songs',{cookie:wx.getStorageSync('cookie')})
    // console.log(recommendListData);
    if(recommendListData.data.code === 200){
      this.setData({
        recommendList:recommendListData.data.data.dailySongs
      })
    }
  },

  toSongDetail(event){
    let {song,index} = event.currentTarget.dataset
    this.setData({
      index
    })
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId='+ song.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth() + 1
    })
    this.getRecommendList();
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
    this.setData({
      day:new Date().getDate(),
      month:new Date().getMonth() + 1
    })
    this.getRecommendList();
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