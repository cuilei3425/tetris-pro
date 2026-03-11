/**
 * 技能方块系统
 * 5种经典方块绑定专属技能
 */

const SKILLS = {
    // I型 - 爆炸消除
    I: {
        name: '爆炸消除',
        description: '消除3×3区域',
        color: '#00ffff',
        activate: (board, x, y) => {
            // 消除以(x,y)为中心的3×3区域
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && nx < board[0].length && ny >= 0 && ny < board.length) {
                        board[ny][nx] = 0;
                    }
                }
            }
            return { type: 'explosion', x, y, radius: 1 };
        }
    },
    
    // O型 - 时间减缓
    O: {
        name: '时间减缓',
        description: '下落速度减缓5秒',
        color: '#ffff00',
        activate: (game) => {
            game.slowMotion = true;
            game.slowMotionEnd = Date.now() + 5000;
            return { type: 'slow', duration: 5000 };
        }
    },
    
    // L型 - 随机清行
    L: {
        name: '随机清除',
        description: '随机清除1行障碍',
        color: '#ff8800',
        activate: (board) => {
            const obstacleRows = [];
            for (let y = 0; y < board.length; y++) {
                if (board[y].some(cell => cell === -1)) {
                    obstacleRows.push(y);
                }
            }
            if (obstacleRows.length > 0) {
                const row = obstacleRows[Math.floor(Math.random() * obstacleRows.length)];
                for (let x = 0; x < board[0].length; x++) {
                    board[row][x] = 0;
                }
                return { type: 'clearRow', row };
            }
            return null;
        }
    },
    
    // J型 - 镜像翻转
    J: {
        name: '镜像翻转',
        description: '左右镜像翻转当前区域',
        color: '#0000ff',
        activate: (board) => {
            // 找到最下面的非空行
            let bottomY = -1;
            for (let y = board.length - 1; y >= 0; y--) {
                if (board[y].some(cell => cell !== 0)) {
                    bottomY = y;
                    break;
                }
            }
            if (bottomY === -1) return null;
            
            // 镜像底部4行
            const startY = Math.max(0, bottomY - 3);
            for (let y = startY; y <= bottomY; y++) {
                board[y] = board[y].slice().reverse();
            }
            return { type: 'mirror', rows: [startY, bottomY] };
        }
    },
    
    // T型 - 重力消除
    T: {
        name: '重力消除',
        description: '消除当前列的所有方块',
        color: '#ff00ff',
        activate: (board, x) => {
            for (let y = 0; y < board.length; y++) {
                board[y][x] = 0;
            }
            return { type: 'columnClear', column: x };
        }
    },
    
    // S型 - 行交换
    S: {
        name: '行交换',
        description: '交换最下面两行的位置',
        color: '#00ff00',
        activate: (board) => {
            // 找到最下面两个非空行
            const rows = [];
            for (let y = board.length - 1; y >= 0 && rows.length < 2; y--) {
                if (board[y].some(cell => cell !== 0)) {
                    rows.push(y);
                }
            }
            if (rows.length === 2) {
                const temp = board[rows[0]];
                board[rows[0]] = board[rows[1]];
                board[rows[1]] = temp;
                return { type: 'swap', rows };
            }
            return null;
        }
    },
    
    // Z型 - 颜色炸弹
    Z: {
        name: '颜色炸弹',
        description: '消除所有同颜色方块',
        color: '#ff0000',
        activate: (board, x, y, color) => {
            if (!color) return null;
            let count = 0;
            for (let ry = 0; ry < board.length; ry++) {
                for (let rx = 0; rx < board[0].length; rx++) {
                    if (board[ry][rx] === color) {
                        board[ry][rx] = 0;
                        count++;
                    }
                }
            }
            return { type: 'colorBomb', color, count };
        }
    }
};

// 方块类型映射
const PIECE_SKILL_MAP = {
    'I': 'I',
    'O': 'O', 
    'L': 'L',
    'J': 'J',
    'T': 'T',
    'S': 'S',
    'Z': 'Z'
};

// 获取方块对应的技能
function getPieceSkill(pieceType) {
    const skillKey = PIECE_SKILL_MAP[pieceType];
    return skillKey ? SKILLS[skillKey] : null;
}

// 激活技能
function activateSkill(skillKey, board, x, y, color) {
    const skill = SKILLS[skillKey];
    if (!skill) return null;
    
    if (skillKey === 'O') {
        // O型技能需要game对象
        return skill;
    }
    
    return skill.activate(board, x, y, color);
}

// 技能能量系统
class SkillMeter {
    constructor() {
        this.energy = 0;
        this.maxEnergy = 3;
        this.activeSkill = null;
    }
    
    addEnergy(lines) {
        // 连续消除3行及以上才增加能量
        if (lines >= 3) {
            this.energy = Math.min(this.maxEnergy, this.energy + 1);
            return true;
        }
        return false;
    }
    
    canActivate() {
        return this.energy >= this.maxEnergy;
    }
    
    activate(skillKey) {
        if (!this.canActivate()) return false;
        this.energy = 0;
        this.activeSkill = skillKey;
        return true;
    }
    
    reset() {
        this.energy = 0;
        this.activeSkill = null;
    }
    
    getPercent() {
        return (this.energy / this.maxEnergy) * 100;
    }
}