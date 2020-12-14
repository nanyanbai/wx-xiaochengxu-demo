import { request } from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },

  // 商品对象 (这是个全局对象 在方法中可以访问的)
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goods_id } = options
    this.getGoodsDetail(goods_id)
  },

  // 获取商品详情数据
  async getGoodsDetail (goods_id) {
    const goodsObj = await request({ url:'/goods/detail',  data:{ goods_id }})
    this.GoodsInfo = goodsObj
    this.setData({
      goodsObj:{ // 后台返回了很多的数据， 处理只需要页面需要的数据
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone部分手机 不识别 webp图片格式 
          // 最好找到后台 让他进行修改 
          // 临时自己改 确保后台存在 1.webp => 1.jpg 
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      }
    })
  },

  // 点击轮播图 放大预览
  handlePrevewImage (e) {
    // 1 先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map( item => {
      return item.pics_mid
    })
    // 接收传递过来的图片url
    const current  = e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls
    })
  },

  // 点击 加入购物车
  handleCartAdd () {
    // 获取缓存中的购物车  数组
    let cart = wx.getStorageSync("cart") || [];
    // 判断 商品对象是否存在于购物车数组中
    let index = cart.findIndex(item => {
      return item.goods_id === this.GoodsInfo.goods_id
    })
    if (index === -1) {
      // 不存在 第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else  {
      // 已存在购物车
      cart[index].num++;
    }
    // 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // true 防止用户 手抖 疯狂点击按钮 
      mask: true
    });
  },

  // 点击 商品收藏图标
  handleCollect () {
    
  }

})


/**
 *  1、点击轮播图 
 *    1 给轮播图绑定点击事件
      2 调用小程序的api  previewImage
    2、商品收藏
      1 页面onShow的时候  加载缓存中的商品收藏的数据
      2 判断当前商品是不是被收藏 
        1 是 改变页面的图标
        2 不是 。。
      3 点击商品收藏按钮 
        1 判断该商品是否存在于缓存数组中
        2 已经存在 把该商品删除
        3 没有存在 把商品添加到收藏数组中 存入到缓存中即可  
 */