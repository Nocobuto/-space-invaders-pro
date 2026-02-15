/**
 * MENÚ PRINCIPAL
 * 
 * Primera escena que ve el jugador
 * Opciones: Play, High Scores, Controls, Credits
 */

import { GAME_CONFIG } from '../config.js';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    create() {
        const { width, height } = this.game.config;
        
        // Fondo de estrellas animadas
        this.createStarfield();
        
        // Logo del juego
        this.createLogo();
        
        // Menú de opciones
        this.createMenu();
        
        // High Score display
        this.createHighScoreDisplay();
        
        // Versión del juego
        this.add.text(width / 2, height - 20, 'v1.0.0 - Made by Arturo Bracamontes', {
            fontSize: '12px',
            fill: '#6366f1',
            fontFamily: 'Share Tech Mono'
        }).setOrigin(0.5);
        
        // Controles de teclado
        this.input.keyboard.once('keydown-SPACE', () => {
            this.startGame();
        });
    }
    
    /**
     * Crear campo de estrellas
     */
    createStarfield() {
        const { width, height } = this.game.config;
        
        // Crear múltiples capas de estrellas con parallax
        for (let layer = 0; layer < 3; layer++) {
            const numStars = 30;
            const speed = (layer + 1) * 20;
            
            for (let i = 0; i < numStars; i++) {
                const x = Phaser.Math.Between(0, width);
                const y = Phaser.Math.Between(0, height);
                const size = Phaser.Math.Between(1, 3);
                
                const star = this.add.circle(x, y, size, 0xffffff, 0.8);
                
                // Animación de movimiento
                this.tweens.add({
                    targets: star,
                    y: height + 10,
                    duration: speed * 100,
                    repeat: -1,
                    onRepeat: () => {
                        star.y = -10;
                        star.x = Phaser.Math.Between(0, width);
                    }
                });
                
                // Animación de brillo
                this.tweens.add({
                    targets: star,
                    alpha: 0.2,
                    duration: Phaser.Math.Between(1000, 3000),
                    yoyo: true,
                    repeat: -1
                });
            }
        }
    }
    
    /**
     * Crear logo del juego
     */
    createLogo() {
        const { width } = this.game.config;
        
        const logo = this.add.text(width / 2, 100, 'NEON\nINVADERS', {
            fontSize: '72px',
            fill: '#9333ea',
            fontFamily: 'Orbitron',
            fontStyle: 'bold',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);
        
        logo.setShadow(0, 0, '#9333ea', 20, true, true);
        
        // Animación de pulsación
        this.tweens.add({
            targets: logo,
            scale: 1.05,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        // Subtítulo
        this.add.text(width / 2, 200, 'A Modern Space Shooter', {
            fontSize: '20px',
            fill: '#a78bfa',
            fontFamily: 'Share Tech Mono'
        }).setOrigin(0.5);
    }
    
    /**
     * Crear menú
     */
    createMenu() {
        const { width, height } = this.game.config;
        const centerX = width / 2;
        const startY = height / 2;
        
        // Opciones del menú
        const options = [
            { text: 'PLAY', action: () => this.startGame() },
            { text: 'HIGH SCORES', action: () => this.showHighScores() },
            { text: 'CONTROLS', action: () => this.showControls() },
            { text: 'CREDITS', action: () => this.showCredits() }
        ];
        
        options.forEach((option, index) => {
            const y = startY + (index * 60);
            
            const button = this.add.text(centerX, y, option.text, {
                fontSize: '32px',
                fill: '#9333ea',
                fontFamily: 'Orbitron',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            button.setShadow(0, 0, '#9333ea', 10, false, true);
            
            // Hacer interactivo
            button.setInteractive({ useHandCursor: true });
            
            // Hover effect
            button.on('pointerover', () => {
                button.setScale(1.1);
                button.setFill('#3b82f6');
            });
            
            button.on('pointerout', () => {
                button.setScale(1);
                button.setFill('#9333ea');
            });
            
            // Click
            button.on('pointerdown', option.action);
        });
        
        // Texto parpadeante "Press SPACE to start"
        const pressSpace = this.add.text(centerX, height - 80, 'PRESS SPACE TO START', {
            fontSize: '24px',
            fill: '#3b82f6',
            fontFamily: 'Orbitron'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: pressSpace,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
    }
    
    /**
     * Mostrar high score actual
     */
    createHighScoreDisplay() {
        const { width, height } = this.game.config;
        
        // Cargar high score de localStorage
        const highScore = localStorage.getItem('neonInvadersHighScore') || '0';
        
        const text = this.add.text(width / 2, height / 2 - 80, `HIGH SCORE: ${highScore}`, {
            fontSize: '24px',
            fill: '#fbbf24',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        text.setShadow(0, 0, '#fbbf24', 10, true, true);
    }
    
    /**
     * Iniciar juego
     */
    startGame() {
        // Efecto de sonido (si está implementado)
        // this.sound.play('select');
        
        // Transición a GameScene
        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.scene.start('GameScene');
        });
    }
    
    /**
     * Mostrar tabla de high scores
     */
    showHighScores() {
        // TODO: Implementar pantalla de high scores
        console.log('High Scores - Coming soon!');
    }
    
    /**
     * Mostrar controles - VERSIÓN CORREGIDA
     */
    showControls() {
        const { width, height } = this.game.config;
        
        // ✅ CORRECCIÓN: Crear container para agrupar TODO
        const controlsContainer = this.add.container(0, 0);
        
        // Overlay de fondo
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.9);
        overlay.setOrigin(0);
        overlay.setInteractive();
        controlsContainer.add(overlay);
        
        // Título
        const title = this.add.text(width / 2, 80, 'CONTROLS', {
            fontSize: '48px',
            fill: '#9333ea',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        controlsContainer.add(title);
        
        // Controles PC
        const pcControls = [
            '← → Arrow Keys - Move',
            'SPACE - Fire',
            'ESC - Pause'
        ];
        
        pcControls.forEach((control, index) => {
            const text = this.add.text(width / 2, 180 + (index * 40), control, {
                fontSize: '24px',
                fill: '#a78bfa',
                fontFamily: 'Share Tech Mono'
            }).setOrigin(0.5);
            controlsContainer.add(text);
        });
        
        // Título móvil
        const mobileTitle = this.add.text(width / 2, 340, 'MOBILE', {
            fontSize: '32px',
            fill: '#3b82f6',
            fontFamily: 'Orbitron'
        }).setOrigin(0.5);
        controlsContainer.add(mobileTitle);
        
        // Controles móvil
        const mobileControls = [
            'Tap sides - Move',
            'Tap center - Fire'
        ];
        
        mobileControls.forEach((control, index) => {
            const text = this.add.text(width / 2, 400 + (index * 40), control, {
                fontSize: '24px',
                fill: '#a78bfa',
                fontFamily: 'Share Tech Mono'
            }).setOrigin(0.5);
            controlsContainer.add(text);
        });
        
        // Botón cerrar
        const closeButton = this.add.text(width / 2, height - 80, 'CLOSE', {
            fontSize: '28px',
            fill: '#9333ea',
            fontFamily: 'Orbitron'
        }).setOrigin(0.5);
        
        closeButton.setInteractive({ useHandCursor: true });
        
        // ✅ CORRECCIÓN: Al cerrar, destruir TODO el container
        closeButton.on('pointerdown', () => {
            controlsContainer.destroy(); // Destruye overlay + todos los textos
        });
        
        controlsContainer.add(closeButton);
    }
    
    /**
     * Mostrar créditos - VERSIÓN CORREGIDA
     */
    showCredits() {
        const { width, height } = this.game.config;
        
        // ✅ CORRECCIÓN: Crear container para agrupar TODO
        const creditsContainer = this.add.container(0, 0);
        
        // Overlay de fondo
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.9);
        overlay.setOrigin(0);
        overlay.setInteractive();
        creditsContainer.add(overlay);
        
        // Título
        const title = this.add.text(width / 2, 80, 'CREDITS', {
            fontSize: '48px',
            fill: '#9333ea',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        creditsContainer.add(title);
        
        // Créditos
        const credits = [
            'Game Design & Programming',
            'Arturo Bracamontes',
            '',
            'Built with',
            'Phaser 3.70.0',
            '',
            'Inspired by',
            'Space Invaders (1978)',
            '',
            '© 2026 - Portfolio Project'
        ];
        
        credits.forEach((line, index) => {
            const fontSize = line === '' ? '12px' : (index % 2 === 0 ? '20px' : '28px');
            const color = index % 2 === 0 ? '#a78bfa' : '#3b82f6';
            
            const text = this.add.text(width / 2, 160 + (index * 35), line, {
                fontSize: fontSize,
                fill: color,
                fontFamily: index % 2 === 0 ? 'Share Tech Mono' : 'Orbitron'
            }).setOrigin(0.5);
            
            creditsContainer.add(text);
        });
        
        // Botón cerrar
        const closeButton = this.add.text(width / 2, height - 80, 'CLOSE', {
            fontSize: '28px',
            fill: '#9333ea',
            fontFamily: 'Orbitron'
        }).setOrigin(0.5);
        
        closeButton.setInteractive({ useHandCursor: true });
        
        // ✅ CORRECCIÓN: Al cerrar, destruir TODO el container
        closeButton.on('pointerdown', () => {
            creditsContainer.destroy(); // Destruye overlay + todos los textos
        });
        
        creditsContainer.add(closeButton);
    }
}