/**
 * MENÚ PRINCIPAL
 * 
 * Primera escena que ve el jugador
 * Opciones: Play, High Scores, Controls, Credits
 * 
 * ✅ VERSIÓN OPTIMIZADA PARA MÓVIL
 */

import { GAME_CONFIG, IS_MOBILE } from '../config.js';

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
        const versionFontSize = IS_MOBILE ? '10px' : '12px';
        const versionY = IS_MOBILE ? height - 15 : height - 20;
        
        this.add.text(width / 2, versionY, 'v1.0.0 - Made by Arturo Bracamontes', {
            fontSize: versionFontSize,
            fill: '#6366f1',
            fontFamily: 'Share Tech Mono'
        }).setOrigin(0.5).setScrollFactor(0);
        
        // Controles de teclado (solo PC)
        if (!IS_MOBILE) {
            this.input.keyboard.once('keydown-SPACE', () => {
                this.startGame();
            });
        }
    }
    
    /**
     * Crear campo de estrellas - ✅ OPTIMIZADO PARA MÓVIL
     */
    createStarfield() {
        const { width, height } = this.game.config;
        
        // ✅ MÓVIL: Menos capas y estrellas para mejor rendimiento
        const layers = IS_MOBILE ? 2 : 3;
        const starsPerLayer = IS_MOBILE ? 20 : 30;
        
        for (let layer = 0; layer < layers; layer++) {
            const speed = (layer + 1) * 20;
            
            for (let i = 0; i < starsPerLayer; i++) {
                const x = Phaser.Math.Between(0, width);
                const y = Phaser.Math.Between(0, height);
                const size = Phaser.Math.Between(1, 3);
                
                const star = this.add.circle(x, y, size, 0xffffff, 0.8);
                star.setScrollFactor(0);
                
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
     * Crear logo del juego - ✅ RESPONSIVE
     */
    createLogo() {
        const { width } = this.game.config;
        
        // ✅ MÓVIL: Tamaño y posición adaptativos
        const fontSize = IS_MOBILE ? '48px' : '72px';
        const yPosition = IS_MOBILE ? 70 : 100;
        const lineSpacing = IS_MOBILE ? 5 : 10;
        
        const logo = this.add.text(width / 2, yPosition, 'NEON\nINVADERS', {
            fontSize: fontSize,
            fill: '#9333ea',
            fontFamily: 'Orbitron',
            fontStyle: 'bold',
            align: 'center',
            lineSpacing: lineSpacing
        }).setOrigin(0.5);
        
        logo.setShadow(0, 0, '#9333ea', IS_MOBILE ? 15 : 20, true, true);
        logo.setScrollFactor(0);
        
        // Animación de pulsación
        this.tweens.add({
            targets: logo,
            scale: 1.05,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        // Subtítulo
        const subtitleFontSize = IS_MOBILE ? '14px' : '20px';
        const subtitleY = IS_MOBILE ? 145 : 200;
        
        this.add.text(width / 2, subtitleY, 'A Modern Space Shooter', {
            fontSize: subtitleFontSize,
            fill: '#a78bfa',
            fontFamily: 'Share Tech Mono'
        }).setOrigin(0.5).setScrollFactor(0);
    }
    
    /**
     * Crear menú - ✅ COMPLETAMENTE REDISEÑADO PARA MÓVIL
     */
    createMenu() {
        const { width, height } = this.game.config;
        const centerX = width / 2;
        
        // ✅ MÓVIL: Posición y espaciado adaptativos
        const startY = IS_MOBILE ? height / 2 + 20 : height / 2;
        const spacing = IS_MOBILE ? 50 : 60;
        const fontSize = IS_MOBILE ? '24px' : '32px';
        
        // Opciones del menú
        const options = [
            { text: 'PLAY', action: () => this.startGame() },
            { text: 'HIGH SCORES', action: () => this.showHighScores() },
            { text: 'CONTROLS', action: () => this.showControls() },
            { text: 'CREDITS', action: () => this.showCredits() }
        ];
        
        options.forEach((option, index) => {
            const y = startY + (index * spacing);
            
            const button = this.add.text(centerX, y, option.text, {
                fontSize: fontSize,
                fill: '#9333ea',
                fontFamily: 'Orbitron',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            button.setShadow(0, 0, '#9333ea', 10, false, true);
            button.setScrollFactor(0);
            
            // Hacer interactivo
            button.setInteractive({ useHandCursor: true });
            
            // ✅ MÓVIL: Eventos touch mejorados
            button.on('pointerdown', () => {
                button.setScale(0.95);
                button.setFill('#3b82f6');
            });
            
            button.on('pointerup', () => {
                button.setScale(1);
                button.setFill('#9333ea');
                // Pequeño delay para feedback visual
                this.time.delayedCall(100, option.action);
            });
            
            button.on('pointerover', () => {
                if (!IS_MOBILE) {
                    button.setScale(1.1);
                    button.setFill('#3b82f6');
                }
            });
            
            button.on('pointerout', () => {
                button.setScale(1);
                button.setFill('#9333ea');
            });
        });
        
        // ✅ MÓVIL: Texto adaptativo
        const instructionText = IS_MOBILE ? 'TAP TO START' : 'PRESS SPACE TO START';
        const instructionFontSize = IS_MOBILE ? '18px' : '24px';
        const instructionY = IS_MOBILE ? height - 60 : height - 80;
        
        const pressSpace = this.add.text(centerX, instructionY, instructionText, {
            fontSize: instructionFontSize,
            fill: '#3b82f6',
            fontFamily: 'Orbitron'
        }).setOrigin(0.5);
        pressSpace.setScrollFactor(0);
        
        this.tweens.add({
            targets: pressSpace,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
    }
    
    /**
     * Mostrar high score actual - ✅ RESPONSIVE
     */
    createHighScoreDisplay() {
        const { width, height } = this.game.config;
        
        // Cargar high score de localStorage
        const highScore = localStorage.getItem('neonInvadersHighScore') || '0';
        
        // ✅ MÓVIL: Posición y tamaño adaptativos
        const fontSize = IS_MOBILE ? '18px' : '24px';
        const yPosition = IS_MOBILE ? height / 2 - 40 : height / 2 - 80;
        
        const text = this.add.text(width / 2, yPosition, `HIGH SCORE: ${highScore}`, {
            fontSize: fontSize,
            fill: '#fbbf24',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        text.setShadow(0, 0, '#fbbf24', 10, true, true);
        text.setScrollFactor(0);
    }
    
    /**
     * Iniciar juego
     */
    startGame() {
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
     * Mostrar controles - ✅ OPTIMIZADO PARA MÓVIL
     */
    showControls() {
        const { width, height } = this.game.config;
        
        // Crear container para agrupar TODO
        const controlsContainer = this.add.container(0, 0);
        
        // Overlay de fondo
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.9);
        overlay.setOrigin(0);
        overlay.setInteractive();
        controlsContainer.add(overlay);
        
        // ✅ MÓVIL: Título adaptativo
        const titleFontSize = IS_MOBILE ? '36px' : '48px';
        const titleY = IS_MOBILE ? 50 : 80;
        
        const title = this.add.text(width / 2, titleY, 'CONTROLS', {
            fontSize: titleFontSize,
            fill: '#9333ea',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        controlsContainer.add(title);
        
        // ✅ MÓVIL: Contenido adaptativo
        if (IS_MOBILE) {
            // Solo mostrar controles móviles
            const mobileY = 130;
            const spacing = 35;
            const fontSize = '18px';
            
            const mobileTitle = this.add.text(width / 2, mobileY, 'TOUCH CONTROLS', {
                fontSize: '24px',
                fill: '#3b82f6',
                fontFamily: 'Orbitron'
            }).setOrigin(0.5);
            controlsContainer.add(mobileTitle);
            
            const mobileControls = [
                '← → Buttons - Move Left/Right',
                '🔥 Center Button - Fire',
                'Tap RESUME - Unpause'
            ];
            
            mobileControls.forEach((control, index) => {
                const text = this.add.text(width / 2, mobileY + 50 + (index * spacing), control, {
                    fontSize: fontSize,
                    fill: '#a78bfa',
                    fontFamily: 'Share Tech Mono',
                    align: 'center'
                }).setOrigin(0.5);
                controlsContainer.add(text);
            });
        } else {
            // Mostrar controles PC y móvil
            const pcY = 150;
            
            // Controles PC
            const pcControls = [
                '← → Arrow Keys - Move',
                'SPACE - Fire',
                'ESC - Pause'
            ];
            
            pcControls.forEach((control, index) => {
                const text = this.add.text(width / 2, pcY + (index * 40), control, {
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
        }
        
        // ✅ MÓVIL: Botón cerrar adaptativo
        const closeFontSize = IS_MOBILE ? '24px' : '28px';
        const closeY = IS_MOBILE ? height - 60 : height - 80;
        
        const closeButton = this.add.text(width / 2, closeY, 'CLOSE', {
            fontSize: closeFontSize,
            fill: '#9333ea',
            fontFamily: 'Orbitron'
        }).setOrigin(0.5);
        
        closeButton.setInteractive({ useHandCursor: true });
        
        // ✅ MÓVIL: Mejor feedback táctil
        closeButton.on('pointerdown', () => {
            closeButton.setScale(0.95);
        });
        
        closeButton.on('pointerup', () => {
            closeButton.setScale(1);
            controlsContainer.destroy();
        });
        
        closeButton.on('pointerover', () => {
            if (!IS_MOBILE) {
                closeButton.setScale(1.1);
            }
        });
        
        closeButton.on('pointerout', () => {
            closeButton.setScale(1);
        });
        
        controlsContainer.add(closeButton);
    }
    
    /**
     * Mostrar créditos - ✅ OPTIMIZADO PARA MÓVIL
     */
    showCredits() {
        const { width, height } = this.game.config;
        
        // Crear container para agrupar TODO
        const creditsContainer = this.add.container(0, 0);
        
        // Overlay de fondo
        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.9);
        overlay.setOrigin(0);
        overlay.setInteractive();
        creditsContainer.add(overlay);
        
        // ✅ MÓVIL: Título adaptativo
        const titleFontSize = IS_MOBILE ? '36px' : '48px';
        const titleY = IS_MOBILE ? 50 : 80;
        
        const title = this.add.text(width / 2, titleY, 'CREDITS', {
            fontSize: titleFontSize,
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
        
        // ✅ MÓVIL: Tamaños y espaciado adaptativos
        const startY = IS_MOBILE ? 120 : 160;
        const lineSpacing = IS_MOBILE ? 28 : 35;
        
        credits.forEach((line, index) => {
            if (line === '') return; // Saltar líneas vacías
            
            // ✅ MÓVIL: Fuentes más pequeñas
            const isLabel = index % 2 === 0;
            const fontSize = IS_MOBILE 
                ? (isLabel ? '14px' : '20px')
                : (isLabel ? '20px' : '28px');
            const color = isLabel ? '#a78bfa' : '#3b82f6';
            const fontFamily = isLabel ? 'Share Tech Mono' : 'Orbitron';
            
            const text = this.add.text(width / 2, startY + (index * lineSpacing), line, {
                fontSize: fontSize,
                fill: color,
                fontFamily: fontFamily
            }).setOrigin(0.5);
            
            creditsContainer.add(text);
        });
        
        // ✅ MÓVIL: Botón cerrar adaptativo
        const closeFontSize = IS_MOBILE ? '24px' : '28px';
        const closeY = IS_MOBILE ? height - 60 : height - 80;
        
        const closeButton = this.add.text(width / 2, closeY, 'CLOSE', {
            fontSize: closeFontSize,
            fill: '#9333ea',
            fontFamily: 'Orbitron'
        }).setOrigin(0.5);
        
        closeButton.setInteractive({ useHandCursor: true });
        
        // ✅ MÓVIL: Mejor feedback táctil
        closeButton.on('pointerdown', () => {
            closeButton.setScale(0.95);
        });
        
        closeButton.on('pointerup', () => {
            closeButton.setScale(1);
            creditsContainer.destroy();
        });
        
        closeButton.on('pointerover', () => {
            if (!IS_MOBILE) {
                closeButton.setScale(1.1);
            }
        });
        
        closeButton.on('pointerout', () => {
            closeButton.setScale(1);
        });
        
        creditsContainer.add(closeButton);
    }
}