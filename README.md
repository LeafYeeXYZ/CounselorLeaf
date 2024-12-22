# Digital Life / 数字生命

数字生命 `v1.0.0` 开发中, 使用前请运行 `ollama`, 并提前下载 `qwen2.5:7b` 模型; 运行环境要求包括 `Rust`、`Node.js`、`Bun` (可通过 `npm install -g bun` 安装)

- **关于长时记忆**: 长时记忆并不打算使用 `MemGPT` 类的项目, 而是自己实现. 因为希望获得的记忆具有可解释性: 短时记忆 (当前对话上下文)、长时记忆 (各段对话总结)、自我记忆 (AI的自我认知)、对方记忆 (AI对用户的认知). 这些数据未来可以在伦理许可的条件下, 用作进一步的心理学研究, 例如基于这个AI助手进行危机干预时, 可以提供给转介的人类心理医生更多的信息、用这个助手来进行人格测验等.
- **本项目的优势和特点**: 与同类项目如 <https://github.com/t41372/Open-LLM-VTuber> 的区别在于, 本项目使用更为简单和灵活, 同时支持 Web 和桌面版本, 用户无需安装任何多余的软件; 同时, 本项目的 API 设计也比较灵活, 可以便捷地拓展多种后端实现; 最后如上所述, 可解释性的记忆能提供更多可能.
- **关于基础模型**: 目前用的是 `qwen2.5:7b` (本地) 或 `qwen1.5:13b-awq` (Web), 后期可能会使用 <https://github.com/SmartFlowAI/EmoLLM> 或心理学部老师的相关技术/模型
- **关于 `live2d`**: 后期可能会从 <https://github.com/oh-my-live2d/oh-my-live2d> 迁移到 <https://github.com/guansss/pixi-live2d-display>, 以支持更多的动作、表情和更大的自定义空间.
- **关于语音生成**: 目前用的是 `Web Speech API`, 但效果感觉一般, 默认关闭. 后期会探索使用其他 `TTS` 技术
- **关于语音输入**: 暂未实现, 近期也会通过 `Web Speech API` 先实现一个原型; 目前可以使用设备自带的语音转文本功能
- **愿景**: 如流浪地球2 (<https://digitallife.ac.cn>) 那样, 创造一个可以带走的"数字生命"

| 记忆模型 | 示意图 |
| :---: | :---: |
| ![](./readme/model.png) | ![](./readme/intro.png) |

## 使用方法

```bash
bun install # 安装依赖
```

### 桌面版本

```bash
bun d # 运行
bun b # 构建
bun b:win # 在 Mac 下构建 Windows 版本
```

### Web 版本

```bash
bun b:web # 构建 Web 版本
bun preview:web # 预览 Web 版本
# 注意输出目录为 /dist-web, 在线构建时请误填写 /dist
# 请设置 VITE_WEB_SERVER_URL 为你的服务器地址, 如 https://api.xxx.workers.dev, 不带末尾斜杠
# 上述服务器见 https://github.com/LeafYeeXYZ/MyAPIs
```

## TODO

- [ ] 软件图标
- [ ] 黑暗模式, 包括 `index.html`
- [ ] 添加语音识别
- 记忆功能
  - [ ] 对话和记忆内容包含时间信息 🚧
  - [ ] 短时记忆 -> 长时记忆和自我与对方记忆 🚧
  - [ ] 多段长时记忆 -> 一段长时记忆和自我与对方记忆
- [ ] 退出时或上下文达到一定长度时, 自动更新长时记忆
