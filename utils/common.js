/**
 * 存储方法
 */
let localStorage = {
	set(key, val) {
		uni.setStorage({
			key: key,
			data: val,
			success: (res) => {
				return true
			},
			fail: () => {
				return false
			}
		})
	},
	get(key) {
		try {
			return uni.getStorageSync(key)
		} catch (e) {
			return ''
		}
	},
	remove(key) {
		try {
			uni.removeStorageSync(key)
		} catch (e) {}
	},
	clear() {
		uni.clearStorageSync()
	}
};

export default {
	localStorage
}
