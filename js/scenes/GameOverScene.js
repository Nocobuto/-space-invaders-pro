/**
 * GAME OVER SCENE
 * 
 * Pantalla que se muestra al terminar el juego
 * Muestra estadísticas, logros y opciones
 */

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
        
        // Efecto de partículas cayendo
        for (let i = 0; i < 50; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(-height, 0);
            const size = Phaser.Math.Between(1, 3);
            
            const particle = this.add.circle(x, y, size, 0xef4444, 0.5);
            
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
        
        const title = this.add.text(width / 2, 80, 'GAME OVER', {
            fontSize: '72px',
            fill: '#ef4444',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        title.setShadow(0, 0, '#ef4444', 30, true, true);
        
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
        const startY = 180;
        
        // Contenedor de estadísticas
        const statsContainer = this.add.container(centerX, startY);
        
        // Score principal
        const scoreBox = this.createStatBox(
            0, 0,
            'FINAL SCORE',
            this.finalScore.toString(),
            '#9333ea',
            true
        );
        statsContainer.add(scoreBox);
        
        // High Score
        const highScoreBox = this.createStatBox(
            0, 100,
            'HIGH SCORE',
            this.highScore.toString(),
            '#fbbf24',
            false
        );
        statsContainer.add(highScoreBox);
        
        // Level alcanzado
        const levelBox = this.createStatBox(
            0, 180,
            'LEVEL REACHED',
            this.level.toString(),
            '#3b82f6',
            false
        );
        statsContainer.add(levelBox);
        
        // Estadísticas adicionales (dos columnas)
        const leftCol = -150;
        const rightCol = 150;
        const statsY = 260;
        
        // Columna izquierda
        this.createSmallStat(statsContainer, leftCol, statsY, 'Aliens Killed', this.stats.kills || 0);
        this.createSmallStat(statsContainer, leftCol, statsY + 40, 'Accuracy', `${this.stats.accuracy || 0}%`);
        
        // Columna derecha
        this.createSmallStat(statsContainer, rightCol, statsY, 'Power-Ups', this.stats.powerUps || 0);
        this.createSmallStat(statsContainer, rightCol, statsY + 40, 'Best Combo', '0'); // TODO: Implementar combo
        
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
        
        // Fondo
        const bg = this.add.rectangle(0, 0, 400, isBig ? 80 : 60, 0x1a0033, 0.8);
        bg.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(color).color, 0.5);
        container.add(bg);
        
        // Label
        const labelText = this.add.text(0, isBig ? -20 : -15, label, {
            fontSize: isBig ? '18px' : '14px',
            fill: '#a78bfa',
            fontFamily: 'Share Tech Mono'
        }).setOrigin(0.5);
        container.add(labelText);
        
        // Value
        const valueText = this.add.text(0, isBig ? 10 : 8, value, {
            fontSize: isBig ? '42px' : '28px',
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
        const labelText = this.add.text(x, y, label, {
            fontSize: '14px',
            fill: '#6366f1',
            fontFamily: 'Share Tech Mono'
        }).setOrigin(0.5);
        
        const valueText = this.add.text(x, y + 20, value.toString(), {
            fontSize: '20px',
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
        
        // Banner de nuevo récord
        const banner = this.add.text(width / 2, height / 2 + 180, '🏆 NEW HIGH SCORE! 🏆', {
            fontSize: '32px',
            fill: '#fbbf24',
            fontFamily: 'Orbitron',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        banner.setShadow(0, 0, '#fbbf24', 20, true, true);
        
        // Animación de pulsación
        this.tweens.add({
            targets: banner,
            scale: 1.1,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        // Partículas de celebración
        for (let i = 0; i < 20; i++) {
            this.time.delayedCall(i * 100, () => {
                const x = Phaser.Math.Between(width * 0.3, width * 0.7);
                const particle = this.add.circle(x, height / 2 + 180, 5, 0xfbbf24);
                
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
     * Crear botones
     */
    createButtons() {
        const { width, height } = this.game.config;
        const centerX = width / 2;
        const buttonsY = height - 150;
        
        // Botón PLAY AGAIN
        const playButton = this.createButton(
            centerX - 120,
            buttonsY,
            'PLAY AGAIN',
            '#10b981',
            () => this.playAgain()
        );
        
        // Botón MENU
        const menuButton = this.createButton(
            centerX + 120,
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
        
        // Instrucción de teclado
        const instruction = this.add.text(centerX, height - 60, 'Press SPACE to play again', {
            fontSize: '16px',
            fill: '#6366f1',
            fontFamily: 'Share Tech Mono'
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: instruction,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        
        // Controles de teclado
        this.input.keyboard.once('keydown-SPACE', () => this.playAgain());
        this.input.keyboard.once('keydown-ESC', () => this.returnToMenu());
    }
    
    /**
     * Crear botón
     */
    createButton(x, y, text, color, callback) {
        const button = this.add.text(x, y, text, {
            fontSize: '24px',
            fill: color,
            fontFamily: 'Orbitron',
            fontStyle: 'bold',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);
        
        button.setShadow(0, 0, color, 10, false, true);
        
        // Fondo del botón
        const bg = this.add.rectangle(x, y, button.width + 40, button.height + 20, 0x1a0033, 0.8);
        bg.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(color).color, 0.5);
        bg.setOrigin(0.5);
        
        // Hacer interactivo
        bg.setInteractive({ useHandCursor: true });
        
        // Hover effects
        bg.on('pointerover', () => {
            this.tweens.add({
                targets: [bg, button],
                scale: 1.1,
                duration: 200
            });
        });
        
        bg.on('pointerout', () => {
            this.tweens.add({
                targets: [bg, button],
                scale: 1,
                duration: 200
            });
        });
        
        bg.on('pointerdown', callback);
        
        // Crear container para agrupar
        const container = this.add.container(0, 0);
        container.add([bg, button]);
        
        return container;
    }
    
    /**
     * Jugar de nuevo
     */
    playAgain() {
        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.scene.start('GameScene');
        });
    }
    
    /**
     * Volver al menú
     */
    returnToMenu() {
        this.cameras.main.fadeOut(500);
        this.time.delayedCall(500, () => {
            this.scene.start('MenuScene');
        });
    }
}