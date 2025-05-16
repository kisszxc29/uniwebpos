/**
 * 登录注册模块接口列表
 */

import base from './base'; // 导入接口域名列表
import Request from '../request'; // 导入http中创建的axios实例
let axios = new Request()
const loading = base.loading
// 参数转换 get
function conversion(params) {
  let str = '?'
  for (let key in params) {
    str += `${key}=${params[key]}&`
  }
  return str.slice(0, -1)
}


const login = {
  // 登录接口
  terminalLogin(params, options) {
    return axios.post(`${base.api}/auth/terminalLogin`, params, options, loading);
  },
  // 获取websocket 地址
  getWebsocketBackupUrl(params, options) {
    return axios.get(`${base.api}/configuration/getWebsocketBackupUrl`, params, options, loading);
  },
  // 获取可以支付的方式
  selectAcquirerStoreDtoWithAcquirer(params, options) {
    return axios.get(`${base.api}/acquirerStore/selectAcquirerStoreDtoWithAcquirer`, params, options, loading);
  },
  // 查询历史交易记录  	?creationTimeStart=2023-08-15 00:00:00&creationTimeEnd=2023-08-20 00:00:00
  pageTransactionAndTransactionMetadata(params, options) {
    console.log(conversion(params))
    return axios.get(`${base.api}/transactionAndTransactionMetadata/pageTransactionAndTransactionMetadata` +
      conversion(params), params, options, loading);
  },
  // 打印总记录  	?printTypeFlag=terminal&creationTimeStart=2023-08-15 00:00:00&creationTimeEnd=2023-08-20 00:00:00
  // 旧的 transactionAndTransactionMetadata/printReceiptSummaryByDate
  printReceiptSummaryByDate(params, options) {
    return axios.get(`${base.api}/transactionAndTransactionMetadata/printReceiptSummaryByDate/v1` + conversion(
      params), params, options, loading);
  },
  printReceiptSummaryByDateV2(params, options) {
    return axios.get(`${base.api}/transactionAndTransactionMetadata/printReceiptSummaryByDate/v2` + conversion(
      params), params, options, loading);
  },
  // 支付 和 退款
  paymentPay(params, options) {
    return axios.post(`${base.api}/uniweb/paymentPay`, params, options, loading);
  },
  // 校验支付密码
  validateRefundPassword(params, options) {
    return axios.get(`${base.api}/store/validateRefundPassword` + conversion(params), params, options, loading);
  },
  validateRefundPasswordCard(params, options) {
    return axios.get(`${base.api}/store/validateRefundPasswordCard` + conversion(params), params, options, loading);
  },
  getCryptoData(params, options) {
    return axios.get(`${base.api}/crypto/getCryptoData` + conversion(params), params, options, loading);
  },
  selectCryptoTransaction(params, options) {
    return axios.get(`${base.api}/cryptoTransaction/selectCryptoTransaction` + conversion(params), params, options,
      loading);
  },
  get_upgrade(params, options) {
    return axios.get(`http://124.243.187.153/paragon_crm/public/pos/get_upgrade_shuaka.php` + conversion(params),
      params, options,
      loading);
  },
  // 根据token 获取storeName
  storeInfo(params, options) {
    return axios.get(`${base.api}/store/storeInfo` + conversion(params), params, options, loading);
  },
  // 根据token 获取storeName  https://app.uniwebpay.com/app-rest/transactionAndTransactionMetadata/selectTransactionById?id=1226956119910776832
  selectTransactionById(params, options) {
    return axios.get(`${base.api}/transactionAndTransactionMetadata/selectTransactionById` + conversion(params),
      params, options, loading);
  },
  selectTransactionDetailById(params, options) {
    return axios.get(`${base.api}/transactionAndTransactionMetadata/selectTransactionDetailById` + conversion(params),
      params, options, loading);
  },
  selectStoreDcsConfigurationList(params, options) {
    return axios.get(`${base.api}/storeDcsConfiguration/selectStoreDcsConfigurationList` + conversion(params), params,
      options, loading);
  },
  // 更新订单状态接口 
  updateDcsCardPayTransaction(params, options) {
    return axios.post(`${base.api}/transactionAndTransactionMetadata/updateDcsCardPayTransaction`, params, options,
      loading);
  },
  // 退款接口
  updateDcsCardPayRefundTransaction(params, options) {
    return axios.post(`${base.api}/transactionAndTransactionMetadata/updateDcsCardPayRefundTransaction`, params,
      options, loading);
  },
  selectLoginTerminalDtoBySerialNumber(params, options) {
    return axios.get(`${base.api}/terminal/selectLoginTerminalDtoBySerialNumber?serialNumber=`+params.serialNumber, params,
      options, loading);
  },
  selectTerminalPushTransactionDto(params, options) {
    return axios.get(`${base.api}/v1/uniwebPos/selectTerminalPushTransactionDto?serialNumber=`+params.serialNumber+`&storeId=`+params.storeId, params,
      options, loading);
  },
  cancelPosPayment(params, options) {
    return axios.post(`${base.api}/v1/uniwebPos/cancelPosPayment`, params,
      options, loading);
  },
  // 货币加密接口  http://ec2-3-0-17-112.ap-southeast-1.compute.amazonaws.com/app-rest/crypto/saveCyptoOrder
  saveCyptoOrder(params, options) {
    return axios.post(`${base.api}/crypto/saveCyptoOrder`, params,
      options, loading);
  },
  updateTransactionExtendByTransactionId(params, options) {
    return axios.put(`${base.api}/transactionExtend/updateTransactionExtendByTransactionId`, params,
      options, loading);
  },
  // {
  // 	"transactionId":1244650221494206464,
  // 	"cardNumber":"65521***12345",
  // 	"dcsPaymentMethod":"DINERS CLUB CARD OR DISCOVER CARD",
  // 	"paymentStatus":"success",
  // 	"errorMessage":"",
  // 	"acquirerTransactionId":"dcs1234566'
  // }

};

export default {
  ...login
};