//music.js
// let url = 'https://merchant-stage.uniwebpay.com/file'
let url = '/static/music'       

const innerAudioContext = uni.createInnerAudioContext();
		// innerAudioContext.autoplay = true;
		innerAudioContext.src = url+'/click.wav';
		
var music = {
	// 如果有更多声音的在下面接着创建
	// https://merchant-stage.uniwebpay.com/file/success.wav
	
	click() {
		innerAudioContext.stop()
		innerAudioContext.play()
	},
	success() {
		const innerAudioContext = uni.createInnerAudioContext();
		innerAudioContext.autoplay = true;
		innerAudioContext.src = url+'/success.wav';
		innerAudioContext.onPlay(() => {
			console.log('开始播放');
		});
		innerAudioContext.onError((res) => {
			console.log('播放错误',res);
		});
	},
	error() {
		const innerAudioContext = uni.createInnerAudioContext();
		innerAudioContext.autoplay = true;
		innerAudioContext.src = url+'/warning.wav';
		innerAudioContext.onPlay(() => {
			console.log('开始播放');
		});
		innerAudioContext.onError((res) => {
			console.log('播放错误',res);
		});
	},
}

module.exports = music;