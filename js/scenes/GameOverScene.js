/**
 * GAME OVER SCENE
 * 
 * Pantalla que se muestra al terminar el juego
 * Muestra estadísticas, logros y opciones
 * 
 * ✅ VERSIÓN OPTIMIZADA PARA MÓVIL CON FIX DE BOTONES
 */

import { IS_MOBILE } from '../config.js';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    
    init(data) {
        // Recibir datos del juego
        this.finalScore = data.score || 0;
        this.highScore = data.highScore || 0;
        this.level = data.level || 1;
        this.stats = data.stats || {};
        this.isNewRecord = this.finalScore === this.highScore && this.finalScore > 0;
    }
    
    create() {
        const { width, height } = this.game.config;
        
        // Fondo oscuro animado
        this.createBackground();
        
        // Título GAME OVER
        this.createTitle();
        
        // Estadísticas del juego
        this.createStats();
        
        // Nuevo récord (si aplica)
        if (this.isNewRecord) {
            this.showNewRecord();
        }
        
        // Botones de opciones
        this.createButtons();
        
        // Fade in
        this.cameras.main.fadeIn(500);
    }
    
    /**
     * Crear fondo animado
     */
    createBackground() {
        const { width, height } = this.game.config;
        
        // Fondo base
        const bg = this.add.rectangle(0, 0, width, height, 0x0a0015);
        bg.setOrigin(0);
        bg.setScrollFactor(0);
        
        // Menos partículas para mejor rendimiento en móvil
        const particleCount = IS_MOBILE ? 25 : 50;
        
        for (let i = 0; i < particleCount; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(-height, 0);
            const size = Phaser.Math.Between(1, 3);
            
            const particle = this.add.circle(x, y, size, 0xef4444, 0.5);
            particle.setScrollFactor(0);
            
            this.tweens.add({
                targets: particle,
                y: height + 10,
                duration: Phaser.Math.Between(3000, 8000),
                repeat: -1,
                delay: Phaser.Math.Between(0, 5000),
                onRepeat: () => {
                    particle.y = -10;
                    particle.x = Phaser.Math.Between(0, width);
                }
            });
        }
    }
    
    /**
     * Crear título
     */
    createTitle() {
        const { width } = this.game.config;
        
        const fontSize = IS_MOBILE ? '48px' : '72px';
        const yPosition = IS_MOBILE ? 60 : 80;
        
        const title = this.add.text(width / 2, yPosition, 'GAME OVER', {
            fontSize: fontSize,
            fill: '#ef4444',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        title.setShadow(0, 0, '#ef4444', IS_MOBILE ? 15 : 30, true, true);
        title.setScrollFactor(0);
        
        // Animación de entrada
        title.setScale(0);
        this.tweens.add({
            targets: title,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });
    }
    
    /**
     * Crear estadísticas
     */
    createStats() {
        const { width, height } = this.game.config;
        const centerX = width / 2;
        const startY = IS_MOBILE ? 130 : 180;
        
        // Contenedor de estadísticas
        const statsContainer = this.add.container(centerX, startY);
        statsContainer.setScrollFactor(0);
        
        // Score principal
        const scoreBox = this.createStatBox(
            0, 0,
            'FINAL SCORE',
            this.finalScore.toString(),
            '#9333ea',
            true
        );
        statsContainer.add(scoreBox);
        
        const spacing = IS_MOBILE ? 70 : 100;
        
        // High Score
        const highScoreBox = this.createStatBox(
            0, spacing,
            'HIGH SCORE',
            this.highScore.toString(),
            '#fbbf24',
            false
        );
        statsContainer.add(highScoreBox);
        
        // Level alcanzado
        const levelBox = this.createStatBox(
            0, spacing * 2,
            'LEVEL REACHED',
            this.level.toString(),
            '#3b82f6',
            false
        );
        statsContainer.add(levelBox);
        
        // Mostrar stats adicionales solo si hay espacio
        if (!IS_MOBILE || height > 600) {
            const leftCol = IS_MOBILE ? -100 : -150;
            const rightCol = IS_MOBILE ? 100 : 150;
            const statsY = spacing * 2 + 70;
            
            // Columna izquierda
            this.createSmallStat(statsContainer, leftCol, statsY, 'Aliens Killed', this.stats.kills || 0);
            this.createSmallStat(statsContainer, leftCol, statsY + 40, 'Accuracy', `${this.stats.accuracy || 0}%`);
            
            // Columna derecha
            this.createSmallStat(statsContainer, rightCol, statsY, 'Power-Ups', this.stats.powerUps || 0);
            this.createSmallStat(statsContainer, rightCol, statsY + 40, 'Score', this.finalScore);
        }
        
        // Animación de entrada
        statsContainer.setAlpha(0);
        this.tweens.add({
            targets: statsContainer,
            alpha: 1,
            duration: 800,
            delay: 300
        });
    }
    
    /**
     * Crear caja de estadística
     */
    createStatBox(x, y, label, value, color, isBig) {
        const container = this.add.container(x, y);
        
        const boxWidth = IS_MOBILE ? 300 : 400;
        const boxHeight = isBig ? (IS_MOBILE ? 70 : 80) : (IS_MOBILE ? 55 : 60);
        
        // Fondo
        const bg = this.add.rectangle(0, 0, boxWidth, boxHeight, 0x1a0033, 0.8);
        bg.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(color).color, 0.5);
        container.add(bg);
        
        const labelFontSize = isBig ? (IS_MOBILE ? '16px' : '18px') : (IS_MOBILE ? '12px' : '14px');
        const valueFontSize = isBig ? (IS_MOBILE ? '36px' : '42px') : (IS_MOBILE ? '24px' : '28px');
        const labelOffset = isBig ? (IS_MOBILE ? -18 : -20) : (IS_MOBILE ? -13 : -15);
        const valueOffset = isBig ? (IS_MOBILE ? 8 : 10) : (IS_MOBILE ? 6 : 8);
        
        // Label
        const labelText = this.add.text(0, labelOffset, label, {
            fontSize: labelFontSize,
            fill: '#a78bfa',
            fontFamily: 'Share Tech Mono'
        }).setOrigin(0.5);
        container.add(labelText);
        
        // Value
        const valueText = this.add.text(0, valueOffset, value, {
            fontSize: valueFontSize,
            fill: color,
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        valueText.setShadow(0, 0, color, 10, true, true);
        container.add(valueText);
        
        return container;
    }
    
    /**
     * Crear estadística pequeña
     */
    createSmallStat(container, x, y, label, value) {
        const labelFontSize = IS_MOBILE ? '12px' : '14px';
        const valueFontSize = IS_MOBILE ? '16px' : '20px';
        
        const labelText = this.add.text(x, y, label, {
            fontSize: labelFontSize,
            fill: '#6366f1',
            fontFamily: 'Share Tech Mono'
        }).setOrigin(0.5);
        
        const valueText = this.add.text(x, y + 20, value.toString(), {
            fontSize: valueFontSize,
            fill: '#a78bfa',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        container.add([labelText, valueText]);
    }
    
    /**
     * Mostrar nuevo récord
     */
    showNewRecord() {
        const { width, height } = this.game.config;
        
        const yPosition = IS_MOBILE ? height / 2 + 130 : height / 2 + 180;
        const fontSize = IS_MOBILE ? '20px' : '32px';
        
        // Banner de nuevo récord
        const banner = this.add.text(width / 2, yPosition, '🏆 NEW HIGH SCORE! 🏆', {
            fontSize: fontSize,
            fill: '#fbbf24',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        banner.setShadow(0, 0, '#fbbf24', 20, true, true);
        banner.setScrollFactor(0);
        
        // Animación de pulsación
        this.tweens.add({
            targets: banner,
            scale: 1.1,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        // Menos partículas de celebración en móvil
        const particleCount = IS_MOBILE ? 10 : 20;
        
        for (let i = 0; i < particleCount; i++) {
            this.time.delayedCall(i * 100, () => {
                const x = Phaser.Math.Between(width * 0.3, width * 0.7);
                const particle = this.add.circle(x, yPosition, 5, 0xfbbf24);
                particle.setScrollFactor(0);
                
                this.tweens.add({
                    targets: particle,
                    y: particle.y - Phaser.Math.Between(50, 150),
                    x: particle.x + Phaser.Math.Between(-50, 50),
                    alpha: 0,
                    scale: 0,
                    duration: 1000,
                    onComplete: () => particle.destroy()
                });
            });
        }
    }
    
    /**
     * Crear botones - ✅ FIX COMPLETO PARA MÓVIL
     */
    createButtons() {
        const { width, height } = this.game.config;
        const centerX = width / 2;
        
        const buttonsY = IS_MOBILE ? height - 120 : height - 150;
        const buttonSpacing = IS_MOBILE ? 100 : 120;
        
        // Botón PLAY AGAIN
        const playButton = this.createButton(
            centerX - buttonSpacing,
            buttonsY,
            'PLAY AGAIN',
            '#10b981',
            () => this.playAgain()
        );
        
        // Botón MENU
        const menuButton = this.createButton(
            centerX + buttonSpacing,
            buttonsY,
            'MENU',
            '#9333ea',
            () => this.returnToMenu()
        );
        
        // Animación de entrada
        [playButton, menuButton].forEach((btn, index) => {
            btn.setAlpha(0);
            btn.setY(btn.y + 50);
            
            this.tweens.add({
                targets: btn,
                alpha: 1,
                y: buttonsY,
                duration: 500,
                delay: 1000 + (index * 200),
                ease: 'Back.easeOut'
            });
        });
        
        // Instrucción
        const instructionY = IS_MOBILE ? height - 50 : height - 60;
        const instructionFontSize = IS_MOBILE ? '12px' : '16px';
        
        const instruction = this.add.text(centerX, instructionY, 'Tap buttons above to continue', {
            fontSize: instructionFontSize,
            fill: '#6366f1',
            fontFamily: 'Share Tech Mono'
        }).setOrigin(0.5);
        instruction.setScrollFactor(0);
        
        this.tweens.add({
            targets: instruction,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        
        // Controles de teclado (solo PC)
        if (!IS_MOBILE) {
            this.input.keyboard.once('keydown-SPACE', () => this.playAgain());
            this.input.keyboard.once('keydown-ESC', () => this.returnToMenu());
        }
    }
    
    /**
     * Crear botón - ✅ COMPLETAMENTE CORREGIDO PARA MÓVIL
     */
    createButton(x, y, text, color, callback) {
        const fontSize = IS_MOBILE ? '20px' : '24px';
        const padding = IS_MOBILE ? { x: 15, y: 8 } : { x: 20, y: 10 };
        
        const button = this.add.text(x, y, text, {
            fontSize: fontSize,
            fill: color,
            fontFamily: 'Orbitron',
            fontStyle: 'bold',
            padding: padding
        }).setOrigin(0.5);
        
        button.setShadow(0, 0, color, 10, false, true);
        button.setScrollFactor(0);
        
        // ✅ MÓVIL: Área de toque MUY grande
        const bgWidth = button.width + (IS_MOBILE ? 60 : 40);
        const bgHeight = button.height + (IS_MOBILE ? 40 : 20);
        
        // Fondo del botón
        const bg = this.add.rectangle(x, y, bgWidth, bgHeight, 0x1a0033, 0.8);
        bg.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(color).color, 0.5);
        bg.setOrigin(0.5);
        bg.setScrollFactor(0);
        
        // Hacer interactivo
        bg.setInteractive({ useHandCursor: true });
        
        // ✅ FIX CRÍTICO: Variable para evitar múltiples activaciones
        let isProcessing = false;
        
        // ✅ FIX: Callback INMEDIATO en pointerup
        bg.on('pointerdown', () => {
            if (isProcessing) return;
            bg.setAlpha(0.6);
            button.setScale(0.95);
        });
        
        bg.on('pointerup', () => {
            if (isProcessing) return;
            isProcessing = true;
            
            bg.setAlpha(1);
            button.setScale(1);
            
            // ✅ FIX: Ejecutar callback INMEDIATAMENTE
            this.time.delayedCall(50, () => {
                callback();
            });
        });
        
        bg.on('pointerout', () => {
            bg.setAlpha(1);
            button.setScale(1);
        });
        
        // Hover solo en PC
        bg.on('pointerover', () => {
            if (!IS_MOBILE && !isProcessing) {
                this.tweens.add({
                    targets: [bg, button],
                    scale: 1.1,
                    duration: 200
                });
            }
        });
        
        // ✅ ALTERNATIVA MÓVIL: También hacer el texto interactivo
        if (IS_MOBILE) {
            button.setInteractive({ useHandCursor: true });
            
            button.on('pointerdown', () => {
                if (isProcessing) return;
                button.setScale(0.95);
            });
            
            button.on('pointerup', () => {
                if (isProcessing) return;
                isProcessing = true;
                
                button.setScale(1);
                
                this.time.delayedCall(50, () => {
                    callback();
                });
            });
        }
        
        // Crear container para agrupar
        const container = this.add.container(0, 0);
        container.add([bg, button]);
        container.setScrollFactor(0);
        
        return container;
    }
    
    /**
     * Jugar de nuevo
     */
    playAgain() {
        // Evitar múltiples activaciones
        if (this.scene.isActive('GameScene')) return;
        
        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.scene.start('GameScene');
        });
    }
    
    /**
     * Volver al menú
     */
    returnToMenu() {
        // Evitar múltiples activaciones
        if (this.scene.isActive('MenuScene')) return;
        
        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.scene.start('MenuScene');
        });
    }
}