//Page Object
import { request } from '../../request/index.js'
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    catesList: [],
    // 楼层数据
    floorList: []
  },
  //options(Object)
  onLoad: function (options) {
    // 发送异步请求获取轮播图数据，优化的手段可以通过es6的 Promise来解决这个问题

    // wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   method: 'GET',
    //   success: (result)=>{
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // })
    // request({ url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata' }).then(result => {
    //   this.setData({
    //     swiperList: result.data.message
    //   })
    // })
    this.getSwiperList();
    this.getCateList();
    this.getFloorList()
  },

  // 获取轮播图的数据
  getSwiperList() {
    request({ url: '/home/swiperdata' }).then(result => {
      this.setData({
        swiperList: result
      })
    })
  },
  // 获取导航的数据
  getCateList() {
    request({ url: '/home/catitems' }).then(result => {
      this.setData({
        catesList: result
      })
    })
  },
  // 获取楼层的数据
  getFloorList() {
    request({ url: '/home/floordata'}).then(result => {
      this.setData({
        floorList: result
      })
    })
  }
});