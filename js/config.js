/**
 * CONFIGURACIÓN GLOBAL DEL JUEGO
 * 
 * ¿Por qué un archivo de configuración?
 * - Centraliza valores importantes
 * - Facilita ajustes de balanceo
 * - Permite exportar a formato JSON
 * - Mejor mantenibilidad
 */

export const GAME_CONFIG = {
    // Configuración de Phaser
    width: window.innerWidth > 800 ? 800 : window.innerWidth,
    height: window.innerWidth > 800 ? 600 : window.innerHeight * 0.8,
    
    // Jugador
    player: {
        speed: 300,
        fireRate: 250,          // Milisegundos entre disparos
        startLives: 3,
        maxLives: 5,
        invulnerabilityTime: 2000  // 2 segundos invulnerable después de golpe
    },
    
    // Aliens
    aliens: {
        basic: {
            points: 10,
            health: 1,
            color: 0x10b981,
            speed: 1
        },
        strong: {
            points: 25,
            health: 2,
            color: 0xef4444,
            speed: 1
        },
        fast: {
            points: 15,
            health: 1,
            color: 0x3b82f6,
            speed: 1.5
        },
        boss: {
            points: 100,
            health: 5,
            color: 0x9333ea,
            speed: 0.8
        },
        baseSpeed: 60,
        speedIncreasePerLevel: 10,
        maxSpeed: 120,
        fireRate: 1500,
        moveDownAmount: 20
    },
    
    // Power-ups
    powerups: {
        dropChance: 0.15,        // 15% de probabilidad
        duration: 5000,           // 5 segundos
        types: {
            shield: {
                color: 0x3b82f6,
                effect: 'shield'
            },
            rapidFire: {
                color: 0xfbbf24,
                effect: 'rapidFire'
            },
            multiShot: {
                color: 0x10b981,
                effect: 'multiShot'
            }
        }
    },
    
    // Sistema de niveles
    levels: {
        startLevel: 1,
        alienRows: {
            min: 3,
            max: 6
        },
        alienCols: {
            min: 6,
            max: 10
        },
        bossEveryNLevels: 5
    },
    
    // Puntuación
    scoring: {
        levelCompleteBonus: 100,
        noHitBonus: 200,
        perfectAccuracyBonus: 500
    },
    
    // Colores del tema
    colors: {
        primary: 0x9333ea,
        secondary: 0x3b82f6,
        success: 0x10b981,
        danger: 0xef4444,
        warning: 0xfbbf24,
        neon: '#9333ea',
        neonBlue: '#3b82f6'
    },
    
    // Audio (volúmenes de 0 a 1)
    audio: {
        music: 0.3,
        sfx: 0.5,
        enabled: true
    }
};

// Detectar dispositivo móvil
export const IS_MOBILE = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Configuración ajustada para móvil
if (IS_MOBILE) {
    GAME_CONFIG.aliens.basic.fireRate = 2000;  // Menos difícil en móvil
    GAME_CONFIG.player.speed = 250;
}