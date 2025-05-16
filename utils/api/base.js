/**
 * 接口域名的管理
 */
let serverPort = '';
if(process.env.NODE_ENV === 'development'){ 
	console.log('开发环境') 
	serverPort = '/api'
	// #ifdef APP-PLUS
	serverPort = ''
	// #endif
}else{ 
	console.log('生产环境') 
	serverPort = ''
}
const base = {
    api: serverPort,
		loading:false
};

export default base;

