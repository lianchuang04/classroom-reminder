const axios = require('axios');
const { generateMessage, getTodayCourses, getCurrentWeek } = require('./schedule');

// WxPusher 配置
const WX_PUSHER_APP_TOKEN = process.env.WX_PUSHER_APP_TOKEN;
const WX_PUSHER_UID = process.env.WX_PUSHER_UID;

async function sendWeChatMessage(content) {
  if (!WX_PUSHER_APP_TOKEN || !WX_PUSHER_UID) {
    console.error('❌ 未配置 WxPusher 环境变量');
    console.error('请设置 WX_PUSHER_APP_TOKEN 和 WX_PUSHER_UID');
    process.exit(1);
  }

  // 添加课表概览底部
  const today = getTodayCourses();
  const week = getCurrentWeek();

  const footer = `
━━━━━━━━━━━━━━━━
📌 第 ${week} 周 | ${today.dayName}
💬 回复或联系教务系统调课`;

  const fullContent = content + footer;

  try {
    const res = await axios.post('https://wxpusher.zjiecode.com/api/send/message', {
      appToken: WX_PUSHER_APP_TOKEN,
      content: fullContent,
      contentType: 1, // 1=文字, 2=html, 3=markdown
      uids: [WX_PUSHER_UID],
    });

    if (res.data.code === 1000) {
      console.log('✅ 微信推送成功');
      console.log(`📨 消息内容:\n${fullContent}`);
    } else {
      console.error('❌ 推送失败:', res.data.msg || res.data);
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ 请求异常:', err.message);
    process.exit(1);
  }
}

async function main() {
  console.log('⏰ 每日课表提醒服务启动...');
  const { dayName, week } = getTodayCourses();
  console.log(`📅 第 ${week} 周 ${dayName}`);

  const message = generateMessage();
  console.log(`📋 生成消息:\n${message}`);

  await sendWeChatMessage(message);
}

main().catch(err => {
  console.error('❌ 运行出错:', err);
  process.exit(1);
});
