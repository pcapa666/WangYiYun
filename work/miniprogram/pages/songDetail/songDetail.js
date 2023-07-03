// pages/songDetail/songDetail.js

import request from '../../util/request'
import PubSub from 'pubsub-js'
import dayjs from 'dayjs'

const appInstance = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false,
    icon:"icon-24gl-repeat2",
    iconArr:['icon-24gl-repeat2','icon-24gl-repeatOnce2','icon-24gl-shuffle'],
    i:0,
    song:{},  //音乐详情
    songName:"",
    musicId:"",  //音乐id
    backGroundImg:"",    //背景图片
    musicLink:"", //歌曲路径
    currentTime:"00:00", //歌曲实时时间
    durationTime:"00:00", //歌曲总时长
    currentTimeWidth:0, //实时进度条宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let musicId = options.musicId
    this.setData({
      icon:this.data.iconArr[this.data.i],
      musicId:musicId
    })
    this.getSongDetail(musicId);

    //判断当前页面音乐是否在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId ){
      this.setData({
        isPlay:true
      })
    } else {
      this.handleMusicPlay()
    }


    /*
      通过页面刚加载的创建控制音乐播放的实例，
      再挂载到this本身，通过该实例本身的方法可以监听到页面音乐的播放/暂停/停止
    */
    this.backgroundAudioManager = wx.getBackgroundAudioManager();

    //监听音乐播放/暂停/停止
    this.backgroundAudioManager.onPlay(()=>{
      console.log('play')
      this.changePlayState(true)
      //使用全局进行歌曲的状态播放保存
      appInstance.globalData.musicId = this.data.musicId
    })

    this.backgroundAudioManager.onPause(()=>{
      console.log('pause')
      this.changePlayState(false)
    })

    this.backgroundAudioManager.onStop(()=>{
      console.log('stop')
      this.changePlayState(false)
    })

    //音乐播放结束后，自动跳到下一首
    this.backgroundAudioManager.onEnded(() => {
      console.log('end')
      //直接通过消息发布
      PubSub.publish('switchType','next');

      this.backgroundAudioManager.stop()
    //订阅来自recommendSong页面发布的musicid消息
    PubSub.subscribe('musicId',(_,musicId) => {
      //取消订阅，如果不进行取消会导致该事件内部存在多个回调
      PubSub.unsubscribe('musicId')
      //通过id重新获取音乐
      this.getSongDetail(musicId);
      this.musicControl(true,musicId)
    })

      //再更新实时进度条和实时宽度
      this.setData({
        currentTime:"00:00", //歌曲实时时间
        currentTimeWidth:0, //实时进度条宽度
        isPlay:false
      })
    })

    //监听音乐实时播放的进度
    this.backgroundAudioManager.onTimeUpdate(() => {
      //其中两个的两个属性分别是获取当前音乐播放器中音乐的总时长和实时播放进度时长 duration，currentTime
      //由于dayjs必须使用毫秒换算，而currentTime所给的值是秒
      let currentTime = dayjs(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
      //由实时进度条/总进度条 = 实时长度/总长度来计算实时长度
      let currentTimeWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 480;
      this.setData({currentTime,currentTimeWidth})
    })

  },

  //修改播放状态的功能函数
  changePlayState(isPlay){
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay
  },

  //获取音乐详情
  async getSongDetail(ids){
    let res = await request('/song/detail',{ids})
    if(res.data.code === 200){
      this.setData({
        song:res.data.songs[0],
        songName:res.data.songs[0].name,
        backGroundImg:res.data.songs[0].al.picUrl,
        durationTime:dayjs(res.data.songs[0].dt).format("mm:ss"),
      })
      this.backgroundAudioManager.title = this.data.songName
    }
  },

  //点击播放歌曲
  handleMusicPlay(){
    let isPlay = !this.data.isPlay
    let {musicId,musicLink} = this.data
    this.musicControl(isPlay,musicId,musicLink)
  },

  //控制音乐播放/暂停的功能函数
  async musicControl(isPlay,musicId,musicLink){
    if(isPlay){
      //由于播放/暂停会导致多次请求音乐链接，通过musicLink进行判断
      if(!musicLink){
        let musicLinkData = await request('/song/url',{id:musicId})
        musicLink = musicLinkData.data.data[0].url
      }
      this.setData({musicLink});
      this.backgroundAudioManager.src = musicLink;  //音乐链接
      if(appInstance.globalData.musicId == musicId){
        this.backgroundAudioManager.play()
      }
    } else {
      this.backgroundAudioManager.pause()
    }
    this.setData({isPlay})
  },

  //上一首下一首按钮事件---通过pubsub发布消息，通知推荐歌单订阅消息
  handleSwitch(event){
    let type = event.currentTarget.id

    //之前的音乐停止播放
    this.backgroundAudioManager.stop()
    //订阅来自recommendSong页面发布的musicid消息
    PubSub.subscribe('musicId',(_,musicId) => {
      //取消订阅，如果不进行取消会导致该事件内部存在多个回调
      PubSub.unsubscribe('musicId')
      //通过id重新获取音乐
      this.getSongDetail(musicId);
      this.musicControl(true,musicId)
    })

    PubSub.publish('switchType',type)
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