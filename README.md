# Digital Life / 数字生命

这是一个试图创造具有可解释性的"长时记忆"的 AI 生命项目, 目前正在开发中

本项目同时支持 Web 和桌面端, 两端共享除特定 API 外的所有代码. 开发环境要求包括 `Rust`、`Node.js`、`Bun` (可通过 `npm install -g bun` 安装)

| 记忆模型 | 示意图 |
| :---: | :---: |
| ![](./readme/model.png) | ![](./readme/intro.png) |

## 桌面端开发和部署

桌面端的语言模型使用 `ollama` 以及 `qwen2.5:7b` 模型, 请提前安装 `ollama`, 运行 `ollama pull qwen2.5:7b` 下载模型, 并启动 `ollama` 服务

```bash
# 克隆项目
git clone https://github.com/LeafYeeXYZ/DigitalLife.git
cd DigitalLife
# 安装依赖
bun install
# 运行
bun d:tauri
# 构建
bun b:tauri
```

## Web 端开发和部署

Web 端构建后的输出目录为 `/dist-web`. 部署时请设置 `VITE_WEB_SERVER_URL` 环境变量为你的服务器地址, 如 `https://api.xxx.workers.dev` (不带末尾斜杠), 见 <https://github.com/LeafYeeXYZ/MyAPIs>

```bash
# 克隆项目
git clone https://github.com/LeafYeeXYZ/DigitalLife.git
cd DigitalLife
# 安装依赖
bun install
# 运行
bun d:web
# 构建
bun b:web
```

## 项目说明

- **愿景**: 如流浪地球2 (<https://digitallife.ac.cn>) 那样, 创造一个可以带走的"数字生命"; 交互效果类似于: [【【Neuro】吊打GPT！点击就看AI女王绝杀ChatGPT】](https://www.bilibili.com/video/BV1Db1WYgESn/?share_source=copy_web&vd_source=f73d7b1cc6b3e028bd1d6a660f91c4f1)
- **关于长时记忆**: 长时记忆并不打算使用 <https://github.com/letta-ai/letta> 项目, 而是自己实现. 因为希望获得的记忆具有可解释性: 短时记忆 (当前对话上下文)、长时记忆 (各段对话总结)、自我记忆 (AI的自我认知)、对方记忆 (AI对用户的认知). 这些数据未来可以在伦理许可的条件下, 用作进一步的心理学研究, 例如基于这个AI助手进行危机干预时, 可以提供给转介的人类心理医生更多的信息、用这个助手来进行人格测验等
- **本项目的优势和特点**: 与同类项目如 <https://github.com/t41372/Open-LLM-VTuber> 的区别在于, 本项目使用更为简单和灵活, 同时支持 Web 和桌面版本, 用户无需安装任何多余的软件; 同时, 本项目的 API 设计也比较灵活, 可以便捷地拓展多种后端实现; 最后如上所述, 可解释性的记忆能提供更多可能
- **关于基础模型**: 目前用的是 `qwen2.5:7b` (本地) 或 `qwen1.5:13b-awq` (Web), 后期可能会使用 <https://github.com/SmartFlowAI/EmoLLM> 或其他模型
- **关于 `live2d`**: 目前使用 <https://github.com/oh-my-live2d/oh-my-live2d>, 也尝试过 <https://github.com/guansss/pixi-live2d-display>. 但是两者都无法完全满足需求, 后期可能会 `fork` 之后按需修改
- **关于语音生成**: 目前用的是 `Web Speech API`, 但效果感觉一般, 默认关闭. 桌面端还实验性地支持 <https://github.com/SWivid/F5-TTS> (使用 <https://github.com/jianchang512/f5-tts-api>), 效果很不错, 但对配置要求较高, 且对 Mac 不友好. 后期可能会尝试其他 `TTS` 技术
- **关于语音输入**: 目前用的也是 `Web Speech API`, 效果不错, 默认关闭. 后期也会探索使用其他 `STT` 技术、添加实时对话功能
- **外部世界信息**: 未来会加入可选的天气、新闻、股票等信息给 AI (通过相关平台的 API 在线获取)、通过 <https://github.com/microsoft/markitdown> 支持文件输入 (把 `Python` 作为 `Tauri` 的 `sidecar` 运行)

## 待办事项

- [ ] 软件图标
- [ ] 黑暗模式, 包括 `index.html`
- [x] 添加语音识别 (Web Speech API)
- 记忆功能
  - [ ] 对话和记忆内容包含时间信息 🚧
  - [ ] 短时记忆 -> 长时记忆和自我与对方记忆 🚧
  - [ ] 多段长时记忆 -> 一段长时记忆和自我与对方记忆
- [ ] 退出时或上下文达到一定长度时, 自动更新长时记忆 🚧

## Live2d 模型版权声明

本项目内的所有模型皆为在 B 站发布的免费模型, 请勿直接复制使用, 如有需要可至原地址获取
