/**
 * 赛博方块 - 游戏主逻辑
 */

// 方块形状定义
const PIECES = {
    I: {
        shape: [
            [0,0,0,0],
            [1,1,1,1],
            [0,0,0,0],
            [0,0,0,0]
        ],
        color: '#00ffff'
    },
    O: {
        shape: [
            [1,1],
            [1,1]
        ],
        color: '#ffff00'
    },
    T: {
        shape: [
            [0,1,0],
            [1,1,1],
            [0,0,0]
        ],
        color: '#ff00ff'
    },
    L: {
        shape: [
            [0,0,1],
            [1,1,1],
            [0,0,0]
        ],
        color: '#ff8800'
    },
    J: {
        shape: [
            [1,0,0],
            [1,1,1],
            [0,0,0]
        ],
        color: '#0000ff'
    },
    S: {
        shape: [
            [0,1,1],
            [1,1,0],
            [0,0,0]
        ],
        color: '#00ff00'
    },
    Z: {
        shape: [
            [1,1,0],
            [0,1,1],
            [0,0,0]
        ],
        color: '#ff0000'
    }
};

// 游戏主类
class TetrisGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('next-canvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        // 游戏配置
        this.cols = 10;
        this.rows = 20;
        this.cellSize = 30;
        
        // 游戏状态
        this.board = [];
        this.currentPiece = null;
        this.nextPiece = null;
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameOver = false;
        
        // 速度控制
        this.dropCounter = 0;
        this.dropInterval = 1000;
        this.lastTime = 0;
        this.currentSpeed = 1000;
        
        // 技能系统
        this.skillMeter = new SkillMeter();
        this.slowMotion = false;
        this.slowMotionEnd = 0;
        
        // 事件系统
        this.eventTrigger = new EventTrigger();
        
        // 音效系统
        this.audio = new AudioManager();
        
        // 悔步系统
        this.undoCount = 3;
        this.history = [];
        
        // 方块类型
        this.pieceTypes = Object.keys(PIECES);
        
        this.init();
    }
    
    init() {
        this.createBoard();
        this.bindEvents();
        this.generateLevelGrid();
    }
    
    createBoard() {
        this.board = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0));
    }
    
    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => this.handleKey(e));
        
        // 开始菜单按钮
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('select-level-btn').addEventListener('click', () => this.showLevelSelect());
        document.getElementById('settings-btn').addEventListener('click', () => this.showSettings());
        document.getElementById('back-btn').addEventListener('click', () => this.showMainMenu());
        
        // 游戏结束按钮
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('menu-btn').addEventListener('click', () => this.returnToMenu());
        
        // 游戏内按钮
        document.getElementById('undo-btn').addEventListener('click', () => this.undo());
        document.getElementById('overlay-btn').addEventListener('click', () => this.togglePause());
    }
    
    handleKey(e) {
        if (!this.gameRunning || this.gameOver) {
            if (e.code === 'Enter' && !this.gameRunning && document.getElementById('start-screen').style.display !== 'none') {
                this.startGame();
            }
            return;
        }
        
        if (this.gamePaused && e.code !== 'KeyP') return;
        
        switch(e.code) {
            case 'ArrowLeft':
                e.preventDefault();
                this.movePiece(-1, 0);
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.movePiece(1, 0);
                break;
            case 'ArrowDown':
                e.preventDefault();
                this.softDrop();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.rotatePiece();
                break;
            case 'Space':
                e.preventDefault();
                this.hardDrop();
                break;
            case 'KeyZ':
                e.preventDefault();
                this.undo();
                break;
            case 'KeyP':
                e.preventDefault();
                this.togglePause();
                break;
        }
    }
    
    startGame(selectedLevel = 1) {
        this.audio.init();
        this.level = selectedLevel;
        this.resetGame();
        
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('level-select').classList.add('hidden');
        document.getElementById('game-container').style.display = 'block';
        
        this.spawnPiece();
        this.spawnNextPiece();
        this.gameRunning = true;
        this.lastTime = performance.now();
        this.update();
    }
    
    resetGame() {
        this.createBoard();
        this.score = 0;
        this.lines = 0;
        this.gameOver = false;
        this.gamePaused = false;
        this.undoCount = 3;
        this.skillMeter.reset();
        this.eventTrigger.reset();
        this.history = [];
        this.currentPiece = null;
        this.nextPiece = null;
        
        this.updateUI();
    }
    
    spawnPiece() {
        if (this.nextPiece) {
            this.currentPiece = this.nextPiece;
        } else {
            this.currentPiece = this.createRandomPiece();
        }
        this.nextPiece = this.createRandomPiece();
        this.drawNextPiece();
        
        // 检查游戏结束
        if (!this.isValidPosition(this.currentPiece, this.currentPiece.x, this.currentPiece.y)) {
            this.endGame();
        }
    }
    
    spawnNextPiece() {
        // nextPiece 已经在 spawnPiece 中生成
    }
    
    createRandomPiece() {
        const type = this.pieceTypes[Math.floor(Math.random() * this.pieceTypes.length)];
        const pieceData = PIECES[type];
        return {
            type: type,
            shape: pieceData.shape.map(row => [...row]),
            color: pieceData.color,
            x: Math.floor(this.cols / 2) - Math.floor(pieceData.shape[0].length / 2),
            y: 0,
            skill: getPieceSkill(type)
        };
    }
    
    movePiece(dx, dy) {
        if (!this.currentPiece) return false;
        
        if (this.isValidPosition(this.currentPiece, this.currentPiece.x + dx, this.currentPiece.y + dy)) {
            this.saveState();
            this.currentPiece.x += dx;
            this.currentPiece.y += dy;
            return true;
        }
        return false;
    }
    
    rotatePiece() {
        if (!this.currentPiece) return;
        
        const rotated = this.currentPiece.shape[0].map((_, i) =>
            this.currentPiece.shape.map(row => row[i]).reverse()
        );
        
        const originalShape = this.currentPiece.shape;
        this.currentPiece.shape = rotated;
        
        // 踢墙检测
        const kicks = [0, -1, 1, -2, 2];
        for (const kick of kicks) {
            if (this.isValidPosition(this.currentPiece, this.currentPiece.x + kick, this.currentPiece.y)) {
                this.saveState();
                this.currentPiece.x += kick;
                this.audio.playRotate();
                return;
            }
        }
        
        // 旋转失败，恢复原状
        this.currentPiece.shape = originalShape;
    }
    
    softDrop() {
        if (this.movePiece(0, 1)) {
            this.score += 1;
            this.updateUI();
        }
    }
    
    hardDrop() {
        this.saveState();
        let dropDistance = 0;
        while (this.isValidPosition(this.currentPiece, this.currentPiece.x, this.currentPiece.y + 1)) {
            this.currentPiece.y++;
            dropDistance++;
        }
        this.score += dropDistance * 2;
        this.audio.playHardDrop();
        this.lockPiece();
    }
    
    lockPiece() {
        if (!this.currentPiece) return;
        
        // 固定方块到棋盘
        this.currentPiece.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    const boardY = this.currentPiece.y + y;
                    const boardX = this.currentPiece.x + x;
                    if (boardY >= 0 && boardY < this.rows && boardX >= 0 && boardX < this.cols) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            });
        });
        
        this.audio.playDrop();
        
        // 检查并清除行
        const clearedLines = this.clearLines();
        
        // 更新分数和行数
        if (clearedLines > 0) {
            this.lines += clearedLines;
            this.score += this.calculateScore(clearedLines);
            this.skillMeter.addEnergy(clearedLines);
            this.audio.playClear(clearedLines);
            
            // 检查事件触发
            if (this.eventTrigger.addLines(clearedLines)) {
                this.triggerRandomEvent();
            }
            
            // 检查升级
            this.checkLevelUp();
        }
        
        // 生成新方块
        this.spawnPiece();
        this.updateUI();
    }
    
    clearLines() {
        let clearedCount = 0;
        
        for (let y = this.rows - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0 && cell !== -1)) {
                // 移除该行
                this.board.splice(y, 1);
                // 在顶部添加新行
                this.board.unshift(Array(this.cols).fill(0));
                clearedCount++;
                y++; // 重新检查当前行
            }
        }
        
        return clearedCount;
    }
    
    calculateScore(lines) {
        const baseScore = [0, 100, 300, 500, 800];
        return baseScore[lines] * this.level;
    }
    
    checkLevelUp() {
        const newLevel = Math.floor(this.lines / 10) + 1;
        if (newLevel > this.level && newLevel <= 50) {
            this.level = newLevel;
            this.audio.playLevelUp();
            this.showEventToast(`🎉 升级到第 ${this.level} 关!`, 'buff');
        }
        
        // 更新速度
        const levelConfig = this.getCurrentLevelConfig();
        this.currentSpeed = levelConfig.speed;
    }
    
    getCurrentLevelConfig() {
        return LEVELS[Math.min(this.level - 1, LEVELS.length - 1)];
    }
    
    triggerRandomEvent() {
        const event = this.eventTrigger.selectEvent(this);
        if (event) {
            event.execute(this);
            this.audio.playEvent(event.type === 'buff');
        }
    }
    
    isValidPosition(piece, x, y) {
        return piece.shape.every((row, py) => {
            return row.every((cell, px) => {
                if (!cell) return true;
                
                const newX = x + px;
                const newY = y + py;
                
                // 检查边界
                if (newX < 0 || newX >= this.cols || newY >= this.rows) return false;
                
                // 检查碰撞（超出顶部不算碰撞）
                if (newY >= 0 && this.board[newY][newX] !== 0) return false;
                
                return true;
            });
        });
    }
    
    update(time = 0) {
        if (!this.gameRunning) return;
        
        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        
        if (!this.gamePaused && !this.gameOver) {
            // 检查慢动作效果
            let interval = this.currentSpeed;
            if (this.slowMotion) {
                if (Date.now() > this.slowMotionEnd) {
                    this.slowMotion = false;
                } else {
                    interval *= 2;
                }
            }
            
            this.dropCounter += deltaTime;
            if (this.dropCounter > interval) {
                if (!this.movePiece(0, 1)) {
                    this.lockPiece();
                }
                this.dropCounter = 0;
            }
        }
        
        this.draw();
        requestAnimationFrame((t) => this.update(t));
    }
    
    draw() {
        // 清空画布
        this.ctx.fillStyle = '#0a0a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格线
        this.drawGrid();
        
        // 绘制已固定的方块
        this.board.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    this.drawCell(x, y, cell, cell === -1);
                }
            });
        });
        
        // 绘制当前方块
        if (this.currentPiece) {
            this.drawPiece(this.currentPiece);
            // 绘制阴影
            this.drawGhost();
        }
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x <= this.cols; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.cellSize, 0);
            this.ctx.lineTo(x * this.cellSize, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.rows; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.cellSize);
            this.ctx.lineTo(this.canvas.width, y * this.cellSize);
            this.ctx.stroke();
        }
    }
    
    drawCell(x, y, color, isObstacle = false) {
        const px = x * this.cellSize;
        const py = y * this.cellSize;
        
        if (isObstacle) {
            this.ctx.fillStyle = '#444';
            this.ctx.fillRect(px + 1, py + 1, this.cellSize - 2, this.cellSize - 2);
            this.ctx.strokeStyle = '#666';
            this.ctx.strokeRect(px + 3, py + 3, this.cellSize - 6, this.cellSize - 6);
        } else {
            // 方块主体
            this.ctx.fillStyle = color;
            this.ctx.fillRect(px + 1, py + 1, this.cellSize - 2, this.cellSize - 2);
            
            // 高光效果
            this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
            this.ctx.fillRect(px + 1, py + 1, this.cellSize - 2, 4);
            this.ctx.fillRect(px + 1, py + 1, 4, this.cellSize - 2);
            
            // 边框
            this.ctx.strokeStyle = 'rgba(255,255,255,0.5)';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(px + 1, py + 1, this.cellSize - 2, this.cellSize - 2);
        }
    }
    
    drawPiece(piece) {
        piece.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    this.drawCell(piece.x + x, piece.y + y, piece.color);
                }
            });
        });
    }
    
    drawGhost() {
        if (!this.currentPiece) return;
        
        let ghostY = this.currentPiece.y;
        while (this.isValidPosition(this.currentPiece, this.currentPiece.x, ghostY + 1)) {
            ghostY++;
        }
        
        if (ghostY !== this.currentPiece.y) {
            this.ctx.globalAlpha = 0.3;
            this.currentPiece.shape.forEach((row, y) => {
                row.forEach((cell, x) => {
                    if (cell) {
                        this.drawCell(this.currentPiece.x + x, ghostY + y, this.currentPiece.color);
                    }
                });
            });
            this.ctx.globalAlpha = 1;
        }
    }
    
    drawNextPiece() {
        this.nextCtx.fillStyle = '#0a0a1a';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (!this.nextPiece) return;
        
        const cellSize = 25;
        const offsetX = (this.nextCanvas.width - this.nextPiece.shape[0].length * cellSize) / 2;
        const offsetY = (this.nextCanvas.height - this.nextPiece.shape.length * cellSize) / 2;
        
        this.nextPiece.shape.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell) {
                    const px = offsetX + x * cellSize;
                    const py = offsetY + y * cellSize;
                    
                    this.nextCtx.fillStyle = this.nextPiece.color;
                    this.nextCtx.fillRect(px + 1, py + 1, cellSize - 2, cellSize - 2);
                    
                    this.nextCtx.fillStyle = 'rgba(255,255,255,0.3)';
                    this.nextCtx.fillRect(px + 1, py + 1, cellSize - 2, 3);
                    this.nextCtx.fillRect(px + 1, py + 1, 3, cellSize - 2);
                }
            });
        });
    }
    
    saveState() {
        // 保存状态用于悔步
        if (this.history.length >= 10) {
            this.history.shift();
        }
        this.history.push({
            board: this.board.map(row => [...row]),
            piece: this.currentPiece ? {
                ...this.currentPiece,
                shape: this.currentPiece.shape.map(row => [...row])
            } : null,
            score: this.score,
            lines: this.lines
        });
    }
    
    undo() {
        if (this.undoCount <= 0 || this.history.length === 0 || this.gameOver) return;
        
        const state = this.history.pop();
        this.board = state.board;
        this.currentPiece = state.piece;
        this.score = state.score;
        this.lines = state.lines;
        this.undoCount--;
        
        this.audio.playUndo();
        this.updateUI();
    }
    
    togglePause() {
        this.gamePaused = !this.gamePaused;
        const overlay = document.getElementById('game-overlay');
        
        if (this.gamePaused) {
            overlay.classList.remove('hidden');
            document.getElementById('overlay-title').textContent = '游戏暂停';
            document.getElementById('overlay-desc').textContent = '按空格键或点击按钮继续';
            document.getElementById('overlay-btn').textContent = '继续游戏';
        } else {
            overlay.classList.add('hidden');
            this.lastTime = performance.now();
        }
    }
    
    endGame() {
        this.gameOver = true;
        this.gameRunning = false;
        this.audio.playGameOver();
        
        document.getElementById('final-score').textContent = `最终得分: ${this.score}`;
        document.getElementById('game-over').classList.remove('hidden');
    }
    
    restartGame() {
        this.startGame(this.level);
    }
    
    returnToMenu() {
        document.getElementById('game-over').classList.add('hidden');
        document.getElementById('start-screen').classList.remove('hidden');
        document.getElementById('game-container').style.display = 'none';
        this.gameRunning = false;
    }
    
    showLevelSelect() {
        document.querySelector('.menu-buttons').classList.add('hidden');
        document.getElementById('level-select').classList.remove('hidden');
    }
    
    showMainMenu() {
        document.querySelector('.menu-buttons').classList.remove('hidden');
        document.getElementById('level-select').classList.add('hidden');
    }
    
    showSettings() {
        alert('设置功能开发中...');
    }
    
    generateLevelGrid() {
        const grid = document.getElementById('level-grid');
        grid.innerHTML = '';
        
        for (let i = 1; i <= 50; i++) {
            const btn = document.createElement('button');
            btn.className = 'level-btn';
            btn.textContent = i;
            btn.addEventListener('click', () => this.startGame(i));
            
            // 根据难度设置颜色
            if (i <= 10) btn.classList.add('novice');
            else if (i <= 20) btn.classList.add('beginner');
            else if (i <= 30) btn.classList.add('intermediate');
            else if (i <= 40) btn.classList.add('expert');
            else btn.classList.add('master');
            
            grid.appendChild(btn);
        }
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lines').textContent = this.lines;
        document.getElementById('level').textContent = this.level;
        document.getElementById('undo-count').textContent = this.undoCount;
        
        // 更新段位
        const rank = getCurrentRank(this.lines);
        const rankEl = document.getElementById('rank');
        rankEl.className = 'value ' + rank;
        rankEl.textContent = RANKS[rank].name;
        
        // 更新段位进度
        const progress = getRankProgress(this.lines);
        document.getElementById('rank-fill').style.width = progress.percent + '%';
        document.getElementById('rank-text').textContent = `${progress.currentDisplay}/${progress.target} 行`;
        
        this.updateSkillMeter();
    }
    
    updateSkillMeter() {
        document.getElementById('skill-fill').style.width = this.skillMeter.getPercent() + '%';
        
        const skillText = this.skillMeter.activeSkill 
            ? SKILLS[this.skillMeter.activeSkill].name 
            : '无';
        document.getElementById('active-skill').textContent = skillText;
    }
    
    updateUndoDisplay() {
        document.getElementById('undo-count').textContent = this.undoCount;
    }
    
    showEventToast(message, type = 'buff') {
        const toast = document.getElementById('event-toast');
        toast.textContent = message;
        toast.className = type;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }
}

// 初始化游戏
let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new TetrisGame();
});
