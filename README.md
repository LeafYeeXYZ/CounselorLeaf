赛博小叶子 `v1.0.0` 开发中

使用前请运行 `ollama`, 并提前下载 `qwen2.5:7b` 模型

```bash
bun install # 安装依赖

# 桌面版本 (推荐)
bun d # 运行
bun b # 构建
bun b:win # 在 Mac 下构建 Windows 版本

# Web 版本
bun b:web # 构建 Web 版本 (使用 IndexedDB 取代 Tauri 的文件系统)
bun preview:web # 预览 Web 版本
# 注意输出目录为 /dist-web
```

TODO:

- [ ] 软件图标
- [ ] 黑暗模式, 包括 `index.html`
- [ ] 添加语音
- 记忆功能
  - [ ] 对话和记忆内容包含时间信息 🚧
  - [ ] 短时记忆 -> 长时记忆和自我与对方记忆 🚧
  - [ ] 多段长时记忆 -> 一段长时记忆和自我与对方记忆
- [ ] 退出时或上下文达到一定长度时, 自动更新长时记忆
