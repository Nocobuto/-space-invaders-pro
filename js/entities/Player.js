/**
 * CLASE PLAYER
 * 
 * Representa al jugador con todas sus propiedades y comportamientos
 */

import { GAME_CONFIG } from '../config.js';

export class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        
        // Crear sprite
        this.sprite = scene.physics.add.sprite(x, y, 'player');
        this.sprite.setCollideWorldBounds(true);
        
        // Propiedades
        this.lives = GAME_CONFIG.player.startLives;
        this.maxLives = GAME_CONFIG.player.maxLives;
        this.speed = GAME_CONFIG.player.speed;
        this.fireRate = GAME_CONFIG.player.fireRate;
        this.lastFireTime = 0;
        
        // Estados
        this.isInvulnerable = false;
        this.invulnerabilityTimer = null;
        
        // Power-ups activos
        this.activePowerUps = {
            shield: false,
            rapidFire: false,
            multiShot: false
        };
        
        // Indicador visual de escudo
        this.shieldGraphic = null;
    }
    
    /**
     * Mover jugador
     */
    move(direction) {
        // direction: -1 (izquierda), 0 (quieto), 1 (derecha)
        this.sprite.setVelocityX(direction * this.speed);
    }
    
    /**
     * Disparar
     */
    canFire(currentTime) {
        const actualFireRate = this.activePowerUps.rapidFire ? 
            this.fireRate / 2 : this.fireRate;
        
        return currentTime - this.lastFireTime > actualFireRate;
    }
    
    /**
     * Actualizar tiempo de disparo
     */
    updateFireTime(time) {
        this.lastFireTime = time;
    }
    
    /**
     * Recibir daño
     */
    takeDamage() {
        // Si tiene escudo, solo pierde el escudo
        if (this.activePowerUps.shield) {
            this.removePowerUp('shield');
            return false;  // No perdió vida
        }
        
        // Si es invulnerable, no recibe daño
        if (this.isInvulnerable) {
            return false;
        }
        
        // Perder vida
        this.lives--;
        
        // Activar invulnerabilidad temporal
        this.makeInvulnerable();
        
        return true;  // Perdió vida
    }
    
    /**
     * Hacer invulnerable temporalmente
     */
    makeInvulnerable() {
        this.isInvulnerable = true;
        
        // Efecto de parpadeo
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.3,
            duration: 200,
            yoyo: true,
            repeat: 10
        });
        
        // Quitar invulnerabilidad después del tiempo
        this.scene.time.delayedCall(GAME_CONFIG.player.invulnerabilityTime, () => {
            this.isInvulnerable = false;
            this.sprite.setAlpha(1);
        });
    }
    
    /**
     * Añadir vida
     */
    addLife() {
        if (this.lives < this.maxLives) {
            this.lives++;
            return true;
        }
        return false;
    }
    
    /**
     * Activar power-up
     */
    activatePowerUp(type) {
        this.activePowerUps[type] = true;
        
        // Efectos visuales según tipo
        if (type === 'shield') {
            this.createShield();
        }
        
        // Desactivar después del tiempo
        this.scene.time.delayedCall(GAME_CONFIG.powerups.duration, () => {
            this.removePowerUp(type);
        });
    }
    
    /**
     * Remover power-up
     */
    removePowerUp(type) {
        this.activePowerUps[type] = false;
        
        if (type === 'shield' && this.shieldGraphic) {
            this.shieldGraphic.destroy();
            this.shieldGraphic = null;
        }
    }
    
    /**
     * Crear escudo visual
     */
    createShield() {
        this.shieldGraphic = this.scene.add.circle(
            this.sprite.x,
            this.sprite.y,
            30,
            GAME_CONFIG.colors.secondary,
            0.3
        );
        
        // Animar escudo
        this.scene.tweens.add({
            targets: this.shieldGraphic,
            alpha: 0.5,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }
    
    /**
     * Actualizar (llamar cada frame)
     */
    update() {
        // Actualizar posición del escudo si existe
        if (this.shieldGraphic) {
            this.shieldGraphic.setPosition(this.sprite.x, this.sprite.y);
        }
    }
    
    /**
     * Obtener posición
     */
    getPosition() {
        return { x: this.sprite.x, y: this.sprite.y };
    }
    
    /**
     * Está vivo
     */
    isAlive() {
        return this.lives > 0;
    }
    
    /**
     * Destruir
     */
    destroy() {
        if (this.shieldGraphic) {
            this.shieldGraphic.destroy();
        }
        this.sprite.destroy();
    }
}