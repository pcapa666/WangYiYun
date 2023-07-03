import request from '../../util/request'
import PubSub from 'pubsub-js'
let timeout = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cloudSearchData:[],
    index:0, //当前播放歌曲的下标,
    //搜索关键字
    placeHolderData:'',
    searchContent:"",
    searchList:[],
    historyList:[],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.searchContent)
    this.setData({
      placeHolderData:options.searchContent
    })
    
    // console.log(this.data.placeHolderData);

    this.getMusicList();

    //在onLoad中订阅事件
    PubSub.subscribe('switchType',(_,data) => {
      console.log(1111,data);
      let list = this.data.cloudSearchData
      let {index} = this.data
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


  //搜索框
  handleInputChange(event){
    this.setData({
      searchContent:event.detail
    })
    if(!this.data.searchContent){
      this.setData({
        searchList:[]
      })
      return;
    }
    if(timeout) return
    timeout = setTimeout(() => {
      this.getSearchList();
      timeout = null
    },500)
  },
  // 清除inp
  clearContent(){
    this.setData({
      searchContent:'',
      searchList:[]
    })
  },
  // 搜索按钮
  searchSongs(){
    console.log('sssss')
    let {searchContent,historyList} = this.data
    if(historyList.indexOf(searchContent) !== -1){
      historyList.splice(historyList.indexOf(searchContent),1)
    } 
    historyList.unshift(searchContent)

    this.setData({historyList})
    wx.setStorageSync('searchHistory',historyList)
    this.setData({
      placeHolderData:searchContent
    })
    this.getMusicList()
  },
  async getSearchList(){
    let res = await request('/cloudsearch',{keywords:this.data.searchContent,limit:10});
    if(res.data.code === 200){
      this.setData({
        searchList:res.data.result.songs
      })
    }
  },
  //----------------------------------------------------------------


  async getMusicList(){
    let keywords = this.data.placeHolderData
    let res = await request('/cloudsearch',{keywords})
    console.log(res);
    if(res.data.code === 200){
      this.setData({
        cloudSearchData:res.data.result.songs,
        searchContent:""
      })
    }
    // console.log(this.data.recommendList);
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