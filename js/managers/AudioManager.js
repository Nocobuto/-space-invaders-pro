/**
 * AUDIO MANAGER
 * 
 * Gestiona todos los sonidos del juego
 * Nota: Esta versión usa Web Audio API para generar tonos
 * En producción, cargarías archivos de audio reales
 * 
 * ✅ CORRECCIÓN: Un solo AudioContext compartido para evitar saturación
 */

import { GAME_CONFIG } from '../config.js';

export class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.enabled = GAME_CONFIG.audio.enabled;
        this.musicVolume = GAME_CONFIG.audio.music;
        this.sfxVolume = GAME_CONFIG.audio.sfx;
        
        // ✅ CORRECCIÓN: Crear UN SOLO AudioContext global
        this.audioContext = null;
        this.initAudioContext();
        
        // En una versión real, cargarías archivos aquí
        // this.sounds = {
        //     shoot: scene.sound.add('shoot'),
        //     explosion: scene.sound.add('explosion'),
        //     powerup: scene.sound.add('powerup'),
        //     music: scene.sound.add('music', { loop: true })
        // };
    }
    
    /**
     * Inicializar AudioContext una sola vez
     * ✅ CORRECCIÓN: Método nuevo para gestionar el contexto
     */
    initAudioContext() {
        // Solo crear si está habilitado y si el navegador lo soporta
        if (!this.enabled || typeof AudioContext === 'undefined') {
            return;
        }
        
        try {
            // Crear o reutilizar el contexto
            if (!this.audioContext || this.audioContext.state === 'closed') {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            // Reanudar si está suspendido (algunos navegadores lo suspenden automáticamente)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        } catch (e) {
            console.warn('No se pudo inicializar AudioContext:', e);
            this.enabled = false;
        }
    }
    
    /**
     * Reproducir sonido de disparo
     */
    playShoot() {
        if (!this.enabled) return;
        // Tono corto y agudo
        this.playBeep(400, 0.1, 'sine');
    }
    
    /**
     * Reproducir explosión
     */
    playExplosion() {
        if (!this.enabled) return;
        // Ruido blanco corto
        this.playBeep(100, 0.2, 'sawtooth');
    }
    
    /**
     * Reproducir power-up
     */
    playPowerUp() {
        if (!this.enabled) return;
        // Escala ascendente
        this.playBeep(600, 0.3, 'sine');
    }
    
    /**
     * Reproducir hit del jugador
     */
    playHit() {
        if (!this.enabled) return;
        this.playBeep(200, 0.3, 'triangle');
    }
    
    /**
     * Reproducir victoria
     */
    playVictory() {
        if (!this.enabled) return;
        this.playBeep(800, 0.5, 'sine');
    }
    
    /**
     * Reproducir game over
     */
    playGameOver() {
        if (!this.enabled) return;
        this.playBeep(150, 0.8, 'sawtooth');
    }
    
    /**
     * Activar/Desactivar audio
     */
    toggle() {
        this.enabled = !this.enabled;
        
        if (this.enabled) {
            this.initAudioContext();
        } else if (this.audioContext) {
            // Suspender contexto cuando se desactiva
            this.audioContext.suspend();
        }
        
        return this.enabled;
    }
    
    /**
     * Generar beep sintético (placeholder para audio real)
     * ✅ CORRECCIÓN: Reutiliza el AudioContext global
     * En producción, usa archivos de audio profesionales
     */
    playBeep(frequency, duration, type = 'sine') {
        // Verificar si el audio está habilitado y el contexto existe
        if (!this.enabled || !this.audioContext) {
            return;
        }
        
        try {
            // ✅ CORRECCIÓN: Reanudar contexto si está suspendido
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            
            // Crear oscilador (se puede crear múltiples, pero con el mismo contexto)
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            // Conectar: oscilador → gain → salida
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Configurar oscilador
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            // Configurar volumen con fade out
            const now = this.audioContext.currentTime;
            gainNode.gain.setValueAtTime(this.sfxVolume * 0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
            
            // Reproducir y detener
            oscillator.start(now);
            oscillator.stop(now + duration);
            
            // ✅ CORRECCIÓN: Limpiar referencias después de reproducir
            oscillator.onended = () => {
                oscillator.disconnect();
                gainNode.disconnect();
            };
            
        } catch (e) {
            // Silenciar errores de audio para no saturar consola
            // console.warn('Error reproduciendo audio:', e);
        }
    }
    
    /**
     * Limpiar recursos al destruir
     * ✅ CORRECCIÓN: Método nuevo para cleanup
     */
    destroy() {
        if (this.audioContext) {
            try {
                this.audioContext.close();
                this.audioContext = null;
            } catch (e) {
                console.warn('Error cerrando AudioContext:', e);
            }
        }
    }
}