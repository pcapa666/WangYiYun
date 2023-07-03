// pages/search/search.js
import request from '../../util/request'

let timeout = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeHolderData:"",
    hotList:[],
    searchContent:"",
    searchList:[],
    historyList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    //获取初始化数据
    this.getInitData();
    //获取本地历史记录
    this.getStorageHistory();
  },

  //获取input框关键字收索
  async getInitData(){
    let placeHolderData = await request('/search/default');
    let hotList = await request('/search/hot/detail');
    this.setData({
      placeHolderData:placeHolderData.data.data.showKeyword,
      hotList:hotList.data.data
    })
  },

  handleInputChange(event){
    this.setData({
      searchContent:event.detail.value.trim()
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

  async getSearchList(){
    let hotList = await request('/cloudsearch',{keywords:this.data.searchContent,limit:10});
    if(hotList.data.code === 200){
      this.setData({
        searchList:hotList.data.result.songs
      })
    }
  },

  //获取本地历史记录事件
  getStorageHistory(){
   let historyList = wx.getStorageSync('searchHistory');
   if(historyList){
    this.setData({historyList})
   }
  },

    //搜索按钮点击事件
  searchSongs(){
      let {searchContent,historyList} = this.data

      if(!searchContent){
        wx.showToast({
          title: '输入框不可为空',
          icon:'error'
        },1500)
        return;
      }

      if(historyList.indexOf(searchContent) !== -1){
        historyList.splice(historyList.indexOf(searchContent),1)
      } 
      historyList.unshift(searchContent)

      this.setData({historyList})
      wx.setStorageSync('searchHistory',historyList)
      wx.navigateTo({
        url: '/pages/searchList/searchList?searchContent=' + searchContent,
      })
    },

    //清空输入框内容
    clearContent(){
      this.setData({
        searchContent:'',
        searchList:[]
      })
    },

    //删除历史记录
    deleteHistory(){
      wx.showModal({
        title: '提示',
        content: '是否确认删除',
        complete: (res) => {
          if (res.confirm) {
            this.setData({
              historyList:[]
            })
            wx.removeStorageSync('searchHistory')
          }
        }
      })
    },

    selectHis(event){
      let hisItem = event.currentTarget.dataset.text
      let {historyList} = this.data
      if(historyList.indexOf(hisItem) !== -1){
        historyList.splice(historyList.indexOf(hisItem),1)
      } 
      historyList.unshift(hisItem)

      this.setData({historyList})
      wx.setStorageSync('searchHistory',historyList)
      wx.navigateTo({
        url: '/pages/searchList/searchList?searchContent=' + hisItem,
      })
    },

    //热搜版以及搜索内容点击事件
    toSearchList(event){
      let searchContent = event.currentTarget.dataset.context
      let {historyList} = this.data

      if(historyList.indexOf(searchContent) !== -1){
        historyList.splice(historyList.indexOf(searchContent),1)
      } 
      historyList.unshift(searchContent)

      this.setData({historyList})
      wx.setStorageSync('searchHistory',historyList)
      wx.navigateTo({
        url: '/pages/searchList/searchList?searchContent=' + searchContent,
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