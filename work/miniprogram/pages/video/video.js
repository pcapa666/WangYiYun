
import request from '../../util/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[],
    navId:"",
    videoList:[],
    videoId:"",
    videoUpdateTime:[],
    isTriggered:false,
  },


  async getVideoGroupListData(){
    let videoGroupListData = await request('/video/group/list')
    // console.log(videoGroupListData)
    this.setData({
      videoGroupList:videoGroupListData.data.data.slice(0,14),
      navId:videoGroupListData.data.data[0].id
    })
    this.getVideoList(this.data.navId)
  },
 
  async getVideoList(navId){
    if(!navId) return
    let res = await request('/video/group',{id:navId,cookie:wx.getStorageSync('cookie')})
    let index = 0;
    let videoList = res.data.datas.map(item => {
      item.id = index++;
      return item
    })
    this.getVideoUrl(videoList)
  },

  async getVideoUrl(List){
   for (const i of List) {
     let urlItem = await request('/video/url',{id:i.data.vid})
     i.data.urlInfo = urlItem.data.urls[0]
   }
   wx.hideLoading();
    this.setData({
      videoList:List,
      isTriggered:false
    })
  },

  changeNav(event){
    let navId = event.currentTarget.id;
    console.log(navId)
    this.setData({
      navId:navId*1,
      videoList:[]
    })
    wx.showLoading({
      title: '正在加载...',
    })
    this.getVideoList(this.data.navId)
  },

  //视频的点击播放/继续播放的回调/点击下一个视频时暂停上一个
  handlePlay(event){
    /*
      解决多视频同时播放问题：
          1. 需要找到上一个正在播放的视频
          2. 在播放新视频前关闭上一个正在播放的视频
      关键：通过寻找播放视频的实例对象，判断两个实例对象是否为同一个
    */
    let vid = event.currentTarget.id;
    this.setData({
      videoId:vid
    })

    // this.videoContext && this.data.videoId !== vid && this.videoContext.pause()
    this.videoContext = wx.createVideoContext(vid);
    let {videoUpdateTime} = this.data;
    let videoItem = videoUpdateTime.find(item => item.vid === vid);
    if(videoItem){ //如果当前视频有播放记录，将跳到记录所在位置播放
      this.videoContext.seek(videoItem.currentTime)
    } else {
      this.videoContext.play();
    }
    //点击后直接播放
  },

  //监听视频播放进度的回调
  handleTimeUpdate(event){
    let videoTimeObj = {vid:event.currentTarget.id,currentTime:event.detail.currentTime}
    let {videoUpdateTime} = this.data
    //判断即将播放的视频是否有播放记录，且未播放完
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
    if(videoItem){
      videoItem.currentTime = event.detail.currentTime;
    } else {
      videoUpdateTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdateTime
    })
  },
  //监听视频播放结束后的回调
  handleEnded(event){
    let vid = event.currentTarget.id
    let {videoUpdateTime} = this.data
    let videoItem = videoUpdateTime.findIndex(item => item.vid === vid)
    videoUpdateTime.splice(videoItem,1)
    this.setData({
      videoUpdateTime
    })
  },

  //视频下拉刷新功能
  handleRefresher(){
    this.getVideoList(this.data.navId)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getVideoGroupListData()
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