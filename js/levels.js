/**
 * 关卡配置 - 50关
 * 难度梯度：新手1-10、入门11-20、进阶21-30、高手31-40、大神41-50
 */

const LEVELS = [
    // 新手关 1-10
    { level: 1,  speed: 1000, skillRate: 0.8, obstacleRate: 0,   skillTrigger: 3, eventRate: 0.1, bg: 'novice' },
    { level: 2,  speed: 950,  skillRate: 0.8, obstacleRate: 0,   skillTrigger: 3, eventRate: 0.1, bg: 'novice' },
    { level: 3,  speed: 900,  skillRate: 0.8, obstacleRate: 0,   skillTrigger: 3, eventRate: 0.1, bg: 'novice' },
    { level: 4,  speed: 850,  skillRate: 0.8, obstacleRate: 0,   skillTrigger: 3, eventRate: 0.1, bg: 'novice' },
    { level: 5,  speed: 800,  skillRate: 0.8, obstacleRate: 0,   skillTrigger: 3, eventRate: 0.1, bg: 'novice' },
    { level: 6,  speed: 780,  skillRate: 0.8, obstacleRate: 0,   skillTrigger: 3, eventRate: 0.1, bg: 'novice' },
    { level: 7,  speed: 760,  skillRate: 0.8, obstacleRate: 0,   skillTrigger: 3, eventRate: 0.1, bg: 'novice' },
    { level: 8,  speed: 740,  skillRate: 0.8, obstacleRate: 0,   skillTrigger: 3, eventRate: 0.1, bg: 'novice' },
    { level: 9,  speed: 720,  skillRate: 0.8, obstacleRate: 0,   skillTrigger: 3, eventRate: 0.1, bg: 'novice' },
    { level: 10, speed: 700,  skillRate: 0.8, obstacleRate: 0.05, skillTrigger: 3, eventRate: 0.1, bg: 'novice' },
    
    // 入门关 11-20
    { level: 11, speed: 680,  skillRate: 0.6, obstacleRate: 0.05, skillTrigger: 3, eventRate: 0.15, bg: 'beginner' },
    { level: 12, speed: 660,  skillRate: 0.6, obstacleRate: 0.08, skillTrigger: 3, eventRate: 0.15, bg: 'beginner' },
    { level: 13, speed: 640,  skillRate: 0.6, obstacleRate: 0.08, skillTrigger: 3, eventRate: 0.15, bg: 'beginner' },
    { level: 14, speed: 620,  skillRate: 0.6, obstacleRate: 0.1,  skillTrigger: 3, eventRate: 0.15, bg: 'beginner' },
    { level: 15, speed: 600,  skillRate: 0.6, obstacleRate: 0.1,  skillTrigger: 3, eventRate: 0.15, bg: 'beginner' },
    { level: 16, speed: 580,  skillRate: 0.6, obstacleRate: 0.12, skillTrigger: 3, eventRate: 0.15, bg: 'beginner' },
    { level: 17, speed: 560,  skillRate: 0.6, obstacleRate: 0.12, skillTrigger: 3, eventRate: 0.15, bg: 'beginner' },
    { level: 18, speed: 540,  skillRate: 0.6, obstacleRate: 0.15, skillTrigger: 3, eventRate: 0.15, bg: 'beginner' },
    { level: 19, speed: 520,  skillRate: 0.6, obstacleRate: 0.15, skillTrigger: 3, eventRate: 0.15, bg: 'beginner' },
    { level: 20, speed: 500,  skillRate: 0.6, obstacleRate: 0.18, skillTrigger: 3, eventRate: 0.15, bg: 'beginner' },
    
    // 进阶关 21-30
    { level: 21, speed: 480,  skillRate: 0.5, obstacleRate: 0.2, skillTrigger: 4, eventRate: 0.2, bg: 'intermediate' },
    { level: 22, speed: 460,  skillRate: 0.5, obstacleRate: 0.2, skillTrigger: 4, eventRate: 0.2, bg: 'intermediate' },
    { level: 23, speed: 440,  skillRate: 0.5, obstacleRate: 0.22, skillTrigger: 4, eventRate: 0.2, bg: 'intermediate' },
    { level: 24, speed: 420,  skillRate: 0.5, obstacleRate: 0.22, skillTrigger: 4, eventRate: 0.2, bg: 'intermediate' },
    { level: 25, speed: 400,  skillRate: 0.5, obstacleRate: 0.25, skillTrigger: 4, eventRate: 0.2, bg: 'intermediate' },
    { level: 26, speed: 380,  skillRate: 0.5, obstacleRate: 0.25, skillTrigger: 4, eventRate: 0.2, bg: 'intermediate' },
    { level: 27, speed: 360,  skillRate: 0.5, obstacleRate: 0.28, skillTrigger: 4, eventRate: 0.2, bg: 'intermediate' },
    { level: 28, speed: 340,  skillRate: 0.5, obstacleRate: 0.28, skillTrigger: 4, eventRate: 0.2, bg: 'intermediate' },
    { level: 29, speed: 320,  skillRate: 0.5, obstacleRate: 0.3, skillTrigger: 4, eventRate: 0.2, bg: 'intermediate' },
    { level: 30, speed: 300,  skillRate: 0.5, obstacleRate: 0.3, skillTrigger: 4, eventRate: 0.2, bg: 'intermediate' },
    
    // 高手关 31-40
    { level: 31, speed: 280,  skillRate: 0.4, obstacleRate: 0.3, skillTrigger: 4, eventRate: 0.25, bg: 'expert' },
    { level: 32, speed: 270,  skillRate: 0.4, obstacleRate: 0.32, skillTrigger: 4, eventRate: 0.25, bg: 'expert' },
    { level: 33, speed: 260,  skillRate: 0.4, obstacleRate: 0.32, skillTrigger: 4, eventRate: 0.25, bg: 'expert' },
    { level: 34, speed: 250,  skillRate: 0.4, obstacleRate: 0.35, skillTrigger: 4, eventRate: 0.25, bg: 'expert' },
    { level: 35, speed: 240,  skillRate: 0.4, obstacleRate: 0.35, skillTrigger: 4, eventRate: 0.25, bg: 'expert' },
    { level: 36, speed: 230,  skillRate: 0.4, obstacleRate: 0.38, skillTrigger: 4, eventRate: 0.25, bg: 'expert' },
    { level: 37, speed: 220,  skillRate: 0.4, obstacleRate: 0.38, skillTrigger: 4, eventRate: 0.25, bg: 'expert' },
    { level: 38, speed: 210,  skillRate: 0.4, obstacleRate: 0.4, skillTrigger: 4, eventRate: 0.25, bg: 'expert' },
    { level: 39, speed: 200,  skillRate: 0.4, obstacleRate: 0.4, skillTrigger: 4, eventRate: 0.25, bg: 'expert' },
    { level: 40, speed: 190,  skillRate: 0.4, obstacleRate: 0.42, skillTrigger: 4, eventRate: 0.25, bg: 'expert' },
    
    // 大神关 41-50
    { level: 41, speed: 180,  skillRate: 0.3, obstacleRate: 0.35, skillTrigger: 4, eventRate: 0.3, bg: 'master' },
    { level: 42, speed: 170,  skillRate: 0.3, obstacleRate: 0.35, skillTrigger: 4, eventRate: 0.3, bg: 'master' },
    { level: 43, speed: 160,  skillRate: 0.3, obstacleRate: 0.36, skillTrigger: 4, eventRate: 0.3, bg: 'master' },
    { level: 44, speed: 150,  skillRate: 0.3, obstacleRate: 0.36, skillTrigger: 4, eventRate: 0.3, bg: 'master' },
    { level: 45, speed: 140,  skillRate: 0.3, obstacleRate: 0.38, skillTrigger: 4, eventRate: 0.3, bg: 'master' },
    { level: 46, speed: 130,  skillRate: 0.3, obstacleRate: 0.38, skillTrigger: 4, eventRate: 0.3, bg: 'master' },
    { level: 47, speed: 120,  skillRate: 0.3, obstacleRate: 0.39, skillTrigger: 4, eventRate: 0.3, bg: 'master' },
    { level: 48, speed: 110,  skillRate: 0.3, obstacleRate: 0.39, skillTrigger: 4, eventRate: 0.3, bg: 'master' },
    { level: 49, speed: 100,  skillRate: 0.3, obstacleRate: 0.4, skillTrigger: 4, eventRate: 0.3, bg: 'master' },
    { level: 50, speed: 80,   skillRate: 0.3, obstacleRate: 0.4, skillTrigger: 4, eventRate: 0.3, bg: 'master' }
];

// 段位配置
const RANKS = {
    bronze: { name: '青铜', threshold: 0,    next: 100,  color: '#cd7f32' },
    silver: { name: '白银', threshold: 100,  next: 500,  color: '#c0c0c0' },
    gold:   { name: '黄金', threshold: 500,  next: 1000, color: '#ffd700' },
    diamond:{ name: '钻石', threshold: 1000, next: 2000, color: '#00ffff' }
};

// 获取当前段位
function getCurrentRank(totalLines) {
    if (totalLines >= 2000) return 'diamond';
    if (totalLines >= 1000) return 'gold';
    if (totalLines >= 500)  return 'silver';
    return 'bronze';
}

// 获取段位进度
function getRankProgress(totalLines) {
    const rank = getCurrentRank(totalLines);
    const rankData = RANKS[rank];
    const current = totalLines;
    const target = rankData.next;
    const percent = Math.min(100, ((current - rankData.threshold) / (target - rankData.threshold)) * 100);
    return { rank, percent, current, target: target - rankData.threshold, currentDisplay: current - rankData.threshold };
}