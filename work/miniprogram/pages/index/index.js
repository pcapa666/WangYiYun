import request from '../../util/request'
import PubSub from 'pubsub-js'

const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],
    recommendList:[],
    topList:[],
    index:0
  },

  //获取轮播图
  async getBannerList(){
   const {data:res} = await request('/banner')
   if(res.code === 200){
    //  console.log(res.banners)
     this.setData({
       bannerList:res.banners
     })
   }
  },

  //获取推荐歌曲
  async getRecommendList(){
    const {data:res} = await request('/personalized',{limit:10})
    if(res.code === 200){
      // console.log(res)
      this.setData({
        recommendList:res.result
      })
    }
   },

   //获取排行榜数据
   async getTopList(){
       const {data:res} = await request('/toplist')
       const topList = res
       let resultArr =[]
       let i = 0;

       while(i<5){
           let topListId = topList.list[i].id
           const {data:result} = await request('/playlist/detail',{id:topListId})
           i++
          //  console.log(result)
           if(result.code === 200){
             //splice（会修改原数组进行增删改）  slice（不会修改原数组）
             let topListItem = {name:result.playlist.name,tracks:result.playlist.tracks.slice(0,3)}
             resultArr.push(topListItem)
             //不需要等待五次请求全部结束才更新，用户体验较好，但渲染次数会多一些
             this.setData({
              topList:resultArr
            })
           }
       }
   },

   //跳转搜索页面
   toSearch(){
     wx.navigateTo({
       url: '/pages/search/search',
     })
   },

   toSongSheet(event){
     let id = event.currentTarget.id
     wx.navigateTo({
       url: '/pages/songList/songList?Id=' + id,
     })
   },

   toSongDetail(event){
     let id = event.currentTarget.id
     let list = event.currentTarget.dataset.list
     console.log(id,list)
     let index = list.findIndex(e => e.id == id )
     this.setData({index})
     appInstance.globalData.songList = list
     wx.navigateTo({
       url: '/pages/songDetail/songDetail?musicId=' + id,
     })
   },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getBannerList();
    this.getRecommendList();
    this.getTopList();

    PubSub.subscribe('switchType',(_,data) => {
      console.log(data);
      let {index} = this.data
      let playList = appInstance.globalData.songList
      if(data === 'pre'){
          (index === 0) && (index = playList.length)
          index-=1;
      } else {
          playList && (index === playList.length - 1) && (index = -1)
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