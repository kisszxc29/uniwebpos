import api from './api/index.js'
// 测试全局函数 包含接口请求
const addLog = (arg, type = '') => {
  try {
    let o = {
		un_id:uni.getStorageSync('MOT-SUNMISN') || '',
      detail: arg,
      type: type,
    }
    uni.request({
      url: 'http://124.243.187.153/paragon_crm/public/pos/addsocket_jinrong.php',
      data: {
        ...o,
      },
      header: {
        // application/x-www-form-urlencoded
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      success: (res) => {
      },
    })
  } catch (e) {
  }
}

export const global = {
  addLog
}