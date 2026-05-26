const axios = require('axios');
const { generateMessage, getTodayCourses, getCurrentWeek } = require('./schedule');

// Server酱 配置
const SEND_KEY = process.env.SERVER_CHAN_KEY;

async function sendWeChatMessage(content) {
  if (!SEND_KEY) {
    console.error('❌ 未配置 Server酱 环境变量');
    console.error('请设置 SERVER_CHAN_KEY');
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
    const res = await axios.post(
      `https://sctapi.ftqq.com/${SEND_KEY}.send`,
      new URLSearchParams({
        title: `${today.dayName}课表提醒 | 第${week}周`,
        desp: fullContent.replace(/\n/g, '\n\n'),
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    if (res.data.code === 0) {
      console.log('✅ 微信推送成功');
      console.log(`📨 消息内容:\n${fullContent}`);
    } else {
      console.error('❌ 推送失败:', res.data.message || JSON.stringify(res.data));
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
