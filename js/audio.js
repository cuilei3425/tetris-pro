/**
 * 音效系统
 * 使用 Web Audio API 生成音效
 */

class AudioManager {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.sounds = {};
    }
    
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    // 播放消除音效
    playClear(lines) {
        if (!this.enabled || !this.ctx) return;
        
        const baseFreq = lines >= 4 ? 880 : lines === 3 ? 660 : lines === 2 ? 550 : 440;
        
        for (let i = 0; i < lines; i++) {
            setTimeout(() => {
                this.playTone(baseFreq + i * 110, 0.1, 'sine');
            }, i * 50);
        }
    }
    
    // 播放技能音效
    playSkill() {
        if (!this.enabled || !this.ctx) return;
        
        // 华丽的技能音效
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C major arpeggio
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.15, 'triangle');
            }, i * 100);
        });
    }
    
    // 播放落地音效
    playDrop() {
        if (!this.enabled || !this.ctx) return;
        this.playTone(150, 0.05, 'square', 0.3);
    }
    
    // 播放旋转音效
    playRotate() {
        if (!this.enabled || !this.ctx) return;
        this.playTone(300, 0.03, 'sine', 0.2);
    }
    
    // 播放游戏结束音效
    playGameOver() {
        if (!this.enabled || !this.ctx) return;
        
        const notes = [440, 415, 392, 370, 349, 330, 311, 294];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.2, 'sawtooth', 0.3);
            }, i * 150);
        });
    }
    
    // 播放升级音效
    playLevelUp() {
        if (!this.enabled || !this.ctx) return;
        
        const notes = [440, 554, 659, 880];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, 0.2, 'square');
            }, i * 100);
        });
    }
    
    // 播放段位提升音效
    playRankUp() {
        if (!this.enabled || !this.ctx) return;
        
        // 华丽的庆祝音效
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const freq = 440 + Math.random() * 440;
                this.playTone(freq, 0.1, 'sine');
            }, i * 80);
        }
    }
    
    // 播放事件音效
    playEvent(isBuff) {
        if (!this.enabled || !this.ctx) return;
        
        if (isBuff) {
            // 增益音效 - 上升音阶
            const notes = [440, 554, 659];
            notes.forEach((freq, i) => {
                setTimeout(() => this.playTone(freq, 0.1), i * 80);
            });
        } else {
            // 干扰音效 - 下降音阶
            const notes = [330, 294, 262];
            notes.forEach((freq, i) => {
                setTimeout(() => this.playTone(freq, 0.15, 'sawtooth'), i * 100);
            });
        }
    }
    
    // 播放悔步音效
    playUndo() {
        if (!this.enabled || !this.ctx) return;
        this.playTone(880, 0.1, 'sine');
        setTimeout(() => this.playTone(440, 0.1, 'sine'), 100);
    }
    
    // 播放快速下落音效
    playHardDrop() {
        if (!this.enabled || !this.ctx) return;
        
        // 快速下落的呼啸声
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.3);
        
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }
    
    // 基础音色播放
    playTone(freq, duration, type = 'sine', volume = 0.5) {
        if (!this.ctx) return;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.frequency.value = freq;
        osc.type = type;
        
        gain.gain.setValueAtTime(volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }
    
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}