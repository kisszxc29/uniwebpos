/**
 * Request 1.0.6
 * @Class Request
 * @description luch-request 1.0.6 http请求插件
 * @Author lu-ch
 * @Date 2020-03-17
 * @Email webwork.s@qq.com
 * http://ext.dcloud.net.cn/plugin?id=392
 */

import config1 from './config.js'
import uuid from './uuid.js'

let baseUrl = '';
//#ifdef H5
baseUrl = process.env.NODE_ENV === 'development' ? "" : config1.HOST;
//#endif

//#ifndef H5
baseUrl = config1.HOST;
//#endif

export default class Request {
  config = {
    baseUrl,
    header: {
      'Accept': "application/json, text/plain, */*",
      // application/x-www-form-urlencoded
      'content-type': 'application/json; charset=utf-8',
    },
    method: 'GET',
    dataType: 'string',
    // #ifndef MP-ALIPAY || APP-PLUS
    responseType: 'text',
    // #endif
    custom: {},
    // #ifdef MP-ALIPAY
    timeout: 30000,
    // #endif
    // #ifdef APP-PLUS
    sslVerify: true
    // #endif
  }

  static posUrl(url) {
    /* 判断url是否为绝对路径 */
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
  }

  static mergeUrl(url, baseUrl, params) {
    let channelId = "";
    // #ifndef H5
    channelId = "channelId=wm"
    // #endif
    // #ifdef H5
    channelId = "channelId=app"
    // #endif
    let mergeUrl = Request.posUrl(url) ? url : `${baseUrl}${url}`
    if (Object.keys(params).length !== 0) {
      const paramsH = Request.addQueryString(params)
      mergeUrl += mergeUrl.includes('?') ? `&${paramsH}&` + channelId : `?${paramsH}&` + channelId
    }
    return mergeUrl
  }

  static addQueryString(params) {
    let paramsData = ''
    Object.keys(params).forEach(function(key) {
      paramsData += key + '=' + encodeURIComponent(params[key]) + '&'
    })
    return paramsData.substring(0, paramsData.length - 1)
  }

  /**
   * @property {Function} request 请求拦截器
   * @property {Function} response 响应拦截器
   * @type {{request: Request.interceptor.request, response: Request.interceptor.response}}
   */
  interceptor = {
    /**
     * @param {Request~requestCallback} cb - 请求之前拦截,接收一个函数（config, cancel）=> {return config}。第一个参数为全局config,第二个参数为函数，调用则取消本次请求。
     */
    request: (cb) => {
      if (cb) {
        this.requestBeforeFun = cb
      }
    },
    /**
     * @param {Request~responseCallback} cb 响应拦截器，对响应数据做点什么
     * @param {Request~responseErrCallback} ecb 响应拦截器，对响应错误做点什么
     */
    response: (cb, ecb) => {

      if (cb) {
        this.requestComFun = cb;
      }
      if (ecb) {
        this.requestComFail = ecb;
      }
    }
  }
  requestBeforeFun(config) {
    if (uni.getStorageSync('Authorization')) {
      config.header.Authorization = 'Bearer ' + uni.getStorageSync('Authorization') || ''
    }
    config.header.terminalId = uni.getStorageSync('terminalId') || ''
    config.header.Accept = "application/json, text/plain, */*"
    return config
  }

  requestComFun(response) {
    // console.log(response)
    if (response.data.code == -10) {
      // TODO: token过期之后的逻辑
      // uni.reLaunch({
      // 	url: '/pages/account/login'
      // })
    }
    // uni.hideLoading();
    return response
  }

  requestComFail(response) {
    // console.log(response)
    uni.hideLoading()
    if (response.data.code == 401) {
      // TODO: token过期之后的逻辑
      uni.navigateTo({
        url: '/pages/register/login/login'
      })
    }
    return response
  }

  /**
   * 自定义验证器，如果返回true 则进入响应拦截器的响应成功函数(resolve)，否则进入响应拦截器的响应错误函数(reject)
   * @param { Number } statusCode - 请求响应体statusCode（只读）
   * @return { Boolean } 如果为true,则 resolve, 否则 reject
   */
  validateStatus(statusCode) {
    return statusCode === 200
  }

  /**
   * @Function
   * @param {Request~setConfigCallback} f - 设置全局默认配置
   */
  setConfig(f) {
    this.config = f(this.config)
  }

  /**
   * @Function
   * @param {Object} options - 请求配置项
   * @prop {String} options.url - 请求路径
   * @prop {Object} options.data - 请求参数
   * @prop {Object} [options.responseType = config.responseType] [text|arraybuffer] - 响应的数据类型
   * @prop {Object} [options.dataType = config.dataType] - 如果设为 json，会尝试对返回的数据做一次 JSON.parse
   * @prop {Object} [options.header = config.header] - 请求header
   * @prop {Object} [options.method = config.method] - 请求方法
   * @returns {Promise<unknown>}
   */
  async request(options = {}) {
    // console.log(options, '请求的参数')
    if (options.loading) {
      uni.showLoading({
        title: "加载中..."
      })
    }
    let userId = uni.getStorageSync('userInfo').id || -1
    options.baseUrl = options.baseUrl || this.config.baseUrl
    options.dataType = options.dataType || this.config.dataType
    // #ifndef MP-ALIPAY || APP-PLUS
    options.responseType = options.responseType || this.config.responseType
    // #endif
    // #ifdef MP-ALIPAY
    options.timeout = options.timeout || this.config.timeout
    // #endif
    options.url = options.url || ''
    options.data = options.data || {}
    options.params = options.params || {}
    options.header = options.header || this.config.header
    options.method = options.method || this.config.method

    return new Promise((resolve, reject) => {
      let next = true
      const cancel = (t = 'handle cancel', config = options) => {
        const err = {
          errMsg: t,
          config: config
        }
        reject(err)
        next = false
      }

      const handleRe = {
        ...this.requestBeforeFun(options, cancel)
      }
      const _config = {
        ...handleRe
      }
      // console.log(handleRe, 'handleRe')
      if (!next) return
      const requestTask = uni.request({
        url: Request.mergeUrl(_config.url, _config.baseUrl, _config.params),
        data: _config.data,
        header: _config.header,
        method: _config.method,
        // #ifdef MP-ALIPAY
        timeout: _config.timeout,
        // #endif
        dataType: 'text',
        // #ifndef MP-ALIPAY || APP-PLUS
        responseType: _config.responseType,
        // #endif
        // #ifdef APP-PLUS
        sslVerify: _config.sslVerify,
        // #endif
        complete: (response) => {
          // console.log(response,Request.mergeUrl(_config.url, _config.baseUrl, _config.params),'url')
          response.config = handleRe
          uni.hideLoading()
          if (this.validateStatus(response.statusCode)) { // 成功
            let JsonBigstring = require('json-bigint')({
              storeAsString: true
            });
            let resData = JsonBigstring.parse(response.data)
            resolve(resData)
            try {
              let o = {
                params: JSON.stringify(_config.data) || '0',
                token: uni.getStorageSync('Authorization') || '1',
                shebei: uni.getStorageSync('MOT-SUNMISN') || '2',
                terminalId: uni.getStorageSync('terminalId') || '3',
                url: Request.mergeUrl(_config.url, _config.baseUrl, _config.params) || '4',
                detail: JSON.stringify(resData) || '5'
              }
              this.addLog(o)
            } catch (e) {
              //TODO handle the exception
            }
          } else {
            response = this.requestComFail(response)
            reject(response)
            try {
              let o = {
                params: JSON.stringify(_config.data) || '0',
                token: uni.getStorageSync('Authorization') || '1',
                shebei: uni.getStorageSync('MOT-SUNMISN') || '2',
                terminalId: uni.getStorageSync('terminalId') || '3',
                url: Request.mergeUrl(_config.url, _config.baseUrl, _config.params) || '4',
                detail: JSON.stringify(response) || '5'
              }
              this.addLog(o)
            } catch (e) {
              //TODO handle the exception
            }
          }
        }
      })
      if (handleRe.getTask) {
        handleRe.getTask(requestTask, handleRe)
      }
    })
  }
  addLog(o) {
    try {
      // console.log('日志接口入参:', o)
      uni.request({
        url: 'http://124.243.187.153/paragon_crm/public/pos/log_jinrong.php',
        data: {
          ...o
        },
        header: {
          // application/x-www-form-urlencoded
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: "POST",
        success: (res) => {
          // console.log(123,res)
        },
        fail: (fail) => {
          // console.log('日志接口fail:', fail)
        },
        complete: (com) => {
          // console.log('日志接口:', com)
        }
      })

    } catch (e) {
      //TODO handle the exception
    }

  }

  get(url, options = {}) {
    if ("string" == options) {
      options = {
        "header": {
          'content-type': "application/json; charset=utf-8"
        }
      }
    }
    return this.request({
      url,
      method: 'GET',
      ...options
    })
  }

  put(url, data, options = 'string', loading) {
    options = {
      "header": {
        'content-type': "application/json; charset=utf-8"
      }
    }
    return this.request({
      url,
      data,
      method: 'PUT',
      ...options,
      loading
    })
  }

  post(url, data, options = 'string', loading) {
    if ("string" == options) {
      options = {
        "header": {
          'content-type': "application/json; charset=utf-8"
        }
      }
    } else if ("json" == options) {
      options = {
        "header": {
          'content-type': "application/json;charset=UTF-8"
        }
      }
    }
    return this.request({
      url,
      data,
      method: 'POST',
      ...options,
      loading
    })
  }

}