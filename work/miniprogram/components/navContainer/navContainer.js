import request from '../../util/request'
import PubSub from 'pubsub-js'

const appInstance = getApp()
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
    perFmList:[],
    index:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goRecommendSong(){
      wx.navigateTo({
        url: '/pages/recommendSong/recommendSong',
      })
    },
    async toPersonalFm(){
      let perFm = await request('/personal_fm',{cookie:wx.getStorageSync('cookie')})
      this.setData({
        perFmList:perFm.data.data
      })
      appInstance.globalData.songList = this.data.perFmList
      wx.navigateTo({
        url: '/pages/songDetail/songDetail?musicId=' + perFm.data.data[0].id,
      })
    },

    toCharts(){
      wx.navigateTo({
        url: '/pages/charts/charts',
      })
    },

    pub(){
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
    }
  },
  created(){
    
  }
})
