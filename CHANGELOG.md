# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.1.0](https://github.com/LeafYeeXYZ/CyberLeaf/compare/v1.0.0...v1.1.0) (2025-01-06)


### Features

* 现在可以一键将特定设置恢复为默认值 ([4982bc9](https://github.com/LeafYeeXYZ/CyberLeaf/commit/4982bc974f9f2807c1f7c760c2d3e7bfc0b2c16e))
* 支持调整窗口相对大小 ([3fce95d](https://github.com/LeafYeeXYZ/CyberLeaf/commit/3fce95d3ec9672dcbf950f3db69cfd8c51f7e1a5))
* 支持手机等小屏幕设备使用 ([78a2109](https://github.com/LeafYeeXYZ/CyberLeaf/commit/78a2109e702265dd8b64109aa3f49ec921f350c2))


### Bug Fixes

* 修复了修改 TTS 地址时未清除测试缓存的潜在问题 ([e15dbaa](https://github.com/LeafYeeXYZ/CyberLeaf/commit/e15dbaaf84b8c0f233d8d5db4f4c781c8c15b7da))


### Refactoring

* 重构前端页面导航 UI ([d494624](https://github.com/LeafYeeXYZ/CyberLeaf/commit/d4946244fd400f1d3c192e753d66ebe35ae1e932))
* 重构优化消息显示的 UI (使用 @ant-design/x) ([fe44b2c](https://github.com/LeafYeeXYZ/CyberLeaf/commit/fe44b2c03e1ee802291f2be7fb0e6a2303e3b328))
* 重做说话聊天界面, 大幅优化交互效果 ([e6aac6f](https://github.com/LeafYeeXYZ/CyberLeaf/commit/e6aac6ff9afafaac27b43e14487712ea28949ac2))
* 重做文字聊天界面, 大幅优化交互效果 ([f592562](https://github.com/LeafYeeXYZ/CyberLeaf/commit/f5925624bef7b431986d36ae0624b4f8ec40cfaa))


### Improvements

* 使用缓存减少推理模型 API 测试频率 ([135a7da](https://github.com/LeafYeeXYZ/CyberLeaf/commit/135a7dabd08ff26ed29cc08962098a915670f981))
* 使用结果缓存优化 F5 TTS 测试效率 ([c3bdf51](https://github.com/LeafYeeXYZ/CyberLeaf/commit/c3bdf51288d3b6138f3ef88ccc0016db8022f7f8))
* 优化拆分句子的正则 ([dd1799f](https://github.com/LeafYeeXYZ/CyberLeaf/commit/dd1799f7ad10c68171060e8de1bb3d8b9fd236ba))
* 优化记忆界面的描述 ([054aa21](https://github.com/LeafYeeXYZ/CyberLeaf/commit/054aa2119a72ebbb2307393ebf2749523ac4f012))
* 优化移动端显示效果 ([e6b0cdb](https://github.com/LeafYeeXYZ/CyberLeaf/commit/e6b0cdb6760041800ec2469c495288e9e18d6227))

## 1.0.0 (2025-01-05)


### Features

* 把记忆拆分为多个页面 ([cc2ccdf](https://github.com/LeafYeeXYZ/CyberLeaf/commit/cc2ccdf2fce75ac3b5dba119109f925e349cef4a))
* 把聊天拆分为多个页面 ([e8c8d4b](https://github.com/LeafYeeXYZ/CyberLeaf/commit/e8c8d4ba42ada8582d05613bb940e68d5124efc8))
* 把设置拆分为多个页面 ([c2a504c](https://github.com/LeafYeeXYZ/CyberLeaf/commit/c2a504ca7117f700dd51821cb0a4852a059cca67))
* 持久化存储记忆负荷并优化页面显示 ([44bf2aa](https://github.com/LeafYeeXYZ/CyberLeaf/commit/44bf2aaedcc90dc742e12607cf4137be95e8e852))
* 当前上下文携带时间信息 ([1c54ac2](https://github.com/LeafYeeXYZ/CyberLeaf/commit/1c54ac2b9e2cc5e93fd0f8b05d3a7934cb052c30))
* 更改 Fish Speech 测试方法 ([36ee0f5](https://github.com/LeafYeeXYZ/CyberLeaf/commit/36ee0f56c505541d15a0bf24b4c010569bb7d8e7))
* 更改 Fish Speech 测试方法 ([38d4ac5](https://github.com/LeafYeeXYZ/CyberLeaf/commit/38d4ac5e9fdc65363406c4ee9a99707e36a2ee95))
* 更新记忆结构类型定义 ([5a316dd](https://github.com/LeafYeeXYZ/CyberLeaf/commit/5a316ddfb036ad9558a836ffb512067d5d0d74a0))
* 更新记忆时添加记忆存档 ([76619b5](https://github.com/LeafYeeXYZ/CyberLeaf/commit/76619b55f3b7d533007e4aaee0d57b209c6b921a))
* 更新长时记忆定义 ([4ddda2a](https://github.com/LeafYeeXYZ/CyberLeaf/commit/4ddda2a89ec2107c2ff93ada8e3381e0e5084b6b))
* 基本框架完成 ([ffd1b12](https://github.com/LeafYeeXYZ/CyberLeaf/commit/ffd1b1255792f1a05294470ba42c5e58b979b671))
* 基础架构设计 ([1036106](https://github.com/LeafYeeXYZ/CyberLeaf/commit/10361064c3d61047a187666293dd27b90dce3669))
* 计算和保存上次使用的 Token 量为“记忆负荷" ([eb3e94f](https://github.com/LeafYeeXYZ/CyberLeaf/commit/eb3e94f1e78883d69294f23fe453b958042c00af))
* 记忆功能初步完成! ([dc7a19a](https://github.com/LeafYeeXYZ/CyberLeaf/commit/dc7a19a21de1c18c40769d0e9494e2616d269145))
* 加快系统状态检查 ([25b5f3e](https://github.com/LeafYeeXYZ/CyberLeaf/commit/25b5f3e82314af4922b763cb2340eca32503eaef))
* 界面框架完成 ([9509a18](https://github.com/LeafYeeXYZ/CyberLeaf/commit/9509a18bc612cfaed3421449eab0d918969851ff))
* 可通过应用内设置 TTS 服务地址 ([2a2f7b3](https://github.com/LeafYeeXYZ/CyberLeaf/commit/2a2f7b3600a5d97c9a5ce7ce32f5754f99b52684))
* 聊天实现替换为短时记忆 ([e846a5b](https://github.com/LeafYeeXYZ/CyberLeaf/commit/e846a5b52fa000d4217c7203700859b4dc48fb7a))
* 名字和真实时间系统 ([88ccea5](https://github.com/LeafYeeXYZ/CyberLeaf/commit/88ccea53b09e352fab2aff895bcec128cbed24ee))
* 设置推理服务地址时自动末尾补"/" ([d48eb97](https://github.com/LeafYeeXYZ/CyberLeaf/commit/d48eb976f2bbbdc642f2988bc0f1373984ba0100))
* 实现连续语音对话功能 ([61efc8c](https://github.com/LeafYeeXYZ/CyberLeaf/commit/61efc8c93ff07e143fa68cb7600268fab19b7a6d))
* 实验性地支持 F5 TTS API ([6fb4112](https://github.com/LeafYeeXYZ/CyberLeaf/commit/6fb41123f71357b1729381bf567906578354b1cf))
* 添加单进程锁 ([6bd5164](https://github.com/LeafYeeXYZ/CyberLeaf/commit/6bd51640ab3212701b8cf11f226ae6fae5f286aa))
* 添加一个模型 ([5e73678](https://github.com/LeafYeeXYZ/CyberLeaf/commit/5e73678fc6f1e3c7e77387194af7d539dc56d31f))
* 添加一个模型 ([49be8a9](https://github.com/LeafYeeXYZ/CyberLeaf/commit/49be8a9570e308121babeb33a723b123dc14c03c))
* 添加一些模型 ([6429610](https://github.com/LeafYeeXYZ/CyberLeaf/commit/6429610907ca811bfc28e571422d54c553588c1b))
* 完善记忆负荷计算功能 ([fcc1448](https://github.com/LeafYeeXYZ/CyberLeaf/commit/fcc1448e6e7913a2e2e49158998f436804fcc9c0))
* 完善架构, 新增记忆导出和清空 ([d510a1c](https://github.com/LeafYeeXYZ/CyberLeaf/commit/d510a1cfaaf834c6228008f873e4bf96f85e26ae))
* 网页端版本使用在线 API ([fe2c19f](https://github.com/LeafYeeXYZ/CyberLeaf/commit/fe2c19fbc8b1332cb323757f0c6504c8737ca5e7))
* 为未来的实时对话提供回调函数支持 ([462bf0e](https://github.com/LeafYeeXYZ/CyberLeaf/commit/462bf0e45761d3a2f0ea669df3cb9e83f62d622d))
* 细化对话过程的提示 ([c5d0836](https://github.com/LeafYeeXYZ/CyberLeaf/commit/c5d0836b43e376a9756bc9c01f6e6b4f191a173d))
* 限制窗口最小尺寸 ([e3c89b4](https://github.com/LeafYeeXYZ/CyberLeaf/commit/e3c89b448069cc83e478136968870836efda08cc))
* 新增一个模型 ([4badd32](https://github.com/LeafYeeXYZ/CyberLeaf/commit/4badd3202d616edc29b10718f8da561699d54618))
* 优化对话中的时间信息 ([8236acb](https://github.com/LeafYeeXYZ/CyberLeaf/commit/8236acba02bb5e6551283a9bd69406b6bbc518e8))
* 优化环境变量使用方式 ([4d1367d](https://github.com/LeafYeeXYZ/CyberLeaf/commit/4d1367d118906ee3ca7cd62a35defc39e9ba8600))
* 优化记忆界面的描述 ([3fc80ba](https://github.com/LeafYeeXYZ/CyberLeaf/commit/3fc80baf491d0012fa845654cde26673f90112d6))
* 优化加载动画 ([69f6236](https://github.com/LeafYeeXYZ/CyberLeaf/commit/69f6236d395798373c197ba58378945071993142))
* 优化逻辑 ([b8ef875](https://github.com/LeafYeeXYZ/CyberLeaf/commit/b8ef87590d15da6d902fc263ca9cbc296a50d55d))
* 优化设置最大 Tokens 的类型限制 ([042fde3](https://github.com/LeafYeeXYZ/CyberLeaf/commit/042fde313ec9281521e6c458ac2ad4f9b33f549d))
* 优化提示 ([1b3920c](https://github.com/LeafYeeXYZ/CyberLeaf/commit/1b3920c59597c79159ae7966c9d9f7330e801c90))
* 优化验证服务状态的方式 ([792946d](https://github.com/LeafYeeXYZ/CyberLeaf/commit/792946da1ca4cb1545f13d85bf092c17b2c12301))
* 语音输出功能正式可用 ([a0b49e0](https://github.com/LeafYeeXYZ/CyberLeaf/commit/a0b49e0ad505468391549f9ff943b4148574bcd8))
* 允许不使用 Structured Output ([f3178a7](https://github.com/LeafYeeXYZ/CyberLeaf/commit/f3178a72457f1b3dc4cacbdb421d22376d3f2494))
* 允许清除当前对话 ([fb1eaf7](https://github.com/LeafYeeXYZ/CyberLeaf/commit/fb1eaf7773f521c1235ea9fb31c2efb29fc46c21))
* 允许通过环境变量进行自定义设置 ([4b1c9c3](https://github.com/LeafYeeXYZ/CyberLeaf/commit/4b1c9c34c13bb90f68c693d709b20c6a3764c94f))
* 允许在应用内设置推理服务 ([71418af](https://github.com/LeafYeeXYZ/CyberLeaf/commit/71418af24caab49668a755e73bcfc3ca7f3cb781))
* 允许自定义聊天服务标签 ([3c17566](https://github.com/LeafYeeXYZ/CyberLeaf/commit/3c1756697b56a6a3a77f5723b4248d0c0937b83e))
* 支持 Hugging Face Space 上的 F5 TTS API ([0d961a7](https://github.com/LeafYeeXYZ/CyberLeaf/commit/0d961a7470aa5651dd846af24424aec1b4fe2d7b))
* 支持导入记忆功能 ([d599d5f](https://github.com/LeafYeeXYZ/CyberLeaf/commit/d599d5f52ce0ed02fa4af20572ad671946aef7a5))
* 支持获取实时天气信息 ([4d20350](https://github.com/LeafYeeXYZ/CyberLeaf/commit/4d20350feafce808ee7fce157e446b61f3e0b3dc))
* 支持设置背景 ([81ed067](https://github.com/LeafYeeXYZ/CyberLeaf/commit/81ed06718cd9822f012225bade3badbbbe72feb0))
* 支持使用 Fish Speech 进行语音对话 ([a059e1b](https://github.com/LeafYeeXYZ/CyberLeaf/commit/a059e1b2defc7a3a8d0cd4f1d6f2ce3c2d2f05a6))
* 支持网页端使用 ([ce15aa2](https://github.com/LeafYeeXYZ/CyberLeaf/commit/ce15aa2c7e5bd93420a81eb8ba1d9ff0a91d3ac0))
* 支持语音输入识别 ([d13055e](https://github.com/LeafYeeXYZ/CyberLeaf/commit/d13055e706a968897ba4874e0d841e30efe54f04))
* 总结记忆时包含时间信息 ([2849658](https://github.com/LeafYeeXYZ/CyberLeaf/commit/2849658481adc31aa8559a56016e90b764e6451a))
* **web:** 支持使用 Tranformers.js 推理 ([5182354](https://github.com/LeafYeeXYZ/CyberLeaf/commit/51823544c948fda110e629b9e75bb1db7df8460c))


### Bug Fixes

* 更新记忆时重置记忆负荷 ([3c4328c](https://github.com/LeafYeeXYZ/CyberLeaf/commit/3c4328cd3d5455c4b2eec70e449e33cae21b41e5))
* 消息通知加载 ([c53a55e](https://github.com/LeafYeeXYZ/CyberLeaf/commit/c53a55ec1456043d06c814a0837eae94ed83b75e))
* 修复 VITE 构建错误问题 ([c42658b](https://github.com/LeafYeeXYZ/CyberLeaf/commit/c42658b009c2afd84e4f89538bda054a09b0926e))
* 修复 Web 构建错误 ([ea09c37](https://github.com/LeafYeeXYZ/CyberLeaf/commit/ea09c3750b0892ae4577c9082de5792dc26b538e))
* 修复记忆压力显示的潜在问题 ([9c12327](https://github.com/LeafYeeXYZ/CyberLeaf/commit/9c12327d94e138750f1d8b19645cc0cfc31c9e17))
* 修复间接计算 Token 错误 ([1a4814d](https://github.com/LeafYeeXYZ/CyberLeaf/commit/1a4814d7d2722dca79999fcfc0131b8aa706acb8))
* 修复间接计算 Token 错误 ([6fdfe5f](https://github.com/LeafYeeXYZ/CyberLeaf/commit/6fdfe5fa23677b729ce6c68b46fd83402a8efb55))
* 修复连续语音对话中的问题 ([3f1bd88](https://github.com/LeafYeeXYZ/CyberLeaf/commit/3f1bd883fd28e375a768e1d512b7bd4e879b4273))
* 修复模型隐藏的问题 ([b7d33f1](https://github.com/LeafYeeXYZ/CyberLeaf/commit/b7d33f1105bd8f9c123d8fc5046b0847c3f5eb63))
* 修复切换 Speak API 不生效问题 ([38f3dda](https://github.com/LeafYeeXYZ/CyberLeaf/commit/38f3ddaba7a5e525bcb0b0d0815107feee630f13))
* 修复样式错误 ([17f51a1](https://github.com/LeafYeeXYZ/CyberLeaf/commit/17f51a1ddabdf81bf18abe2f061e2b0ea28a1d5b))
* 修复一个导致 Web 构建失败的 Bug ([8e4a7e2](https://github.com/LeafYeeXYZ/CyberLeaf/commit/8e4a7e282cf2593e85821baa51384b3fc4342c2c))
* 优化符号检测的正则表达式 ([021a946](https://github.com/LeafYeeXYZ/CyberLeaf/commit/021a9468f2e348c1d61cdf33a7b24bd157c2af1d))
* 中文波浪线断句问题 ([cba37e4](https://github.com/LeafYeeXYZ/CyberLeaf/commit/cba37e454d7a73d72652b36ea853be52ca52d5cd))
* **web:** 修复服务地址笔误 ([58b0799](https://github.com/LeafYeeXYZ/CyberLeaf/commit/58b0799b9c35c39c2f6487ffb63d50d2f9f807af))
* **web:** 移除 Web 端的 Token 计数功能 (API 不支持) ([b8d5107](https://github.com/LeafYeeXYZ/CyberLeaf/commit/b8d5107b3864d32aa288e881b6a1b09cfd54089e))


### Refactoring

* 把保存功能外部化 ([61d08d1](https://github.com/LeafYeeXYZ/CyberLeaf/commit/61d08d1dbdbdb6f028fa523cbebca14350916ff0))
* 不再使用流式传输和分块语音 ([7ec0333](https://github.com/LeafYeeXYZ/CyberLeaf/commit/7ec033359b47042daf91695d46f36904509353bb))
* 拆分不同的 API ([7c99550](https://github.com/LeafYeeXYZ/CyberLeaf/commit/7c995509907619d7c722d8880b5a7b5471d3e5c4))
* 基于未来的记忆模型设计, 统一使用 ollama 进行推理 ([1a4f7f3](https://github.com/LeafYeeXYZ/CyberLeaf/commit/1a4f7f33c901368756d03c2ba4d31286fc155ac7))
* 可以在应用内设置最大 Tokens ([253b889](https://github.com/LeafYeeXYZ/CyberLeaf/commit/253b889d44c393161f058cfbadb5b271e800a8a3))
* 实现 Live2d 和语音回复 ([a63d34e](https://github.com/LeafYeeXYZ/CyberLeaf/commit/a63d34e21c29794ce1ecf54e86196dcbd75aee8e))
* 使用 OpenAI SDK 进行推理 ([eb20383](https://github.com/LeafYeeXYZ/CyberLeaf/commit/eb20383fe9f284a1663d0075ec7c9e6f46fec19a))
* 统一两端的 Live2d API ([1152ac0](https://github.com/LeafYeeXYZ/CyberLeaf/commit/1152ac0046aa16e3e023571e0ef33bf3b22f0810))
* 优化 API 架构 ([48dd21c](https://github.com/LeafYeeXYZ/CyberLeaf/commit/48dd21c99b8bf084c71c22eabeee34514ab0cff6))
* 重构项目结构 ([7de3083](https://github.com/LeafYeeXYZ/CyberLeaf/commit/7de308369522f8f9f9866a67f5fb7fc19ab3037d))
* 重命名项目 ([2103a7f](https://github.com/LeafYeeXYZ/CyberLeaf/commit/2103a7fb005279fe762820b5e5d47334e33aae73))
* rename project to cyber-leaf ([5646af9](https://github.com/LeafYeeXYZ/CyberLeaf/commit/5646af978322aabb0ce878749c7d3a4d56669c4f)), closes [#2](https://github.com/LeafYeeXYZ/CyberLeaf/issues/2)
* use tauri ([f548a45](https://github.com/LeafYeeXYZ/CyberLeaf/commit/f548a458e4f12cbd669e4a477a92f57fa27e82d0))


### Improvements

* 等待开始播放语音后在播放消息 ([32f3ef4](https://github.com/LeafYeeXYZ/CyberLeaf/commit/32f3ef49dc96313c6f11b2da1179da3a936220b0))
* 调整任务开始的顺序 ([d15e760](https://github.com/LeafYeeXYZ/CyberLeaf/commit/d15e7609bec26385c3f6356b6f94b9bd28ca7228))
* 新增结束录音提示 ([4da7efb](https://github.com/LeafYeeXYZ/CyberLeaf/commit/4da7efb05b9f709dfcf35b10e71aa048f8fd9e91))
* 优化 F5 TTS API 的测试方法 ([183d862](https://github.com/LeafYeeXYZ/CyberLeaf/commit/183d8620d03f14f2a9341ae084b836f994f2ee97))
* 优化 Hugging Face API 错误报告 ([6de4338](https://github.com/LeafYeeXYZ/CyberLeaf/commit/6de4338e30a9264a4751c674f138a23cdc49bf9b))
* 优化当前状态提示 ([a4b8cae](https://github.com/LeafYeeXYZ/CyberLeaf/commit/a4b8cae0f3a6bd1c9e4063571f2d9f3338c0d4de))
* 优化对话时的加载显示效果 ([f2648fb](https://github.com/LeafYeeXYZ/CyberLeaf/commit/f2648fb97914b628a313bf3bda086d92186b8b84))
* 优化界面布局 ([e26b5e7](https://github.com/LeafYeeXYZ/CyberLeaf/commit/e26b5e776319a52b3986d6448909e2d3bb56c10f))
* 优化句子拆分 ([b330b0d](https://github.com/LeafYeeXYZ/CyberLeaf/commit/b330b0d5ee5dc68d4a145987cf3c7655370e439c))
* 优化默认 TTS 设置 ([5b51272](https://github.com/LeafYeeXYZ/CyberLeaf/commit/5b51272879574f669c040d84fbf26536fb30fd6c))
* 优化排版 ([5ca30dc](https://github.com/LeafYeeXYZ/CyberLeaf/commit/5ca30dc6ec2bfe6494105b1b4f9366af2c2f5eab))
* 优化设置界面外观 ([f29c8c7](https://github.com/LeafYeeXYZ/CyberLeaf/commit/f29c8c79ea6deabe792f6d0a4572cb9b3607ff97))
* 优化文字显示的停顿 ([8ae3268](https://github.com/LeafYeeXYZ/CyberLeaf/commit/8ae3268f96e6759474de5cf910876430a2094645))
* 优化系统状态检查逻辑 ([c485642](https://github.com/LeafYeeXYZ/CyberLeaf/commit/c48564272729016652a0d8998c3d69303ca49249))
* 优化逐字打印的效果 ([1f68241](https://github.com/LeafYeeXYZ/CyberLeaf/commit/1f6824197113ca4ffbd139027d39c76738f93c8a))
* **web:** 优化代码分块 ([88cfc56](https://github.com/LeafYeeXYZ/CyberLeaf/commit/88cfc56a46a93225457abba70ffe77ad42f4d632))
