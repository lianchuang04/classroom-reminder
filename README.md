# 📚 每日课表提醒

自动在每天 7:00 (北京时间) 推送当天课表到微信。

## 部署步骤

### 1. 注册 WxPusher

1. 打开 https://wxpusher.zjiecode.com
2. 微信扫码登录
3. 创建一个应用，获取 **AppToken**
4. 关注该应用，获取你的 **UID**

### 2. 上传到 GitHub

```bash
# 登录 GitHub 创建新仓库 classroom-reminder
git init
git add .
git commit -m "feat: 初始课表提醒系统"
git remote add origin https://github.com/你的用户名/classroom-reminder.git
git push -u origin main
```

### 3. 配置 Secrets

在 GitHub 仓库的 Settings → Secrets and variables → Actions 中：

| Secret | 值 |
|--------|-----|
| `WX_PUSHER_APP_TOKEN` | 你在 WxPusher 获取的 AppToken |
| `WX_PUSHER_UID` | 你的 WxPusher UID |

### 4. 启用 Actions

推送后 Actions 会自动在每天早上 7:00 运行。

也可在 Actions 页面手动触发测试。

## 运行方式

### GitHub Actions（推荐）

每天 7:00 自动运行，无需电脑开机。

### 本地测试

```bash
npm install
WX_PUSHER_APP_TOKEN=xxx WX_PUSHER_UID=xxx node src/index.js
```

## 课表说明

- 周一~周四有课，周五~周日无课
- 部分课程有周次限制（如工程经济与管理仅 9-16 周）
- 系统会自动计算当前教学周
- 学期开始日期：2026年2月23日（周一）
