/**
 * 随机事件系统
 * 每消除10行触发一次
 * 增益类60%，干扰类40%
 */

const EVENTS = {
    // 增益类事件 (60%)
    buffs: [
        {
            id: 'bonus_points',
            name: '天降加分',
            description: '获得500分奖励',
            type: 'buff',
            weight: 20,
            execute: (game) => {
                game.score += 500;
                game.showEventToast('🎁 天降加分 +500!', 'buff');
                return { score: 500 };
            }
        },
        {
            id: 'extra_undo',
            name: '悔步补给',
            description: '悔步次数+1',
            type: 'buff',
            weight: 15,
            execute: (game) => {
                game.undoCount = Math.min(5, game.undoCount + 1);
                game.updateUndoDisplay();
                game.showEventToast('🔄 悔步补给 +1!', 'buff');
                return { undo: 1 };
            }
        },
        {
            id: 'skill_boost',
            name: '技能充能',
            description: '技能能量充满',
            type: 'buff',
            weight: 15,
            execute: (game) => {
                game.skillMeter.energy = game.skillMeter.maxEnergy;
                game.updateSkillMeter();
                game.showEventToast('⚡ 技能能量充满!', 'buff');
                return { skillEnergy: true };
            }
        },
        {
            id: 'clear_obstacles',
            name: '障碍清除',
            description: '清除所有障碍方块',
            type: 'buff',
            weight: 10,
            execute: (game) => {
                let count = 0;
                for (let y = 0; y < game.board.length; y++) {
                    for (let x = 0; x < game.board[0].length; x++) {
                        if (game.board[y][x] === -1) {
                            game.board[y][x] = 0;
                            count++;
                        }
                    }
                }
                game.showEventToast(`🧹 障碍清除 x${count}!`, 'buff');
                return { obstaclesCleared: count };
            }
        }
    ],
    
    // 干扰类事件 (40%)
    debuffs: [
        {
            id: 'gravity_reverse',
            name: '重力反转',
            description: '下落速度临时加快3秒',
            type: 'debuff',
            weight: 20,
            execute: (game) => {
                const originalSpeed = game.currentSpeed;
                game.currentSpeed = Math.max(50, game.currentSpeed * 0.5);
                game.showEventToast('⚠️ 重力反转! 速度加快!', 'debuff');
                setTimeout(() => {
                    game.currentSpeed = originalSpeed;
                    game.showEventToast('✅ 重力恢复正常', 'buff');
                }, 3000);
                return { speedMultiplier: 0.5, duration: 3000 };
            }
        },
        {
            id: 'add_obstacles',
            name: '障碍生成',
            description: '底部生成一行障碍',
            type: 'debuff',
            weight: 15,
            execute: (game) => {
                // 检查是否还能添加障碍
                if (game.board[0].some(cell => cell !== 0)) {
                    game.showEventToast('⚠️ 障碍生成失败 - 空间不足!', 'debuff');
                    return { failed: true };
                }
                
                // 将所有行上移
                for (let y = 0; y < game.board.length - 1; y++) {
                    game.board[y] = [...game.board[y + 1]];
                }
                
                // 底部生成障碍行（随机分布）
                const obstacleRow = new Array(game.board[0].length).fill(0);
                const obstacleCount = Math.floor(game.board[0].length * 0.5);
                for (let i = 0; i < obstacleCount; i++) {
                    const x = Math.floor(Math.random() * obstacleRow.length);
                    obstacleRow[x] = -1; // -1表示障碍
                }
                game.board[game.board.length - 1] = obstacleRow;
                
                game.showEventToast('⚠️ 底部生成障碍!', 'debuff');
                return { obstaclesAdded: obstacleCount };
            }
        },
        {
            id: 'blur_screen',
            name: '视觉模糊',
            description: '屏幕模糊5秒',
            type: 'debuff',
            weight: 5,
            execute: (game) => {
                game.canvas.style.filter = 'blur(3px)';
                game.showEventToast('👁️ 视觉模糊 5秒!', 'debuff');
                setTimeout(() => {
                    game.canvas.style.filter = 'none';
                    game.showEventToast('✅ 视觉恢复', 'buff');
                }, 5000);
                return { blur: true, duration: 5000 };
            }
        }
    ]
};

// 事件触发器
class EventTrigger {
    constructor() {
        this.linesThreshold = 10;
        this.linesSinceLastEvent = 0;
        this.buffWeight = 60;
        this.debuffWeight = 40;
    }
    
    // 记录消除行数
    addLines(lines) {
        this.linesSinceLastEvent += lines;
        if (this.linesSinceLastEvent >= this.linesThreshold) {
            this.linesSinceLastEvent = 0;
            return true; // 应该触发事件
        }
        return false;
    }
    
    // 随机选择一个事件
    selectEvent(game) {
        const levelConfig = game.getCurrentLevelConfig();
        
        // 根据关卡调整概率
        let buffChance = this.buffWeight;
        let debuffChance = this.debuffWeight;
        
        if (levelConfig.bg === 'expert' || levelConfig.bg === 'master') {
            // 高手/大神关干扰事件概率更高
            buffChance = 40;
            debuffChance = 60;
        }
        
        const isBuff = Math.random() * 100 < buffChance;
        const eventPool = isBuff ? EVENTS.buffs : EVENTS.debuffs;
        
        // 按权重随机选择
        const totalWeight = eventPool.reduce((sum, e) => sum + e.weight, 0);
        let random = Math.random() * totalWeight;
        
        for (const event of eventPool) {
            random -= event.weight;
            if (random <= 0) {
                return event;
            }
        }
        
        return eventPool[0];
    }
    
    reset() {
        this.linesSinceLastEvent = 0;
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EventTrigger, EVENTS };
}