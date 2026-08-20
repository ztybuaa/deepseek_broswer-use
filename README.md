# dsh-browser-use

让 DeepSeek Harness 的 agent 操控浏览器的插件（Playwright）。元素定位用 accessibility 快照 + 数字索引 `ref`（见 [ADR-0001](docs/adr/0001-accessibility-snapshot-element-refs.md)），模型按 `ref` 引用元素、不手写 selector。

## 工具（8 个）

| 工具 | 说明 |
|---|---|
| `browser_navigate` | 打开 URL，返回可交互元素快照 |
| `browser_snapshot` | 返回当前页可交互元素快照（编号 `[1] [2]…`）|
| `browser_click` | 按 `ref` 点击元素 |
| `browser_type` | 按 `ref` 往输入框打字 |
| `browser_scroll` | 上/下滚动 |
| `browser_screenshot` | 截图保存为 PNG |
| `browser_extract` | 抽取页面正文文本 |
| `browser_close` | 关闭当前浏览器会话 |

## 安装

```sh
# 本地开发目录
dsh plugin --profile web add /path/to/dsh-browser-use

# 从 GitHub（需先在 profile 里 allowBuild）
dsh plugin --profile web add github:ztybuaa/deepseek_broswer-use
```

安装后重启 DSH，即可在会话中让 agent 调用 `browser_*` 工具。

## 配置（cordis.patch.yml）

```yaml
- id: browser-use
  name: dsh-browser-use
  config:
    headless: false        # 默认可见窗口；服务器场景设 true
    executablePath: ''     # 可选，指定系统浏览器路径
    timeoutMs: 30000
    screenshotDir: '.'
```

## 开发

```sh
pnpm install
pnpm exec playwright install chromium   # 首次需下载浏览器
pnpm test
pnpm typecheck
```

每 agent 一个独立浏览器会话，`browser_close` 或插件卸载时销毁。
