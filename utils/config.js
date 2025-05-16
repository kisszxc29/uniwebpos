//const url = "http://merchant-stage.uniwebpay.com/app-rest" // 测试
const url = "https://app.uniwebpay.com/app-rest" // 正式 
//const url = "https://app-pciss.uniwebpay.com/app-rest"
// const url = "https://merchant-stage.uniwebpay.com"

// http://ec2-54-169-199-240.ap-southeast-1.compute.amazonaws.com:9059/acquirerStore/selectAcquirerStoreDtoWithAcquirer

var config = {
  HOST: url,
}
module.exports = config;
// 