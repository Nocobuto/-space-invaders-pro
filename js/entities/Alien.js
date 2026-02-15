/**
 * CLASE ALIEN
 * 
 * Representa un enemigo alien con diferentes tipos y comportamientos
 */

import { GAME_CONFIG } from '../config.js';

export class Alien {
    constructor(scene, x, y, type = 'basic') {
        this.scene = scene;
        this.type = type;
        
        // Obtener configuración según tipo
        const config = GAME_CONFIG.aliens[type];
        
        // Crear sprite
        this.sprite = scene.physics.add.sprite(x, y, 'alien');
        this.sprite.setTint(config.color);
        
        // Propiedades
        this.health = config.health;
        this.maxHealth = config.health;
        this.points = config.points;
        this.speedMultiplier = config.speed;
        
        // Referencias para destrucción
        this.isDestroyed = false;
        
        // Crear barra de vida si tiene más de 1 HP
        if (this.maxHealth > 1) {
            this.createHealthBar();
        }
    }
    
    /**
     * Crear barra de vida
     */
    createHealthBar() {
        const width = 30;
        const height = 4;
        
        // Fondo de la barra
        this.healthBarBg = this.scene.add.rectangle(
            this.sprite.x,
            this.sprite.y - 20,
            width,
            height,
            0x000000
        );
        
        // Barra de vida actual
        this.healthBar = this.scene.add.rectangle(
            this.sprite.x - width / 2,
            this.sprite.y - 20,
            width,
            height,
            0xef4444
        );
        this.healthBar.setOrigin(0, 0.5);
    }
    
    /**
     * Actualizar barra de vida
     */
    updateHealthBar() {
        if (!this.healthBar) return;
        
        const width = 30;
        const healthPercent = this.health / this.maxHealth;
        
        this.healthBar.width = width * healthPercent;
        this.healthBar.setPosition(
            this.sprite.x - width / 2,
            this.sprite.y - 20
        );
        
        this.healthBarBg.setPosition(this.sprite.x, this.sprite.y - 20);
        
        // Cambiar color según vida
        if (healthPercent > 0.6) {
            this.healthBar.setFillStyle(0x10b981); // Verde
        } else if (healthPercent > 0.3) {
            this.healthBar.setFillStyle(0xfbbf24); // Amarillo
        } else {
            this.healthBar.setFillStyle(0xef4444); // Rojo
        }
    }
    
    /**
     * Recibir daño
     */
    takeDamage(damage = 1) {
        this.health -= damage;
        
        // Efecto visual de daño
        this.sprite.setTint(0xffffff);
        this.scene.time.delayedCall(100, () => {
            if (!this.isDestroyed) {
                this.sprite.setTint(GAME_CONFIG.aliens[this.type].color);
            }
        });
        
        // Actualizar barra de vida
        if (this.healthBar) {
            this.updateHealthBar();
        }
        
        // Verificar si murió
        if (this.health <= 0) {
            return true; // Está muerto
        }
        
        return false; // Sigue vivo
    }
    
    /**
     * Mover alien
     */
    move(deltaX, deltaY) {
        this.sprite.x += deltaX * this.speedMultiplier;
        this.sprite.y += deltaY;
        
        // Actualizar barra de vida
        if (this.healthBar) {
            this.updateHealthBar();
        }
    }
    
    /**
     * Obtener posición
     */
    getPosition() {
        return { x: this.sprite.x, y: this.sprite.y };
    }
    
    /**
     * Verificar si está en el borde
     */
    isAtEdge(leftBound, rightBound) {
        return this.sprite.x <= leftBound || this.sprite.x >= rightBound;
    }
    
    /**
     * Puede disparar (probabilidad basada en tipo)
     */
    canFire() {
        const fireChance = {
            basic: 0.3,
            strong: 0.4,
            fast: 0.5,
            boss: 0.7
        };
        
        return Math.random() < fireChance[this.type];
    }
    
    /**
     * Destruir con explosión
     */
    destroy() {
        this.isDestroyed = true;
        
        // Destruir barra de vida
        if (this.healthBar) {
            this.healthBar.destroy();
            this.healthBarBg.destroy();
        }
        
        // El sprite se destruye externamente (en GameScene)
        // para poder hacer la animación de explosión
    }
    
    /**
     * Obtener sprite (para colisiones)
     */
    getSprite() {
        return this.sprite;
    }
    
    /**
     * Obtener puntos
     */
    getPoints() {
        return this.points;
    }
    
    /**
     * Es BOSS
     */
    isBoss() {
        return this.type === 'boss';
    }
}