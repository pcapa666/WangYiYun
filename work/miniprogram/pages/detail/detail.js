import request from '../../util/request'
// const cookie = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicNumber:0,
    userImage:"",
    userInfo:null,
    level:1,
    recentPlayList:[],
    loveMusicList:{},
    CreateMusicList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    //判断用户是否登录，获取用户登录信息
    this.getUser();
  },
  async getUser(){
    let cookie = wx.getStorageSync('cookie')
      if(cookie){
        let {data:res} = await request('/login/status',{cookie:cookie})
        if(res.data.code === 200){
           let uid = res.data.account.id
           let user = await request('/user/detail',{uid:uid})
           wx.setStorageSync('userInfo', user.data.profile)
           this.setData({
            userInfo:user.data.profile,
            level:user.data.level
           })
           this.getUserRecentPlayList()
           this.getUserplaylist()
        }
      }
  },

  //获取最近播放
  async getUserRecentPlayList(){
    const {userId} = this.data.userInfo
    let recentPlayListData = await request('/user/record',{uid:userId,type:0})
    const res = recentPlayListData.data
    if(res.code === 200){
      this.setData({
        recentPlayList:res.allData
      })
    }
  },

  //获取用户歌单
  async getUserplaylist(){
    const {userId} = this.data.userInfo
    let playListData = await request('/user/playlist',{uid:userId,limit:20})
    this.setData({
      loveMusicList:playListData.data.playlist[0],
      CreateMusicList:playListData.data.playlist.slice(1,playListData.data.playlist.length)
    })
  },

  //跳转登录
  GoLogin(){
    wx.navigateTo({
      url: '/pages/phoneLogin/phoneLogin',
    })
  },

  //跳转搜索
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },

  //判断是否登录，跳转喜欢的音乐的页面
  toSongList(){
    if(this.data.userInfo){
      wx.navigateTo({
        url: '/pages/songList/songList?Id='+ this.data.loveMusicList.id,
      })
    } else {
      wx.showToast({
        title: '未登录，即将跳转登录页',
        icon:'none'
      },1000)

      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/phoneLogin/phoneLogin',
        })
      },1000)
    }
  },
  //跳转歌单
  toPlayList(event){
    wx.navigateTo({
      url: '/pages/songList/songList?Id='+ event.currentTarget.id
    })
  },

  //跳转最近播放
  toRecently(){
    wx.navigateTo({
      url: '/pages/recently/recently',
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