/**
 * CLASE POWERUP
 * 
 * Representa un power-up que cae del cielo cuando destruyes aliens
 */

import { GAME_CONFIG } from '../config.js';

export class PowerUp {
    constructor(scene, x, y, type) {
        this.scene = scene;
        this.type = type;
        
        // Obtener configuración del power-up
        const config = GAME_CONFIG.powerups.types[type];
        
        // Crear sprite
        this.sprite = scene.physics.add.sprite(x, y, 'powerup');
        this.sprite.setTint(config.color);
        
        // Física: caer lentamente
        this.sprite.setVelocityY(50);
        
        // Animación de rotación y pulsación
        this.createAnimations();
        
        // Referencia para saber si fue recogido
        this.isCollected = false;
    }
    
    /**
     * Crear animaciones
     */
    createAnimations() {
        // Rotación continua
        this.scene.tweens.add({
            targets: this.sprite,
            angle: 360,
            duration: 2000,
            repeat: -1
        });
        
        // Pulsación de escala
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }
    
    /**
     * Recoger power-up
     */
    collect() {
        if (this.isCollected) return;
        
        this.isCollected = true;
        
        // Efecto visual de recolección
        this.scene.tweens.add({
            targets: this.sprite,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                this.destroy();
            }
        });
        
        return this.type;
    }
    
    /**
     * Verificar si está fuera de pantalla
     */
    isOffScreen() {
        return this.sprite.y > this.scene.game.config.height + 50;
    }
    
    /**
     * Obtener sprite (para colisiones)
     */
    getSprite() {
        return this.sprite;
    }
    
    /**
     * Destruir
     */
    destroy() {
        this.sprite.destroy();
    }
}