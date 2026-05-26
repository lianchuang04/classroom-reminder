/**
 * 课表数据 - 胡同阔 2025-2026学年第2学期
 * 学号: 23831133
 *
 * 时间段说明:
 *   1-2节: 08:00-09:40
 *   3-4节: 10:00-11:40
 *   5-6节: 14:00-15:40
 *   7-8节: 16:00-17:40
 *   9-10节: 19:00-20:40
 *
 * weekRange: 课程所在的周次范围 (第1周~第16周)
 * 如果 weekRange 为 null，表示当前周次无条件限制
 */

const TIME_SLOTS = [
  { period: '1-2节', start: '08:00', end: '09:40' },
  { period: '3-4节', start: '10:00', end: '11:40' },
  { period: '5-6节', start: '14:00', end: '15:40' },
  { period: '7-8节', start: '16:00', end: '17:40' },
  { period: '9-10节', start: '19:00', end: '20:40' },
];

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

// 学期开始的周一日期（根据2025-2026学年第2学期，第1周周一）
const SEMESTER_START = new Date('2026-02-23T00:00:00+08:00');

/**
 * 计算当前是第几周
 */
function getCurrentWeek() {
  const now = new Date();
  // 使用中国时区
  const diff = now.getTime() - SEMESTER_START.getTime();
  const week = Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
  return Math.max(1, Math.min(week, 20));
}

/**
 * 判断课程是否在当前周次
 */
function isInWeek(weekRange) {
  if (weekRange === null) return true;
  const current = getCurrentWeek();
  return current >= weekRange[0] && current <= weekRange[1];
}

/**
 * 周次范围描述
 */
function weekRangeStr(weekRange) {
  if (weekRange === null) return '';
  if (weekRange[0] === weekRange[1]) return `(第${weekRange[0]}周)`;
  return `(第${weekRange[0]}-${weekRange[1]}周)`;
}

// 课表数据
// day: 1=周一 ... 7=周日
// weekRange: [start, end] 或 null(不限)
const SCHEDULE = [
  // ===== 周一 =====
  { day: 1, period: '1-2节', name: '工程经济与管理', location: '思源楼-331', teacher: '赵灵芝', weekRange: [9, 16] },
  { day: 1, period: '5-6节', name: '路基路面工程', location: '知行楼-C109-智慧教室', teacher: '郭威', weekRange: [1, 16] },
  { day: 1, period: '7-8节', name: '桥梁工程', location: '思源楼-408', teacher: '任一平', weekRange: [1, 16] },

  // ===== 周二 =====
  { day: 2, period: '1-2节', name: '工程经济与管理', location: '思源楼-331', teacher: '赵灵芝', weekRange: [9, 16] },
  { day: 2, period: '3-4节', name: '道路勘测设计', location: '思源楼-423', teacher: '李刚', weekRange: [1, 8] },
  { day: 2, period: '5-6节', name: '道路勘测设计', location: '思源楼-423', teacher: '李刚', weekRange: [1, 8] },
  { day: 2, period: '9-10节', name: '形势与政策（大三下）', location: '思源楼-109-智慧教室', teacher: '韩培玉', weekRange: [16, 16] },

  // ===== 周三 =====
  { day: 3, period: '1-2节', name: '路基路面工程', location: '思源楼-401', teacher: '郭威', weekRange: [1, 16] },
  { day: 3, period: '7-8节', name: '桥梁工程', location: '思源楼-430', teacher: '任一平', weekRange: [1, 16] },

  // ===== 周四 =====
  { day: 4, period: '3-4节', name: '国家安全教育', location: '思源楼-130', teacher: '樊朋秀', weekRange: [1, 8] },
  { day: 4, period: '3-4节', name: '土木工程建设法规', location: '思源楼-210-智慧教室', teacher: '杨海燕', weekRange: [9, 16] },
  { day: 4, period: '5-6节', name: '地下工程', location: '思源楼-304', teacher: '顾焕琪', weekRange: [1, 16] },
  { day: 4, period: '9-10节', name: '职业发展与就业指导（四）', location: '思源楼-109-智慧教室', teacher: '王勇强', weekRange: [1, 4] },

  // ===== 周五~周日 无课 =====
  // 数据中无课程即为无课
];

/**
 * 获取某一天的课程
 * @param {number} day - 1=周一 ... 7=周日
 * @returns {Array} 课程列表
 */
function getCoursesForDay(day) {
  const courses = SCHEDULE.filter(c => c.day === day && isInWeek(c.weekRange));

  // 按时间段排序
  const periodOrder = ['1-2节', '3-4节', '5-6节', '7-8节', '9-10节'];
  courses.sort((a, b) => periodOrder.indexOf(a.period) - periodOrder.indexOf(b.period));

  return courses;
}

/**
 * 获取今天的课程
 */
function getTodayCourses() {
  const now = new Date();
  // 获取中国时区的星期几
  const utcDay = now.getUTCDay();
  const utcHour = now.getUTCHours();
  // 中国时区 = UTC+8
  const cnDay = utcHour + 8 >= 24 ? (utcDay + 1) % 7 : utcDay;
  // JavaScript: 0=周日, 1=周一, ... 6=周六
  // 我们的schedule: 1=周一 ... 7=周日
  const day = cnDay === 0 ? 7 : cnDay;

  return {
    day,
    dayName: WEEKDAYS[cnDay],
    week: getCurrentWeek(),
    courses: getCoursesForDay(day),
  };
}

/**
 * 生成提醒消息
 */
function generateMessage() {
  const { day, dayName, week, courses } = getTodayCourses();

  let msg = `📚 ${dayName} 课表提醒\n`;
  msg += `━━━━━━━━━━━━━━━━\n`;
  msg += `📅 第 ${week} 周\n\n`;

  if (courses.length === 0) {
    msg += '🎉 今天没有课，好好休息吧！\n';
    return msg;
  }

  const periodMap = {};
  TIME_SLOTS.forEach(slot => {
    periodMap[slot.period] = slot;
  });

  courses.forEach((c, i) => {
    const slot = periodMap[c.period] || {};
    const weekInfo = c.weekRange ? weekRangeStr(c.weekRange) : '';
    msg += `${i + 1}. ${c.period} (${slot.start || ''}-${slot.end || ''})\n`;
    msg += `   📖 ${c.name} ${weekInfo}\n`;
    msg += `   🏫 ${c.location}\n`;
    msg += `   👨‍🏫 ${c.teacher}\n\n`;
  });

  // 计算下一节课
  const now = new Date();
  const cnHour = now.getUTCHours() + 8;
  const cnMin = now.getUTCMinutes();

  const nextCourse = courses.find(c => {
    const slot = periodMap[c.period];
    if (!slot) return false;
    const [h, m] = slot.start.split(':').map(Number);
    return h > cnHour || (h === cnHour && m > cnMin);
  });

  if (nextCourse) {
    const slot = periodMap[nextCourse.period] || {};
    msg += `⏰ 下一节：${nextCourse.name} ${slot.start || ''} 在 ${nextCourse.location}\n`;
  } else if (courses.length > 0) {
    msg += '✅ 今天的课都上完啦，辛苦啦！\n';
  }

  return msg;
}

module.exports = { getTodayCourses, generateMessage, getCurrentWeek, SEMESTER_START };
