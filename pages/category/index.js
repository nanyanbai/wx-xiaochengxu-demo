// pages/category/index.js
import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧的菜单数据
    leftMenuList: [],
    // 右侧的内容数据
    rightContent: [],
    // 被点击的左侧的菜单
    currentIndex: 0,
    // 右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },

  // 接口返回的数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 使用缓存技术
    /*
      小程序中： wx.setStorageSync("key","value"); wx.getStorageSync("key");
      小程序： 不存在 类型转换的这个操作， 存什么类型的数据进去，获取的时候就是什么类型
      1、 先判断一下本地存储中有没有旧的数据
      {time: Date.now(), data: [...]}
      2、没有旧数据 直接发送请求
      3、有旧的数据 同时旧的数据没有过期 就使用 本地存储中的旧数据即可
    */
    // 获取本地存储中的数据
    const Cates = wx.getStorageSync("cates");
    // 判断
    if (!Cates) {
      // 不存在 发送请求获取数据
      this.getCates()
    } else {
      // 有旧的数据   定义过期时间 
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates()
      } else {
        // 可以使用旧的数据
        this.Cates = Cates.data
        let leftMenuList = this.Cates.map(item => item.cat_name)
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
    
    this.getCates()
  },
  // 获取分类数据
  async getCates () {
    // request({ url: '/categories' }).then(res => {
    //   this.Cates = res.data.message
    //   // 把接口的数据存入到本地存储中
    //   wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })
    //   // 构造左侧的大菜单数据
    //   // let leftMenuList = this.Cates.map( item => {
    //   //   return item.cat_name
    //   // })
    //   // 简写
    //   let leftMenuList = this.Cates.map(item => item.cat_name)
    //   // 构造右侧的商品数据
    //   let rightContent = this.Cates[0].children
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })
    // 改造为es7 的async 和await 的写法 发送请求
    const res = await request({url: '/categories'})
      // this.Cates = res.data.message
      this.Cates = res
      wx.setStorageSync('cates', { time: Date.now(), data: this.Cates })
      let leftMenuList = this.Cates.map(item => item.cat_name)
      let rightContent = this.Cates[0].children
      this.setData({
        leftMenuList,
        rightContent
      })
  },
  // 左侧菜单的点击事件
  handleItemTap (e) {
    console.log(e)
    /*
    1 获取被点击的标题身上的索引 
    2 给data中的 currentIndex 赋值就可以了
    3 根据不同的索引来渲染右侧的商品内容
    */ 
    const { index } = e.currentTarget.dataset
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置 右侧内容的scroll-view 标签的距离顶部的距离
      screenTop: 0
    })
  }
})