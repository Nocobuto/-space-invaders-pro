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
            debug: false
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
    
    // ✅ CORRECCIÓN: Escala mejorada para móvil
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
        },
        // ✅ NUEVO: Opciones específicas para móvil
        expandParent: true,
        autoRound: true
    },
    
    // Configuración de entrada
    input: {
        keyboard: true,
        mouse: true,
        touch: true,
        gamepad: false,
        // ✅ NUEVO: Configuración mejorada para touch
        activePointers: 3 // Soportar hasta 3 toques simultáneos
    },
    
    // ✅ NUEVO: Configuración DOM para móvil
    dom: {
        createContainer: true
    },
    
    // Banner de Phaser
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
        console.log('🔄 Ventana redimensionada');
    }
});

/**
 * Manejo de visibilidad de la página
 */
document.addEventListener('visibilitychange', () => {
    if (window.game) {
        if (document.hidden) {
            window.game.scene.scenes.forEach(scene => {
                if (scene.scene.isActive() && scene.scene.key === 'GameScene') {
                    scene.physics.pause();
                    console.log('⏸️ Juego pausado (pestaña oculta)');
                }
            });
        } else {
            console.log('▶️ Pestaña visible');
        }
    }
});

/**
 * ✅ NUEVO: Prevenir zoom y gestos en móviles
 */
if (IS_MOBILE) {
    // Prevenir zoom con gestos
    document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
    });
    
    // Prevenir zoom con pellizco
    document.addEventListener('touchmove', (e) => {
        if (e.scale !== 1) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Prevenir menú contextual en long press
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    // Prevenir doble tap para zoom
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

/**
 * Log de información del navegador
 */
console.log('%c🎮 NEON INVADERS', 'color: #9333ea; font-size: 24px; font-weight: bold;');
console.log('%cBuilt with Phaser 3.70.0', 'color: #3b82f6; font-size: 14px;');
console.log('User Agent:', navigator.userAgent);
console.log('Screen:', screen.width, 'x', screen.height);
console.log('Window:', window.innerWidth, 'x', window.innerHeight);
console.log('Device Pixel Ratio:', window.devicePixelRatio);
console.log('Touch Support:', 'ontouchstart' in window);

// Exportar configuración
export { config };