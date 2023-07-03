// components/searchHeader/searchHeader.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    
    // 输入框value
    searchContent:"",
    // 搜索内容
    // searchList:[],
    // 历史记录
    historyList:[],
  },
properties:{
    //关键字
    placeHolderData:{
      type:String,
      value:'默认'
    }
},
  /**
   * 组件的方法列表
   */
  methods: {

  //获取value值
  handleInputChange(event){
    this.setData({
      searchContent:event.detail.value
    })
    if(!this.data.searchContent){
      this.setData({
        searchList:[]
      })
      return;
    }
    this.triggerEvent('handleInputChange',this.data.searchContent)
  },



    //搜索按钮点击事件
  searchSongs(){
    this.triggerEvent('searchSongs',this.data.searchContent)
  },

    //清空输入框内容
    clearContent(){
      this.setData({
        searchContent:'',
        searchList:[]
      })
      this.triggerEvent('clearContent')
    },
  }
})
