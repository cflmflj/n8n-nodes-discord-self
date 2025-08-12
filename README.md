![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

## n8n-nodes-discord-self

将 Discord 自用号（selfbot）集成到 n8n 的社区节点包，基于 `discord.js-selfbot-v13`。

重要：使用自用号违反 Discord 的服务条款，可能导致账号被封禁。请自行承担风险。参考上游库的说明与警示：[仓库](https://github.com/aiko-chan-ai/discord.js-selfbot-v13)、[文档](https://discordjs-self-v13.netlify.app/#/)

### 目录
- 安装
- 凭据（Credentials）
- 节点与功能
- 兼容性
- 使用示例（本地加载与 UI 操作）
- 开发与调试
- 发布说明
- 免责声明与致谢

### 安装
- 在 n8n UI 中通过「Community Nodes」安装：搜索并安装 `n8n-nodes-discord-self`。
- 或在自托管实例中安装：
```bash
npm i n8n-nodes-discord-self
```
然后用环境变量加载：
```bash
export N8N_CUSTOM_EXTENSIONS="/path/to/node_modules/n8n-nodes-discord-self"
n8n start
```
Windows PowerShell：
```powershell
$env:N8N_CUSTOM_EXTENSIONS="C:\\path\\to\\node_modules\\n8n-nodes-discord-self"
npx n8n start
```

### 凭据（Credentials）
在 n8n 中创建凭据 `Discord Self API`，字段：
- Token（必填）：Discord 用户令牌（风险自担）。
- Status（可选）：online/idle/dnd/invisible。
- Custom Status Text（可选）：自定义状态文本。
- Auto Reconnect（可选，默认开）：断线自动重连。
- TOTP Secret（可选）：如账号启用 2FA，可用于自动登录（取决于上游库支持）。

### 节点与功能
1) Trigger：`Discord Self Trigger`
   - 事件：Message Created（`messageCreate`）
   - 过滤参数：
     - Channel IDs：逗号分隔的频道 ID 允许列表（留空表示全部）
     - Only DMs：是否仅监听私信
     - Only Mentions Me：是否仅在被 @ 时触发
     - Ignore Self Messages：是否忽略自己发送的消息（默认开启）
   - 输出字段：`id, content, authorId, authorUsername, channelId, guildId, createdTimestamp`

2) Action：`Discord Self`
   - Operation：Send Message（最小可用）
   - 参数：Channel ID、Content

如需扩展更多事件（messageUpdate/delete、interactionCreate 等）与操作（回复、编辑、删除、反应、Presence 设置等），可在此包中继续完善。

### 兼容性
- Node.js：>= 20.18（上游库要求）
- n8n：社区节点机制，建议使用最新版 n8n
- 依赖：`discord.js-selfbot-v13@3.7.0`

### 使用示例
1) 本地加载（开发调试）
```powershell
cd C:\\Users\\<you>\\n8n-nodes-discord-self
npm run build
$env:N8N_CUSTOM_EXTENSIONS="C:\\Users\\<you>\\n8n-nodes-discord-self"
npx n8n start
```
2) 在 n8n UI 中：
   - 创建凭据 `Discord Self API` 并填入 Token
   - 放置 `Discord Self Trigger`，按需设置过滤后激活
   - 放置 `Discord Self`（Action），选择 Send Message，填 Channel ID 与 Content 并执行

### 开发与调试
- 安装依赖并构建：`npm i`、`npm run build`
- 实时编译：`npm run dev`
- 代码改动后需重启 n8n 才能生效
- 重要代码位置：
  - 凭据：`credentials/DiscordSelfApi.credentials.ts`
  - 客户端管理：`nodes/DiscordSelf/ClientManager.ts`
  - 触发器：`nodes/DiscordSelf/DiscordSelfTrigger.node.ts`
  - 动作：`nodes/DiscordSelf/DiscordSelf.node.ts`

### 发布说明
- 已发布 npm：`n8n-nodes-discord-self`
- 发布命令（维护者）：
```bash
npm run lint && npm publish --access public
```

### 免责声明与致谢
- 风险声明：自用号违反 Discord TOS，使用本项目可能导致账号封禁，后果自负。
- 上游库与文档：
  - `discord.js-selfbot-v13` 仓库（警示、功能、安装方式）：[GitHub](https://github.com/aiko-chan-ai/discord.js-selfbot-v13)
  - `Client` 类与事件（如 `messageCreate`）文档：[文档站](https://discordjs-self-v13.netlify.app/#/docs/docs/main/class/Client)

### License
MIT
