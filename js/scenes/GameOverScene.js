/**
 * GAME OVER SCENE
 * VERSIÓN CON STATS EN LOS COSTADOS
 */

import { IS_MOBILE } from '../config.js';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    
    init(data) {
        this.finalScore = data.score || 0;
        this.highScore = data.highScore || 0;
        this.level = data.level || 1;
        this.stats = data.stats || {};
        this.isNewRecord = this.finalScore === this.highScore && this.finalScore > 0;
    }
    
    create() {
        const { width, height } = this.game.config;
        
        this.createBackground();
        this.createTitle();
        this.createStats();
        
        if (this.isNewRecord) {
            this.showNewRecord();
        }
        
        this.createBeautifulButtons();
        this.cameras.main.fadeIn(500);
    }
    
    createBackground() {
        const { width, height } = this.game.config;
        
        const bg = this.add.rectangle(0, 0, width, height, 0x0a0015);
        bg.setOrigin(0);
        bg.setScrollFactor(0);
        
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
    
    createTitle() {
        const { width } = this.game.config;
        
        const fontSize = IS_MOBILE ? '42px' : '72px';
        const yPosition = IS_MOBILE ? 50 : 80;
        
        const title = this.add.text(width / 2, yPosition, 'GAME OVER', {
            fontSize: fontSize,
            fill: '#ef4444',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        title.setShadow(0, 0, '#ef4444', IS_MOBILE ? 15 : 30, true, true);
        title.setScrollFactor(0);
        
        title.setScale(0);
        this.tweens.add({
            targets: title,
            scale: 1,
            duration: 500,
            ease: 'Back.easeOut'
        });
    }
    
    /**
     * ✅ CREAR STATS - AHORA EN LOS COSTADOS
     */
    createStats() {
        const { width, height } = this.game.config;
        const centerX = width / 2;
        const startY = IS_MOBILE ? 120 : 200;
        const spacing = IS_MOBILE ? 65 : 90;
        
        // Crear las 3 cajas principales (CENTRO)
        const scoreBox = this.createStatBox(centerX, startY, 'FINAL SCORE', this.finalScore.toString(), '#9333ea', true);
        const highScoreBox = this.createStatBox(centerX, startY + spacing, 'HIGH SCORE', this.highScore.toString(), '#fbbf24', false);
        const levelBox = this.createStatBox(centerX, startY + (spacing * 2), 'LEVEL REACHED', this.level.toString(), '#3b82f6', false);
        
        // ✅ STATS EN LOS COSTADOS (solo PC)
        if (!IS_MOBILE) {
            // Posición X para los costados
            const leftX = centerX - 280; // Izquierda
            const rightX = centerX + 280; // Derecha
            
            // Posición Y alineada con las cajas
            const topStatY = startY + 20;
            const bottomStatY = startY + spacing + 20;
            
            // LADO IZQUIERDO
            this.createSideStatVertical(leftX, topStatY, 'Aliens Killed', this.stats.kills || 0, '#10b981');
            this.createSideStatVertical(leftX, bottomStatY, 'Accuracy', `${this.stats.accuracy || 0}%`, '#3b82f6');
            
            // LADO DERECHO
            this.createSideStatVertical(rightX, topStatY, 'Power-Ups', this.stats.powerUps || 0, '#fbbf24');
            this.createSideStatVertical(rightX, bottomStatY, 'Best Streak', this.stats.consecutiveHits || 0, '#ec4899');
        }
        
        // Animación de entrada de las cajas
        [scoreBox, highScoreBox, levelBox].forEach((box, index) => {
            box.setAlpha(0);
            this.tweens.add({
                targets: box,
                alpha: 1,
                duration: 800,
                delay: 300 + (index * 150)
            });
        });
    }
    
    createStatBox(x, y, label, value, color, isBig) {
        const container = this.add.container(x, y);
        container.setScrollFactor(0);
        
        const boxWidth = IS_MOBILE ? 300 : 400;
        const boxHeight = isBig ? (IS_MOBILE ? 70 : 80) : (IS_MOBILE ? 55 : 60);
        
        const bg = this.add.rectangle(0, 0, boxWidth, boxHeight, 0x1a0033, 0.8);
        bg.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(color).color, 0.5);
        container.add(bg);
        
        const labelFontSize = isBig ? (IS_MOBILE ? '16px' : '18px') : (IS_MOBILE ? '12px' : '14px');
        const valueFontSize = isBig ? (IS_MOBILE ? '36px' : '42px') : (IS_MOBILE ? '24px' : '28px');
        const labelOffset = isBig ? (IS_MOBILE ? -18 : -20) : (IS_MOBILE ? -13 : -15);
        const valueOffset = isBig ? (IS_MOBILE ? 8 : 10) : (IS_MOBILE ? 6 : 8);
        
        const labelText = this.add.text(0, labelOffset, label, {
            fontSize: labelFontSize,
            fill: '#a78bfa',
            fontFamily: 'Share Tech Mono'
        }).setOrigin(0.5);
        container.add(labelText);
        
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
     * ✅ NUEVO: Crear stat lateral con diseño vertical
     */
    createSideStatVertical(x, y, label, value, color) {
        // Caja de fondo
        const bg = this.add.rectangle(x, y, 140, 70, 0x1a0033, 0.6);
        bg.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(color).color, 0.4);
        bg.setScrollFactor(0);
        
        // Label
        const labelText = this.add.text(x, y - 15, label, {
            fontSize: '13px',
            fill: '#a78bfa',
            fontFamily: 'Share Tech Mono'
        }).setOrigin(0.5);
        labelText.setScrollFactor(0);
        
        // Value
        const valueText = this.add.text(x, y + 10, value.toString(), {
            fontSize: '28px',
            fill: color,
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        valueText.setShadow(0, 0, color, 8, true, true);
        valueText.setScrollFactor(0);
        
        // Animación de entrada
        bg.setAlpha(0);
        labelText.setAlpha(0);
        valueText.setAlpha(0);
        
        this.tweens.add({
            targets: [bg, labelText, valueText],
            alpha: 1,
            duration: 800,
            delay: 800
        });
    }
    
    showNewRecord() {
        const { width, height } = this.game.config;
        
        const yPosition = IS_MOBILE ? height / 2 + 50 : height - 200;
        const fontSize = IS_MOBILE ? '18px' : '28px';
        
        const banner = this.add.text(width / 2, yPosition, '🏆 NEW RECORD! 🏆', {
            fontSize: fontSize,
            fill: '#fbbf24',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        banner.setShadow(0, 0, '#fbbf24', 20, true, true);
        banner.setScrollFactor(0);
        
        this.tweens.add({
            targets: banner,
            scale: 1.1,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        const particleCount = IS_MOBILE ? 6 : 15;
        
        for (let i = 0; i < particleCount; i++) {
            this.time.delayedCall(i * 100, () => {
                const x = Phaser.Math.Between(width * 0.3, width * 0.7);
                const particle = this.add.circle(x, yPosition, 5, 0xfbbf24);
                particle.setScrollFactor(0);
                
                this.tweens.add({
                    targets: particle,
                    y: particle.y - Phaser.Math.Between(50, 100),
                    x: particle.x + Phaser.Math.Between(-50, 50),
                    alpha: 0,
                    scale: 0,
                    duration: 1000,
                    onComplete: () => particle.destroy()
                });
            });
        }
    }
    
    createBeautifulButtons() {
        const { width, height } = this.game.config;
        const centerX = width / 2;
        const buttonsY = IS_MOBILE ? height - 90 : height - 130;
        const spacing = IS_MOBILE ? 110 : 130;
        
        // BOTÓN PLAY AGAIN
        const playBgDark = this.add.rectangle(centerX - spacing, buttonsY, IS_MOBILE ? 180 : 160, IS_MOBILE ? 60 : 55, 0x0d4d3d, 1);
        playBgDark.setScrollFactor(0);
        
        const playBg = this.add.rectangle(centerX - spacing, buttonsY - 2, IS_MOBILE ? 176 : 156, IS_MOBILE ? 56 : 51, 0x10b981, 1);
        playBg.setScrollFactor(0);
        playBg.setStrokeStyle(2, 0x6ee7b7, 0.8);
        playBg.setInteractive({ useHandCursor: true });
        
        const playText = this.add.text(centerX - spacing, buttonsY, 'PLAY AGAIN', {
            fontSize: IS_MOBILE ? '20px' : '22px',
            fill: '#ffffff',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        playText.setScrollFactor(0);
        playText.setShadow(2, 2, '#000000', 4, false, true);
        
        const playGlow = this.add.rectangle(centerX - spacing, buttonsY - 16, IS_MOBILE ? 160 : 140, 8, 0x6ee7b7, 0.4);
        playGlow.setScrollFactor(0);
        
        playBg.on('pointerdown', () => {
            playBg.setFillStyle(0x0d9668);
            playText.y = buttonsY + 2;
        });
        
        playBg.on('pointerup', () => {
            playBg.setFillStyle(0x10b981);
            playText.y = buttonsY;
            this.scene.start('GameScene');
        });
        
        playBg.on('pointerout', () => {
            playBg.setFillStyle(0x10b981);
            playText.y = buttonsY;
        });
        
        playBg.on('pointerover', () => {
            if (!IS_MOBILE) {
                playBg.setFillStyle(0x34d399);
            }
        });
        
        // BOTÓN MENU
        const menuBgDark = this.add.rectangle(centerX + spacing, buttonsY, IS_MOBILE ? 140 : 120, IS_MOBILE ? 60 : 55, 0x3d1d5c, 1);
        menuBgDark.setScrollFactor(0);
        
        const menuBg = this.add.rectangle(centerX + spacing, buttonsY - 2, IS_MOBILE ? 136 : 116, IS_MOBILE ? 56 : 51, 0x9333ea, 1);
        menuBg.setScrollFactor(0);
        menuBg.setStrokeStyle(2, 0xc084fc, 0.8);
        menuBg.setInteractive({ useHandCursor: true });
        
        const menuText = this.add.text(centerX + spacing, buttonsY, 'MENU', {
            fontSize: IS_MOBILE ? '20px' : '22px',
            fill: '#ffffff',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        menuText.setScrollFactor(0);
        menuText.setShadow(2, 2, '#000000', 4, false, true);
        
        const menuGlow = this.add.rectangle(centerX + spacing, buttonsY - 16, IS_MOBILE ? 120 : 100, 8, 0xc084fc, 0.4);
        menuGlow.setScrollFactor(0);
        
        menuBg.on('pointerdown', () => {
            menuBg.setFillStyle(0x7c28c9);
            menuText.y = buttonsY + 2;
        });
        
        menuBg.on('pointerup', () => {
            menuBg.setFillStyle(0x9333ea);
            menuText.y = buttonsY;
            this.scene.start('MenuScene');
        });
        
        menuBg.on('pointerout', () => {
            menuBg.setFillStyle(0x9333ea);
            menuText.y = buttonsY;
        });
        
        menuBg.on('pointerover', () => {
            if (!IS_MOBILE) {
                menuBg.setFillStyle(0xa855f7);
            }
        });
        
        // INSTRUCCIÓN
        const instructionY = IS_MOBILE ? height - 30 : height - 45;
        const instructionFontSize = IS_MOBILE ? '13px' : '15px';
        
        const instruction = this.add.text(centerX, instructionY, 'Tap any button to continue', {
            fontSize: instructionFontSize,
            fill: '#6366f1',
            fontFamily: 'Share Tech Mono'
        }).setOrigin(0.5);
        instruction.setScrollFactor(0);
        
        this.tweens.add({
            targets: instruction,
            alpha: 0.4,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        
        // ANIMACIÓN DE ENTRADA DE BOTONES
        const allButtonElements = [playBgDark, playBg, playText, playGlow, menuBgDark, menuBg, menuText, menuGlow];
        
        allButtonElements.forEach((element, index) => {
            element.setAlpha(0);
            element.y += 30;
            
            this.tweens.add({
                targets: element,
                alpha: 1,
                y: element.y - 30,
                duration: 400,
                delay: 1000 + (Math.floor(index / 4) * 150),
                ease: 'Back.easeOut'
            });
        });
        
        // TECLADO (SOLO PC)
        if (!IS_MOBILE) {
            this.input.keyboard.once('keydown-SPACE', () => {
                this.scene.start('GameScene');
            });
            
            this.input.keyboard.once('keydown-ESC', () => {
                this.scene.start('MenuScene');
            });
        }
    }
}
