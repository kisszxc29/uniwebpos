# lime-scan
- 基于华为ScanKit的扫码插件，仅支持默认模式，目前只支持安卓


## 安装
导入插件后，自定义基座再使用。

### 基础使用

```html
<view style="padding: 30rpx 0;">扫描结果：{{result}}</view>
<button type="primary" @click="scan">开启扫描</button>
```
```
import {scanCode, ScanCodeOption, ScanCodeSuccessCallbackResult} from '@/uni_modules/lime-scan';

export default {
	data() {
		return {
			type: '',
			result: '',
		}
	},
	methods:{
		scan() {
			scanCode({
				success: (res: ScanCodeSuccessCallbackResult)=> {
					this.result = res.result
					console.log('res', res.scanType)
				}
			} as ScanCodeOption)
		}
	}
}
```
