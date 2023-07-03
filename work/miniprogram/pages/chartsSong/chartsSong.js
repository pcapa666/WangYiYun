// pages/recommendSong/recommendSong.js
import request from '../../util/request'
import PubSub from 'pubsub-js'


const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendList:[],
    index:0, //当前播放歌曲的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    this.getRecommendList(options.id);

    //在onLoad中订阅事件
    PubSub.subscribe('switchType',(_,data) => {
      console.log(1111,data);
      let {index,recommendList} = this.data
      let list = recommendList.tracks
      if(data === 'pre'){
          (index === 0) && (index = list.length)
          index-=1;
      } else {
          (index === list.length - 1) && (index = -1)
          index+=1;
      }
      //通过index获取到当前播放歌曲的位置
      let musicId = list[index].id;
      //更新下标
      this.setData({index})
      //再将消息发布回去
      PubSub.publish('musicId',musicId)
    })
  },

  async getRecommendList(id){
    let recommendListData = await request('/playlist/detail?id='+id)
    // console.log(options);
    // console.log(recommendListData.data.playlist);
    if(recommendListData.data.code === 200){
      this.setData({
        recommendList:recommendListData.data.playlist
      })
      console.log(this.data.recommendList);
    }
  },

  toSongDetail(event){
    let {song,index} = event.currentTarget.dataset
    this.setData({
      index
    })
    appInstance.globalData.songList = this.data.perFmList
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId='+ song.id
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