/**
 * SCORE MANAGER
 * 
 * Gestiona todo lo relacionado con puntuación:
 * - Score actual
 * - High scores (localStorage)
 * - Estadísticas
 * - Achievements
 */

export class ScoreManager {
    constructor() {
        this.currentScore = 0;
        this.highScore = this.loadHighScore();
        this.stats = {
            aliensKilled: 0,
            shotsFlotsFired: 0,
            shotsHit: 0,
            powerUpsCollected: 0,
            livesLost: 0,
            levelsCompleted: 0,
            timePlayedSeconds: 0
        };
        
        // Achievements
        this.achievements = {
            firstBlood: false,
            marksman: false,      // 10 disparos consecutivos
            survivor: false,      // Nivel sin daño
            speedRunner: false,   // Nivel en menos de 60s
            collector: false      // 5 power-ups en un nivel
        };
        
        this.consecutiveHits = 0;
    }
    
    /**
     * Añadir puntos
     */
    addScore(points) {
        this.currentScore += points;
        
        // Verificar nuevo récord
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            this.saveHighScore();
            return true;  // Nuevo récord!
        }
        return false;
    }
    
    /**
     * Registrar alien eliminado
     */
    alienKilled() {
        this.stats.aliensKilled++;
        this.stats.shotsHit++;
        this.consecutiveHits++;
        
        // Achievement: First Blood
        if (this.stats.aliensKilled === 1) {
            this.unlockAchievement('firstBlood');
        }
        
        // Achievement: Marksman
        if (this.consecutiveHits >= 10) {
            this.unlockAchievement('marksman');
        }
    }
    
    /**
     * Registrar disparo
     */
    shotFired() {
        this.stats.shotsFired++;
    }
    
    /**
     * Registrar disparo fallado
     */
    shotMissed() {
        this.consecutiveHits = 0;
    }
    
    /**
     * Power-up recogido
     */
    powerUpCollected() {
        this.stats.powerUpsCollected++;
    }
    
    /**
     * Calcular precisión
     */
    getAccuracy() {
        if (this.stats.shotsFired === 0) return 0;
        return Math.round((this.stats.shotsHit / this.stats.shotsFired) * 100);
    }
    
    /**
     * Desbloquear achievement
     */
    unlockAchievement(name) {
        if (!this.achievements[name]) {
            this.achievements[name] = true;
            return true;  // Recién desbloqueado
        }
        return false;
    }
    
    /**
     * Guardar high score en localStorage
     */
    saveHighScore() {
        try {
            localStorage.setItem('neonInvadersHighScore', this.highScore.toString());
        } catch (e) {
            console.warn('No se pudo guardar high score:', e);
        }
    }
    
    /**
     * Cargar high score de localStorage
     */
    loadHighScore() {
        try {
            const saved = localStorage.getItem('neonInvadersHighScore');
            return saved ? parseInt(saved) : 0;
        } catch (e) {
            console.warn('No se pudo cargar high score:', e);
            return 0;
        }
    }
    
    /**
     * Resetear score actual (nuevo juego)
     */
    resetCurrentScore() {
        this.currentScore = 0;
        this.stats.aliensKilled = 0;
        this.stats.shotsFired = 0;
        this.stats.shotsHit = 0;
        this.stats.powerUpsCollected = 0;
        this.consecutiveHits = 0;
    }
    
    /**
     * Obtener datos para mostrar
     */
    getDisplayData() {
        return {
            score: this.currentScore,
            highScore: this.highScore,
            accuracy: this.getAccuracy(),
            kills: this.stats.aliensKilled,
            powerUps: this.stats.powerUpsCollected
        };
    }
}