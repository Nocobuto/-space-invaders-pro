/**
 * GAME SCENE - ESCENA PRINCIPAL DEL JUEGO
 * 
 * Aquí ocurre toda la acción:
 * - Jugador vs Aliens
 * - Sistema de niveles
 * - Power-ups
 * - Colisiones
 * - UI en tiempo real
 */

import { GAME_CONFIG, IS_MOBILE } from '../config.js';
import { ScoreManager } from '../managers/ScoreManager.js';
import { AudioManager } from '../managers/AudioManager.js';
import { Player } from '../entities/Player.js';
import { Alien } from '../entities/Alien.js';
import { PowerUp } from '../entities/PowerUp.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    init() {
        // Variables de juego
        this.currentLevel = 1;
        this.isPaused = false;
        this.isGameOver = false;
        
        // Managers
        this.scoreManager = new ScoreManager();
        this.audioManager = new AudioManager(this);
        
        // Aliens
        this.aliens = [];
        
        // Grupos de Phaser
        this.alienSprites = null;
        this.bullets = null;
        this.enemyBullets = null;
        this.powerUps = [];
        
        // Movimiento de aliens
        this.alienDirection = 1;
        this.alienSpeed = GAME_CONFIG.aliens.baseSpeed;
        this.alienMoveTimer = 0;
        
        // Controles móviles
        this.touchControls = null;
        
        // ✅ NUEVO: Referencias del menú de pausa
        this.pauseContainer = null;
    }
    
    create() {
        const { width, height } = this.game.config;
        
        // Crear sprites procedurales
        this.createSprites();
        
        // Crear grupo de sprites de aliens
        this.alienSprites = this.physics.add.group();
        
        // Crear jugador
        this.player = new Player(this, width / 2, height - 60);
        
        // Crear grupos de balas
        this.createBulletGroups();
        
        // Crear nivel inicial
        this.createLevel();
        
        // Configurar controles
        this.setupControls();
        
        // Crear UI
        this.createUI();
        
        // Configurar colisiones
        this.setupCollisions();
        
        // Timer para disparos enemigos
        this.enemyFireTimer = this.time.addEvent({
            delay: GAME_CONFIG.aliens.fireRate,
            callback: this.enemyFire,
            callbackScope: this,
            loop: true
        });
        
        // Fade in
        this.cameras.main.fadeIn(500);
    }
    
    /**
     * Crear sprites procedurales
     */
    createSprites() {
        const graphics = this.add.graphics();
        
        // Sprite del jugador
        graphics.fillStyle(0x9333ea, 1);
        graphics.fillRect(0, 0, 40, 30);
        graphics.fillStyle(0x3b82f6, 1);
        graphics.fillTriangle(10, 0, 30, 0, 20, -10);
        graphics.generateTexture('player', 40, 40);
        graphics.clear();
        
        // Sprite del alien
        graphics.fillStyle(0x10b981, 1);
        graphics.fillRect(0, 0, 30, 20);
        graphics.fillStyle(0xef4444, 1);
        graphics.fillCircle(10, 10, 4);
        graphics.fillCircle(20, 10, 4);
        graphics.generateTexture('alien', 30, 20);
        graphics.clear();
        
        // Sprite de bala
        graphics.fillStyle(0xfbbf24, 1);
        graphics.fillRect(0, 0, 4, 12);
        graphics.generateTexture('bullet', 4, 12);
        graphics.clear();
        
        // Sprite de bala enemiga
        graphics.fillStyle(0xef4444, 1);
        graphics.fillRect(0, 0, 4, 12);
        graphics.generateTexture('enemyBullet', 4, 12);
        graphics.clear();
        
        // Sprite de partícula
        graphics.fillStyle(0x10b981, 1);
        graphics.fillCircle(2, 2, 2);
        graphics.generateTexture('particle', 4, 4);
        graphics.clear();
        
        // Sprite de power-up
        graphics.fillStyle(0xfbbf24, 1);
        graphics.fillCircle(10, 10, 10);
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(10, 10, 6);
        graphics.generateTexture('powerup', 20, 20);
        graphics.clear();
    }
    
    /**
     * Crear nivel
     */
    createLevel() {
        const { width } = this.game.config;
        
        // Calcular filas y columnas según nivel
        const baseRows = IS_MOBILE ? 3 : 4;
        const baseCols = IS_MOBILE ? 6 : 8;
        
        const rows = Math.min(
            baseRows + Math.floor(this.currentLevel / 3),
            GAME_CONFIG.levels.alienRows.max
        );
        
        const cols = Math.min(
            baseCols + Math.floor(this.currentLevel / 2),
            GAME_CONFIG.levels.alienCols.max
        );
        
        // Calcular offsets para centrar
        const offsetX = (width - (cols * 60)) / 2;
        const offsetY = 80;
        
        // Determinar si es nivel de BOSS
        const isBossLevel = this.currentLevel % GAME_CONFIG.levels.bossEveryNLevels === 0;
        
        if (isBossLevel) {
            // Crear BOSS en el centro
            const bossX = width / 2;
            const bossY = 150;
            const boss = new Alien(this, bossX, bossY, 'boss');
            this.aliens.push(boss);
            this.alienSprites.add(boss.getSprite());
        } else {
            // Crear grid normal
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const x = offsetX + col * 60;
                    const y = offsetY + row * 50;
                    
                    // Determinar tipo de alien según nivel y posición
                    let type = 'basic';
                    
                    if (this.currentLevel > 5 && row === 0) {
                        type = 'strong';
                    } else if (this.currentLevel > 3 && Math.random() < 0.2) {
                        type = 'fast';
                    }
                    
                    const alien = new Alien(this, x, y, type);
                    this.aliens.push(alien);
                    this.alienSprites.add(alien.getSprite());
                }
            }
        }
        
        // Ajustar velocidad según nivel
        this.alienSpeed = Math.min(
            GAME_CONFIG.aliens.baseSpeed + (this.currentLevel * GAME_CONFIG.aliens.speedIncreasePerLevel),
            GAME_CONFIG.aliens.maxSpeed
        );
    }
    
    /**
     * Crear grupos de balas
     */
    createBulletGroups() {
        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 10
        });
        
        this.enemyBullets = this.physics.add.group({
            defaultKey: 'enemyBullet',
            maxSize: 30
        });
    }
    
    /**
     * Configurar controles - ✅ CORREGIDO
     */
    setupControls() {
        // Teclado
        this.cursors = this.input.keyboard.createCursorKeys();
        this.fireKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        
        // ✅ CORRECCIÓN: Listener de pausa que funciona siempre
        this.pauseKey.on('down', () => {
            this.togglePause();
        });
        
        // Controles táctiles móviles
        if (IS_MOBILE) {
            this.createTouchControls();
        }
    }
    
    /**
     * Crear controles táctiles
     */
    createTouchControls() {
        const { width, height } = this.game.config;
        
        // Botón izquierdo
        const leftBtn = this.add.rectangle(
            width * 0.15, height - 60,
            100, 100,
            0x9333ea, 0.3
        ).setInteractive();
        
        this.add.text(width * 0.15, height - 60, '←', {
            fontSize: '48px',
            fill: '#9333ea'
        }).setOrigin(0.5);
        
        // Botón derecho
        const rightBtn = this.add.rectangle(
            width * 0.85, height - 60,
            100, 100,
            0x9333ea, 0.3
        ).setInteractive();
        
        this.add.text(width * 0.85, height - 60, '→', {
            fontSize: '48px',
            fill: '#9333ea'
        }).setOrigin(0.5);
        
        // Botón de disparo
        const fireBtn = this.add.rectangle(
            width / 2, height - 60,
            100, 100,
            0x3b82f6, 0.3
        ).setInteractive();
        
        this.add.text(width / 2, height - 60, '🔥', {
            fontSize: '36px'
        }).setOrigin(0.5);
        
        // Guardar referencias
        this.touchControls = {
            left: leftBtn,
            right: rightBtn,
            fire: fireBtn
        };
    }
    
    /**
     * Crear UI
     */
    createUI() {
        const { width } = this.game.config;
        
        // Score
        this.scoreText = this.add.text(20, 20, 'SCORE: 0', {
            fontSize: '24px',
            fill: '#9333ea',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        });
        this.scoreText.setShadow(0, 0, '#9333ea', 10, true, true);
        
        // High Score
        this.highScoreText = this.add.text(width / 2, 20, `HI-SCORE: ${this.scoreManager.highScore}`, {
            fontSize: '20px',
            fill: '#fbbf24',
            fontFamily: 'Orbitron'
        }).setOrigin(0.5);
        
        // Level
        this.levelText = this.add.text(width - 20, 20, `LEVEL: ${this.currentLevel}`, {
            fontSize: '24px',
            fill: '#3b82f6',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(1, 0);
        this.levelText.setShadow(0, 0, '#3b82f6', 10, true, true);
        
        // Vidas
        this.livesGroup = this.add.group();
        this.updateLivesDisplay();
        
        // Power-up indicators
        this.powerUpIndicators = {};
    }
    
    /**
     * Actualizar display de vidas
     */
    updateLivesDisplay() {
        this.livesGroup.clear(true, true);
        
        const startX = 20;
        const startY = 60;
        
        for (let i = 0; i < this.player.lives; i++) {
            const life = this.add.sprite(startX + (i * 30), startY, 'player');
            life.setScale(0.6);
            this.livesGroup.add(life);
        }
    }
    
    /**
     * Configurar colisiones
     */
    setupCollisions() {
        // Balas del jugador vs Aliens
        this.physics.add.overlap(
            this.bullets,
            this.alienSprites,
            this.hitAlien,
            null,
            this
        );
        
        // Balas enemigas vs Jugador
        this.physics.add.overlap(
            this.player.sprite,
            this.enemyBullets,
            this.hitPlayer,
            null,
            this
        );
    }
    
    /**
     * UPDATE - Loop principal
     */
    update(time, delta) {
        if (this.isPaused || this.isGameOver) return;
        
        // Actualizar jugador
        this.handlePlayerInput(time);
        this.player.update();
        
        // Actualizar aliens
        this.updateAliens(delta);
        
        // Actualizar power-ups
        this.updatePowerUps();
        
        // Limpiar balas fuera de pantalla
        this.cleanBullets();
        
        // Verificar victoria
        if (this.aliens.length === 0) {
            this.levelComplete();
        }
    }
    
    /**
     * Manejar input del jugador
     */
    handlePlayerInput(time) {
        // Movimiento
        let direction = 0;
        
        if (this.cursors.left.isDown) {
            direction = -1;
        } else if (this.cursors.right.isDown) {
            direction = 1;
        }
        
        // Controles táctiles
        if (IS_MOBILE && this.touchControls) {
            if (this.touchControls.left.input && this.touchControls.left.input.pointerOver()) {
                direction = -1;
            } else if (this.touchControls.right.input && this.touchControls.right.input.pointerOver()) {
                direction = 1;
            }
        }
        
        this.player.move(direction);
        
        // Disparo
        const firePressed = Phaser.Input.Keyboard.JustDown(this.fireKey) ||
            (IS_MOBILE && this.touchControls && 
             this.touchControls.fire.input && 
             this.touchControls.fire.input.pointerDown);
        
        if (firePressed && this.player.canFire(time)) {
            this.firePlayerBullet();
            this.player.updateFireTime(time);
        }
    }
    
    /**
     * Disparar bala del jugador
     */
    firePlayerBullet() {
        const pos = this.player.getPosition();
        
        // Registrar disparo para estadísticas
        this.scoreManager.shotFired();
        
        // Multi-shot power-up
        if (this.player.activePowerUps.multiShot) {
            // Disparo triple
            this.createBullet(pos.x - 15, pos.y - 20);
            this.createBullet(pos.x, pos.y - 20);
            this.createBullet(pos.x + 15, pos.y - 20);
        } else {
            // Disparo normal
            this.createBullet(pos.x, pos.y - 20);
        }
        
        this.audioManager.playShoot();
    }
    
    /**
     * Crear bala
     */
    createBullet(x, y) {
        const bullet = this.bullets.get(x, y);
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.velocity.y = -400;
        }
    }
    
    /**
     * Actualizar aliens
     */
    updateAliens(delta) {
        this.alienMoveTimer += delta;
        
        if (this.alienMoveTimer > 1000) {
            this.alienMoveTimer = 0;
            let shouldMoveDown = false;
            
            // Mover horizontalmente
            this.aliens.forEach(alien => {
                alien.move(this.alienDirection * this.alienSpeed, 0);
                
                // Verificar bordes
                if (alien.isAtEdge(50, this.game.config.width - 50)) {
                    shouldMoveDown = true;
                }
            });
            
            // Si tocaron borde: cambiar dirección y bajar
            if (shouldMoveDown) {
                this.alienDirection *= -1;
                
                this.aliens.forEach(alien => {
                    alien.move(0, GAME_CONFIG.aliens.moveDownAmount);
                    
                    // Verificar si llegaron al jugador
                    if (alien.getPosition().y > this.game.config.height - 120) {
                        this.gameOver();
                    }
                });
            }
        }
    }
    
    /**
     * Disparo enemigo
     */
    enemyFire() {
        if (this.aliens.length === 0) return;
        
        // Seleccionar alien aleatorio que pueda disparar
        const shooters = this.aliens.filter(a => a.canFire());
        if (shooters.length === 0) return;
        
        const shooter = Phaser.Utils.Array.GetRandom(shooters);
        const pos = shooter.getPosition();
        
        const bullet = this.enemyBullets.get(pos.x, pos.y + 20);
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.velocity.y = 200;
        }
    }
    
    /**
     * Actualizar power-ups
     */
    updatePowerUps() {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            
            // Verificar colisión con jugador
            if (this.physics.overlap(this.player.sprite, powerUp.getSprite())) {
                const type = powerUp.collect();
                this.collectPowerUp(type);
                this.powerUps.splice(i, 1);
                continue;
            }
            
            // Eliminar si está fuera de pantalla
            if (powerUp.isOffScreen()) {
                powerUp.destroy();
                this.powerUps.splice(i, 1);
            }
        }
    }
    
    /**
     * Limpiar balas fuera de pantalla
     */
    cleanBullets() {
        this.bullets.children.entries.forEach(bullet => {
            if (bullet.active && bullet.y < 0) {
                bullet.setActive(false);
                bullet.setVisible(false);
                // Registrar disparo fallado
                this.scoreManager.shotMissed();
            }
        });
        
        this.enemyBullets.children.entries.forEach(bullet => {
            if (bullet.active && bullet.y > this.game.config.height) {
                bullet.setActive(false);
                bullet.setVisible(false);
            }
        });
    }
    
    /**
     * Colisión: bala del jugador toca alien
     */
    hitAlien(bullet, alienSprite) {
        // Encontrar el objeto Alien correspondiente al sprite
        const alien = this.aliens.find(a => a.getSprite() === alienSprite);
        if (!alien) return;
        
        // Desactivar bala
        bullet.setActive(false);
        bullet.setVisible(false);
        
        // Alien recibe daño
        const isDead = alien.takeDamage();
        
        if (isDead) {
            const pos = alien.getPosition();
            const points = alien.getPoints();
            
            // Explosión de partículas
            this.createExplosion(pos.x, pos.y);
            
            // Remover sprite del grupo
            this.alienSprites.remove(alienSprite);
            
            // Destruir sprite y objeto alien
            alienSprite.destroy();
            this.aliens = this.aliens.filter(a => a !== alien);
            alien.destroy();
            
            // Añadir puntos
            const newRecord = this.scoreManager.addScore(points);
            this.updateScoreDisplay(newRecord);
            
            // Registrar kill
            this.scoreManager.alienKilled();
            
            // Sonido
            this.audioManager.playExplosion();
            
            // Probabilidad de soltar power-up
            if (Math.random() < GAME_CONFIG.powerups.dropChance) {
                this.spawnPowerUp(pos.x, pos.y);
            }
            
            // Mostrar texto de puntos
            this.showFloatingText(pos.x, pos.y, `+${points}`);
        }
    }
    
    /**
     * Colisión: bala enemiga toca jugador
     */
    hitPlayer(playerSprite, bullet) {
        bullet.destroy();
        
        // Jugador recibe daño
        const lostLife = this.player.takeDamage();
        
        if (lostLife) {
            this.updateLivesDisplay();
            this.audioManager.playHit();
            
            // Shake de cámara
            this.cameras.main.shake(200, 0.01);
            
            // Verificar game over
            if (!this.player.isAlive()) {
                this.gameOver();
            }
        }
    }
    
    /**
     * Crear explosión de partículas - ✅ CORREGIDO
     */
    createExplosion(x, y) {
        // ✅ CORRECCIÓN: Crear emisor y destruirlo después
        const particles = this.add.particles(x, y, 'particle', {
            speed: { min: 100, max: 200 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            lifespan: 300,  // Duración de cada partícula: 300ms
            gravityY: 0,
            quantity: 10,
            tint: 0x10b981
        });
        
        // ✅ CORRECCIÓN: Destruir el emisor después de 400ms (un poco más que lifespan)
        this.time.delayedCall(400, () => {
            particles.destroy();
        });
    }
    
    /**
     * Spawn power-up
     */
    spawnPowerUp(x, y) {
        const types = Object.keys(GAME_CONFIG.powerups.types);
        const type = Phaser.Utils.Array.GetRandom(types);
        
        const powerUp = new PowerUp(this, x, y, type);
        this.powerUps.push(powerUp);
    }
    
    /**
     * Recoger power-up
     */
    collectPowerUp(type) {
        this.player.activatePowerUp(type);
        this.scoreManager.powerUpCollected();
        this.audioManager.playPowerUp();
        
        // Mostrar indicador
        this.showPowerUpIndicator(type);
    }
    
    /**
     * Mostrar indicador de power-up activo
     */
    showPowerUpIndicator(type) {
        const { width } = this.game.config;
        const y = 100;
        
        const text = this.add.text(width - 20, y, `${type.toUpperCase()}`, {
            fontSize: '16px',
            fill: '#fbbf24',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(1, 0);
        
        // Animación de desvanecimiento
        this.tweens.add({
            targets: text,
            alpha: 0,
            duration: GAME_CONFIG.powerups.duration,
            onComplete: () => text.destroy()
        });
    }
    
    /**
     * Mostrar texto flotante
     */
    showFloatingText(x, y, text) {
        const floatingText = this.add.text(x, y, text, {
            fontSize: '20px',
            fill: '#fbbf24',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: floatingText,
            y: y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => floatingText.destroy()
        });
    }
    
    /**
     * Actualizar display de score
     */
    updateScoreDisplay(newRecord) {
        this.scoreText.setText(`SCORE: ${this.scoreManager.currentScore}`);
        
        if (newRecord) {
            this.highScoreText.setText(`HI-SCORE: ${this.scoreManager.highScore}`);
            
            // Efecto visual de nuevo récord
            this.tweens.add({
                targets: this.highScoreText,
                scale: 1.2,
                duration: 200,
                yoyo: true,
                repeat: 3
            });
        }
    }
    
    /**
     * Nivel completado
     */
    levelComplete() {
        this.isPaused = true;
        
        // Bonus por completar nivel
        const bonus = GAME_CONFIG.scoring.levelCompleteBonus;
        this.scoreManager.addScore(bonus);
        this.updateScoreDisplay();
        
        // Mensaje
        const { width, height } = this.game.config;
        
        const text = this.add.text(width / 2, height / 2, `LEVEL ${this.currentLevel}\nCOMPLETE!`, {
            fontSize: '48px',
            fill: '#10b981',
            fontFamily: 'Orbitron',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        text.setShadow(0, 0, '#10b981', 20, true, true);
        
        const bonusText = this.add.text(width / 2, height / 2 + 80, `BONUS: +${bonus}`, {
            fontSize: '32px',
            fill: '#fbbf24',
            fontFamily: 'Orbitron'
        }).setOrigin(0.5);
        
        // Siguiente nivel después de 3 segundos
        this.time.delayedCall(3000, () => {
            text.destroy();
            bonusText.destroy();
            this.nextLevel();
        });
    }
    
    /**
     * Siguiente nivel
     */
    nextLevel() {
        this.currentLevel++;
        this.levelText.setText(`LEVEL: ${this.currentLevel}`);
        
        // Limpiar arrays
        this.aliens = [];
        
        // Limpiar balas
        this.bullets.clear(true, true);
        this.enemyBullets.clear(true, true);
        
        // Limpiar grupo de sprites de aliens
        this.alienSprites.clear(true, true);
        
        // Crear nuevo nivel
        this.createLevel();
        
        this.isPaused = false;
    }
    
    /**
     * Toggle pause - ✅ CORREGIDO
     */
    togglePause() {
        // No pausar si el juego terminó
        if (this.isGameOver) return;
        
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.physics.pause();
            this.showPauseMenu();
        } else {
            this.physics.resume();
            this.hidePauseMenu();
        }
    }
    
    /**
     * Mostrar menú de pausa - ✅ CORREGIDO
     */
    showPauseMenu() {
        const { width, height } = this.game.config;
        
        // ✅ CORRECCIÓN: Crear container para todo el menú de pausa
        this.pauseContainer = this.add.container(0, 0);
        
        // Overlay
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7);
        overlay.setOrigin(0);
        this.pauseContainer.add(overlay);
        
        // Texto PAUSED
        const pauseText = this.add.text(width / 2, height / 2 - 50, 'PAUSED', {
            fontSize: '64px',
            fill: '#9333ea',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        pauseText.setShadow(0, 0, '#9333ea', 20, true, true);
        this.pauseContainer.add(pauseText);
        
        // ✅ NUEVO: Instrucción de cómo despausar
        const instruction = this.add.text(width / 2, height / 2 + 30, 'Press ESC to resume', {
            fontSize: '24px',
            fill: '#a78bfa',
            fontFamily: 'Share Tech Mono'
        }).setOrigin(0.5);
        this.pauseContainer.add(instruction);
        
        // Animación de parpadeo
        this.tweens.add({
            targets: instruction,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        
        // ✅ NUEVO: Botón alternativo para despausar (especialmente útil en móvil)
        const resumeButton = this.add.text(width / 2, height / 2 + 100, 'RESUME', {
            fontSize: '32px',
            fill: '#10b981',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        resumeButton.setInteractive({ useHandCursor: true });
        
        resumeButton.on('pointerover', () => {
            resumeButton.setScale(1.1);
        });
        
        resumeButton.on('pointerout', () => {
            resumeButton.setScale(1);
        });
        
        resumeButton.on('pointerdown', () => {
            this.togglePause();
        });
        
        this.pauseContainer.add(resumeButton);
    }
    
    /**
     * Ocultar menú de pausa - ✅ CORREGIDO
     */
    hidePauseMenu() {
        // ✅ CORRECCIÓN: Destruir el container completo
        if (this.pauseContainer) {
            this.pauseContainer.destroy();
            this.pauseContainer = null;
        }
    }
    
    /**
     * Game Over
     */
    gameOver() {
        this.isGameOver = true;
        this.physics.pause();
        
        this.audioManager.playGameOver();
        
        // Transición a GameOverScene
        this.time.delayedCall(1000, () => {
            this.scene.start('GameOverScene', {
                score: this.scoreManager.currentScore,
                highScore: this.scoreManager.highScore,
                level: this.currentLevel,
                stats: this.scoreManager.getDisplayData()
            });
        });
    }
}