/**
 * MAIN.JS - PUNTO DE ENTRADA
 * 
 * Configuración principal de Phaser y arranque del juego
 */

import { GAME_CONFIG, IS_MOBILE } from './config.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';

// Configuración completa de Phaser
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: GAME_CONFIG.width,
    height: GAME_CONFIG.height,
    
    // Configuración de física
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false  // Cambiar a true para debugging
        }
    },
    
    // Escenas del juego
    scene: [
        MenuScene,
        GameScene,
        GameOverScene
    ],
    
    // Configuración de renderizado
    backgroundColor: '#0a0015',
    pixelArt: false,
    antialias: true,
    
    // Configuración de audio
    audio: {
        disableWebAudio: false
    },
    
    // Escala responsive
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_CONFIG.width,
        height: GAME_CONFIG.height,
        min: {
            width: 320,
            height: 240
        },
        max: {
            width: 1920,
            height: 1080
        }
    },
    
    // Configuración de entrada
    input: {
        keyboard: true,
        mouse: true,
        touch: true,
        gamepad: false
    },
    
    // Banner de Phaser (solo en desarrollo)
    banner: {
        hidePhaser: false,
        text: '#9333ea',
        background: [
            '#0a0015',
            '#1a0033',
            '#0d0020',
            '#0a0015'
        ]
    }
};

/**
 * Función principal que inicia el juego
 */
function startGame() {
    // Crear instancia de Phaser
    const game = new Phaser.Game(config);
    
    // Eventos globales del juego
    game.events.on('ready', () => {
        console.log('🎮 Neon Invaders cargado correctamente');
        console.log(`📱 Dispositivo: ${IS_MOBILE ? 'Móvil' : 'Desktop'}`);
        console.log(`📐 Resolución: ${config.width}x${config.height}`);
    });
    
    // Manejo de errores
    game.events.on('error', (error) => {
        console.error('❌ Error en el juego:', error);
    });
    
    // Guardar referencia global (útil para debugging)
    window.game = game;
    
    return game;
}

/**
 * Detectar cuando el DOM está listo
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startGame);
} else {
    startGame();
}

/**
 * Manejo de redimensionamiento de ventana
 */
window.addEventListener('resize', () => {
    if (window.game) {
        // Phaser maneja el resize automáticamente con la config de scale
        console.log('🔄 Ventana redimensionada');
    }
});

/**
 * Manejo de visibilidad de la página
 * Pausa el juego cuando la pestaña no está visible
 */
document.addEventListener('visibilitychange', () => {
    if (window.game) {
        if (document.hidden) {
            // Pausar el juego
            window.game.scene.scenes.forEach(scene => {
                if (scene.scene.isActive() && scene.scene.key === 'GameScene') {
                    scene.physics.pause();
                    console.log('⏸️ Juego pausado (pestaña oculta)');
                }
            });
        } else {
            // Reanudar el juego (opcional - podrías dejar que el usuario lo reanude manualmente)
            console.log('▶️ Pestaña visible');
        }
    }
});

/**
 * Prevenir zoom en móviles (mejor experiencia de juego)
 */
if (IS_MOBILE) {
    document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
    });
    
    document.addEventListener('touchmove', (e) => {
        if (e.scale !== 1) {
            e.preventDefault();
        }
    }, { passive: false });
}

/**
 * Log de información del navegador (útil para debugging)
 */
console.log('%c🎮 NEON INVADERS', 'color: #9333ea; font-size: 24px; font-weight: bold;');
console.log('%cBuilt with Phaser 3.70.0', 'color: #3b82f6; font-size: 14px;');
console.log('User Agent:', navigator.userAgent);
console.log('Screen:', screen.width, 'x', screen.height);
console.log('Window:', window.innerWidth, 'x', window.innerHeight);

// Exportar configuración para uso externo si es necesario
export { config };