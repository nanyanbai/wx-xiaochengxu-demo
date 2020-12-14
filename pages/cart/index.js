import { getSetting, chooseAddress, openSetting } from "../../utils/asyncWx.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false
  },

  onShow () {
    // 获取缓存中的收货地址
    const address = wx.getStorageSync("address");
    // 获取缓存中的购物车的数据
    const cart = wx.getStorageSync("cart") || [];
    // 计算全选
    const allChecked = cart.length? cart.every(v=>v.checked) : false
    this.setData({ address, cart, allChecked });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  // 点击 收货地址
  async handleChooseAddress() {
    try {
      // 1 获取 权限状态
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 2 判断 权限状态
      if (scopeAddress === false) {
        await openSetting();
      }
      // 4 调用获取收货地址的 api
      let address = await chooseAddress();
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      // 存入到缓存中
      wx.setStorageSync('address', address);

    } catch (error) {
      console.log(error);
    }
  }
})

/**
 *  2 页面加载完毕
 *    1.获取本地存储中的地址数据
 *    2. 把数据 设置给data中的一个变量 
 * 
 * 3 
 */
