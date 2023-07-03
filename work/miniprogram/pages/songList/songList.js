// pages/recommendSong/recommendSong.js
import request from '../../util/request'
import PubSub from 'pubsub-js'

const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playUserInfo:{},
    playList:[],
    index:0, //当前播放歌曲的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let id = options.Id;
    this.getPlayList(id);

    // //在onLoad中订阅事件
    PubSub.subscribe('switchType',(_,data) => {
      console.log(data);
      let {index} = this.data
      let playList = appInstance.globalData.songList
      if(data === 'pre'){
          (index === 0) && (index = playList.length)
          index-=1;
      } else {
          (index === playList.length - 1) && (index = -1)
          index+=1;
      }
      //通过index获取到当前播放歌曲的上一首/下一首的位置
      let musicId = playList[index].id;
      //更新下标
      this.setData({index})
      //再将消息发布回去
      PubSub.publish('musicId',musicId)
    })
  },

  async getPlayList(id){
    let res = await request('/playlist/detail',{id,cookie:wx.getStorageSync('cookie')})
    if(res.data.code === 200){
      this.setData({
        //数据全在playlist属性上
        playUserInfo:res.data.playlist,
        playList:res.data.playlist.tracks
      })
    }
  },

  toSongDetail(event){
    let {song,index} = event.currentTarget.dataset
    this.setData({
      index
    })
    appInstance.globalData.songList = this.data.playList
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId='+ song.id
    })
  },

  //播放全部
  allPlaySong(){
    let {id} = this.data.playList[0]
    this.setData({
      index:0
    })
    appInstance.globalData.songList = this.data.playList
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId='+ id
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