# uts-lf-scan-code安卓超丝滑的扫码插件

## Android 平台

1. 下载插件并导入你的项目
2. 在你的页面import引入这个插件
3. 制作自定义基座
4. 运行自定义基座


无需注册账号 无需添加应用 无需配置密钥 引入插件打包即用

接入的谷歌扫码器（ML Kit Barcode Scanning API）
能自动识别大多数标准格式
线性格式：Codabar、Code 39、Code 93、Code 128、EAN-8、EAN-13、ITF、UPC-A、UPC-E
2D 格式：Aztec、Data Matrix、PDF417、二维码
目前仅支持安卓 安卓版本需 >= 5.0
## 更新日志
### 1.1.0（2023-11-08）
可配置是否启用远距离扫码自动缩放
### 1.0.0（2023-11-06）
基于ML Kit Barcode Scanning API）实现安卓极速丝滑扫码
自动格式检测
能识别大多数标准格式
线性格式：Codabar、Code 39、Code 93、Code 128、EAN-8、EAN-13、ITF、UPC-A、UPC-E
2D 格式：Aztec、Data Matrix、PDF417、二维码


<br/>

# 不知道咋回事 插件发新版本时候一直提示我：上传插件失败：上传发布异常，请稍后再试。.....我只能替换掉示例项目了  如需自动缩放功能下载示例项目查看


lf-scan-code目录放在uni_modules下

index.uvue示例：

```
<template>
	<view class="content">
		<button class="scan-btn" @tap="scanCode">扫一扫</button>
		<view class="code-panel">
			<view class="code-label">
				<text>扫码结果：</text>
			</view>
			<view>
				<text class="code-value">{{codeResStr}}</text>
			</view>
		</view>
	</view>
</template>

<script lang="uts">
	import { initScanCode } from "../../uni_modules/lf-scan-code"
	export default {
		data() {
			return {
				codeResStr: ""
			}
		},
		onLoad() {

		},
		methods: {
			scanCode() {
				/**
				 * @param {boolean} zoom - 参数 zoom 不传默认为false 是否启用远距离扫码自动缩放
				 * @returns {Promise} - 返回包含扫描结果的 Promise 对象
				 * @example initScanCode(true).then...
				 */
				initScanCode().then((res : any) => {
					let resData = res as UTSJSONObject
					console.log(resData);
					if (resData['status'] == "success") {
						// 扫码成功结果
						this.codeResStr = resData['value'] as string;
					}
					if (resData['status'] == "cancel") {
						uni.showToast({
							title: "用户取消了操作",
							icon: "none"
						})
					}
					if (resData['status'] == "error") {
						console.log("报错了：", res['error']);
					}
				})
			}
		}
	}
</script>

<style>
	.content {
		margin-top: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.scan-btn {
		background-color: pink;
		width: 300rpx;
		margin-top: 0;
		margin-right: auto;
		margin-bottom: 0;
		margin-left: auto;
	}

	.code-panel {
		margin-top: 200rpx;
	}

	.code-label {
		text-align: center;
	}

	.code-value {
		margin-top: 20rpx;
		color: mediumvioletred;
		font-size: 36rpx;
		text-align: center;
	}
</style>

```

## iOS 平台
暂不支持


## 相关开发文档

- [UTS 语法](https://uniapp.dcloud.net.cn/tutorial/syntax-uts.html)
- [UTS 原生插件](https://uniapp.dcloud.net.cn/plugin/uts-plugin.html)
