# 🎮 赛博方块 CyberTetris

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
</p>

一款赛博朋克风格的俄罗斯方块游戏，具有炫酷的视觉效果、技能系统和段位晋升机制。

## ✨ 特性

- 🎨 **赛博朋克视觉风格** - 霓虹灯效、粒子特效、渐变背景
- ⚡ **技能系统** - 积攒能量释放强力技能
- 🏆 **段位系统** - 从青铜到王者，挑战更高段位
- 📊 **每日任务** - 完成任务获取奖励
- 🎭 **皮肤系统** - 解锁不同风格的方块皮肤
- ↩️ **悔步功能** - 失误后可回退一步
- 🎯 **多关卡选择** - 不同难度等级挑战

## 🚀 安装与部署

### 本地运行

1. **克隆仓库**
```bash
git clone https://github.com/yourusername/tetris-pro.git
cd tetris-pro
```

2. **直接打开**
```bash
# 方式一：直接双击 index.html 在浏览器中打开
# 方式二：使用本地服务器（推荐）

# Python 3
python -m http.server 8080

# Node.js
npx serve .

# 然后访问 http://localhost:8080
```

### 在线部署

#### GitHub Pages
1. 进入仓库 Settings → Pages
2. Source 选择 "Deploy from a branch"
3. Branch 选择 "main" 和 "/ (root)"
4. 保存后即可访问 `https://yourusername.github.io/tetris-pro`

#### Vercel / Netlify
直接拖拽项目文件夹到 Vercel 或 Netlify 即可自动部署。

## 🎮 游戏操作

| 按键 | 功能 |
|------|------|
| ← → | 左右移动 |
| ↑ | 旋转方块 |
| ↓ | 加速下落 |
| 空格 | 快速下落 |
| Z | 悔步 |
| P | 暂停游戏 |

## 📁 项目结构

```
tetris-pro/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── game.js         # 核心游戏逻辑
│   ├── levels.js       # 关卡配置
│   ├── skills.js       # 技能系统
│   ├── events.js       # 游戏事件
│   └── audio.js        # 音效管理
└── README.md           # 项目说明
```

## 🎯 游戏系统说明

### 段位系统
- 🥉 青铜 → 🥈 白银 → 🥇 黄金 → 💎 铂金 → 💠 钻石 → 👑 王者
- 消除行数累计提升段位

### 技能系统
- 消除行数积攒能量
- 能量满后可触发强力技能
- 不同技能效果各异

### 每日任务
- 消除指定行数
- 触发技能次数
- 通关新关卡

## 🛠️ 技术栈

- **HTML5 Canvas** - 游戏渲染
- **CSS3** - 赛博朋克风格UI
- **原生 JavaScript** - 游戏逻辑（无依赖）

## 📜 开源协议

MIT License

## 🙏 致谢

感谢所有支持这个项目的朋友！
