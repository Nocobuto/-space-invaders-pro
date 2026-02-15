# 🎮 NEON INVADERS

A modern reimagining of the classic Space Invaders arcade game, built with Phaser 3 and vanilla JavaScript. Features progressive difficulty, power-ups, multiple alien types, and a sleek neon aesthetic.

![Game Screenshot](screenshot.png)
*Screenshot placeholder - add your own!*

## 🚀 [PLAY LIVE DEMO](https://your-username.github.io/space-invaders-pro/)

---

## ✨ Features

### 🎯 Core Gameplay
- **Progressive Difficulty System**: Each level increases speed and complexity
- **Multiple Alien Types**: Basic, Strong, Fast, and Boss aliens
- **Lives System**: Start with 3 lives, earn more through gameplay
- **Power-Up System**:
  - 🛡️ Shield: Temporary invulnerability
  - ⚡ Rapid Fire: Doubled fire rate
  - 🎯 Multi-Shot: Triple bullet spread

### 📊 Game Systems
- **High Score Persistence**: Scores saved via localStorage
- **Achievement System**: Track your accomplishments
- **Statistics Tracking**: Accuracy, kills, power-ups collected
- **Level Progression**: Infinite levels with increasing challenge

### 🎨 Visual & Audio
- **Neon Aesthetic**: Vibrant purple/blue color scheme
- **Particle Effects**: Explosions and visual feedback
- **Responsive Design**: Works on desktop and mobile
- **Touch Controls**: Optimized mobile interface
- **Sound Effects**: Web Audio API powered sounds

### 🏗️ Technical Highlights
- **Object-Oriented Architecture**: Clean class-based design
- **Modular Code Structure**: Separated concerns (entities, managers, scenes)
- **Configuration System**: Easy balancing and tweaking
- **Performance Optimized**: Object pooling for bullets
- **Responsive Canvas**: Scales to any screen size

---

## 🛠️ Tech Stack

- **Game Engine**: [Phaser 3.70.0](https://phaser.io/)
- **Language**: Vanilla JavaScript (ES6+)
- **APIs**: 
  - Web Audio API (sound)
  - LocalStorage API (save data)
  - Canvas API (rendering)
- **Architecture**: MVC-inspired pattern
- **Modules**: ES6 modules for code organization

---

## 📁 Project Structure
```
space-invaders-pro/
├── index.html              # Entry point
├── css/
│   └── style.css          # Global styles
├── js/
│   ├── main.js            # Game initialization
│   ├── config.js          # Configuration constants
│   ├── managers/
│   │   ├── ScoreManager.js    # Score & achievements
│   │   └── AudioManager.js    # Sound system
│   ├── entities/
│   │   ├── Player.js          # Player class
│   │   ├── Alien.js           # Alien class
│   │   └── PowerUp.js         # Power-up class
│   └── scenes/
│       ├── MenuScene.js       # Main menu
│       ├── GameScene.js       # Core gameplay
│       └── GameOverScene.js   # End screen
└── README.md
```

---

## 🎮 How to Play

### Controls

#### 🖥️ Desktop
- **← → Arrow Keys**: Move left/right
- **SPACE**: Fire
- **ESC**: Pause game

#### 📱 Mobile
- **Tap Left/Right Buttons**: Move
- **Tap Center Button**: Fire

### Objective
- Destroy all aliens to advance to the next level
- Avoid enemy fire
- Collect power-ups for advantages
- Survive as long as possible and beat your high score!

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- A local web server (required by Phaser)

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/your-username/space-invaders-pro.git
   cd space-invaders-pro
```

2. **Run a local server**

   **Option A: Python**
```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
```

   **Option B: Node.js**
```bash
   npx http-server
```

   **Option C: VS Code Live Server**
   - Install "Live Server" extension
   - Right-click `index.html` → "Open with Live Server"

3. **Open in browser**
```
   http://localhost:8000
```

---

## 🎯 Gameplay Mechanics

### Alien Types

| Type | Health | Points | Special |
|------|--------|--------|---------|
| Basic | 1 | 10 | Standard enemy |
| Strong | 2 | 25 | Takes multiple hits |
| Fast | 1 | 15 | Moves faster |
| Boss | 5 | 100 | Appears every 5 levels |

### Power-Ups

Power-ups have a 15% drop chance when destroying aliens and last 5 seconds:

- **Shield** 🛡️: Absorbs one hit
- **Rapid Fire** ⚡: Doubles fire rate
- **Multi-Shot** 🎯: Fires 3 bullets simultaneously

### Scoring System

- **Alien Destruction**: 10-100 points (type dependent)
- **Level Complete Bonus**: +100 points
- **No Hit Bonus**: +200 points (complete level without damage)
- **Perfect Accuracy**: +500 points (100% accuracy)

---

## 🏆 Achievements

Track your accomplishments:

- **First Blood**: Destroy your first alien
- **Marksman**: Hit 10 consecutive shots
- **Survivor**: Complete a level without taking damage
- **Speed Runner**: Complete a level in under 60 seconds
- **Collector**: Collect 5 power-ups in one level

---

## 🔧 Configuration

Edit `js/config.js` to tweak game parameters:
```javascript
export const GAME_CONFIG = {
    player: {
        speed: 300,
        fireRate: 250,
        startLives: 3
    },
    aliens: {
        baseSpeed: 60,
        speedIncreasePerLevel: 10
    },
    powerups: {
        dropChance: 0.15,
        duration: 5000
    }
    // ... more options
};
```

---

## 📊 Architecture Overview

### Class Diagram
```
GameScene
├── ScoreManager (manages scoring, stats, achievements)
├── AudioManager (handles all sound effects)
├── Player (player ship with power-ups)
├── Alien[] (multiple enemy types)
├── PowerUp[] (collectible bonuses)
└── Bullet Groups (object pooling)
```

### Key Design Patterns

- **Factory Pattern**: Creating different alien types
- **Object Pooling**: Bullet management for performance
- **Observer Pattern**: Scene transitions and events
- **Strategy Pattern**: Different alien behaviors
- **Singleton**: Score and Audio managers

---

## 🎓 What I Learned

Building this project taught me:

- **Game Development Fundamentals**: Game loops, collision detection, sprite management
- **Phaser 3 Framework**: Scene management, physics system, particle effects
- **Object-Oriented JavaScript**: ES6 classes, inheritance, encapsulation
- **Performance Optimization**: Object pooling, efficient rendering
- **Responsive Design**: Handling different screen sizes and input methods
- **State Management**: Managing complex game states
- **Modular Architecture**: Organizing large codebases

---

## 🚧 Future Enhancements

Potential improvements:

- [ ] **More Levels**: Hand-crafted level designs
- [ ] **Boss Battles**: Unique boss patterns every 10 levels
- [ ] **Local Multiplayer**: 2-player co-op mode
- [ ] **More Power-Ups**: Laser, bomb, time slow
- [ ] **Leaderboard**: Online high score tracking
- [ ] **Sound/Music**: Professional audio assets
- [ ] **Animations**: Sprite sheet animations for characters
- [ ] **Background Parallax**: Multi-layer scrolling backgrounds
- [ ] **Story Mode**: Campaign with narrative
- [ ] **Mobile App**: Package as PWA or Cordova app

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)
- LinkedIn: [Your Name](https://linkedin.com/in/your-name)
- Portfolio: [your-website.com](https://your-website.com)

---

## 🙏 Acknowledgments

- Original **Space Invaders** by Tomohiro Nishikado (1978)
- **Phaser** game framework by Photon Storm
- **Google Fonts**: Orbitron & Share Tech Mono
- Inspiration from classic arcade games

---

## 📸 Screenshots

### Main Menu
![Main Menu](screenshots/menu.png)

### Gameplay
![Gameplay](screenshots/gameplay.png)

### Game Over
![Game Over](screenshots/gameover.png)

---

## 🐛 Known Issues

- Sound effects are synthetic (Web Audio API beeps) - need real audio files
- No persistent leaderboard (only local high score)
- Mobile performance could be optimized further

---

## 📧 Contact

Have questions or suggestions? Open an issue or contact me!

---

<div align="center">

**⭐ Star this repo if you enjoyed the game! ⭐**

Made with ❤️ and ☕

</div>