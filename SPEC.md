# dsh-browser-use 插件 SPEC

一个独立的 DeepSeek Harness 插件（单仓库、单 npm 包），让 agent 能操控浏览器网页。结构 fork 自 `xu1132/dsh-plugin-browser`，元素定位改为 accessibility 快照 + 数字索引 `ref`。

## 已定决策

- **形态**：单插件独立仓库（bundle），非 monorepo。
- **引擎**：原生 Playwright（Node/TS）。运行时依赖 `playwright`；`@deepseek-ai/cordis`、`@deepseek-ai/dsh-tools` 为 peerDependencies（由 host 提供）。
- **元素定位**：accessibility 快照 + 数字索引 `ref`（见 `docs/adr/0001`）。
- **可见性**：默认 headed 可见窗口；`headless` 为 config 开关（服务器场景可置 `true`）。
- **会话**：每 agent 一个独立浏览器实例，`browser_close` 或插件卸载时销毁。
- 术语见 `CONTEXT.md`。

## 工具（9 个，统一 `browser_*` 前缀）

| 工具 | 参数 | 返回 |
|---|---|---|
| `browser_navigate` | `url` | 快照 |
| `browser_snapshot` | — | 快照（标题/URL + 可交互元素编号列表）|
| `browser_click` | `ref`（数字索引） | `ok` / `message` |
| `browser_type` | `ref`, `text` | `ok` / `message` |
| `browser_press_key` | `key`（Enter/Escape/Tab/方向键） | `ok` / `message` |
| `browser_scroll` | `direction`(`up`/`down`), `amount`? | `ok` / `message` |
| `browser_screenshot` | `path`? | 文件绝对路径 |
| `browser_extract` | `mode`(`text`) | 页面正文文本 |
| `browser_close` | — | `ok` / `message` |

## 快照格式（ADR-0001）

`browser_snapshot` 返回：
- `title`、`url`
- 可交互元素列表，每项带数字索引 `[1] [2]…`、role、可见文本、必要属性
- `click` / `type` 用 `ref` 引用索引，**不用** CSS/XPath selector

## 配置（Config，schemastery 校验）

- `headless: boolean`，默认 `false`（可见）
- `executablePath?: string`
- `timeoutMs: number`，默认 `30000`
- `maxTextChars` / `maxElements`：快照与正文截断上限

## 测试策略

- vitest + 真实 Cordis `Context`：`ctx.plugin(SystemPrompt)` + `ctx.plugin(ToolRuntime)` + 本插件，用 `ctx.tools.execute(...)` 驱动
- 本地 fixture HTTP 服务器提供测试页面
- 集成冒烟：`dsh plugin --profile web add ./` 装进本机 harness 实测

## 非目标（后续迭代，不进本次 MVP）

- 自主 agent loop（observe → decide → act）
- DSH 侧边栏实时页面预览（需 `dsh.client`）
- `browser_extract` 的 `structured` 模式（需接入 `ctx.llm`）
