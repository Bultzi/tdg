import { Entity } from './Entity.js';
import { Utils } from '../utils.js';

export class AreaEffect extends Entity {
    constructor(x, y, type, config) {
        super(x, y, config.radius, config.color || 'rgba(255, 255, 255, 0.2)');
        this.type = type; // 'dot', 'delayed_burst'
        this.config = config;
        this.timer = 0;
        this.tickTimer = 0;
        this.duration = config.duration || 1;
        this.damage = config.damage || 0;
        this.owner = config.owner;
        this.hasTriggered = false;
    }

    update(dt, game) {
        this.timer += dt;
        
        if (this.type === 'dot') {
            this.tickTimer += dt;
            if (this.tickTimer >= 0.5) { // Tick every 0.5s
                this.tickTimer = 0;
                this.applyDamage(game);
            }
        } else if (this.type === 'delayed_burst') {
            if (this.timer >= this.config.delay && !this.hasTriggered) {
                this.applyDamage(game);
                this.hasTriggered = true;
                // Visual boom
                game.addEffect('explosion', this.x, this.y, { radius: this.config.radius, color: this.config.color });
            }
        }

        if (this.timer >= this.duration) {
            this.isDead = true;
        }
    }

    applyDamage(game) {
        game.enemies.forEach(enemy => {
            if (Utils.distance(this.x, this.y, enemy.x, enemy.y) <= this.config.radius) {
                enemy.takeDamage(this.damage * (this.owner ? this.owner.damageMultiplier : 1), game);
            }
        });
    }

    draw(renderer) {
        renderer.ctx.save();
        renderer.ctx.translate(this.x, this.y);
        
        if (this.type === 'dot') {
            renderer.ctx.fillStyle = this.color;
            renderer.ctx.beginPath();
            renderer.ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            renderer.ctx.fill();
            
            // Rain effect for archer
            if (this.config.subType === 'rain') {
                renderer.ctx.strokeStyle = '#00b894';
                renderer.ctx.lineWidth = 1;
                for(let i=0; i<5; i++) {
                    const rx = (Math.random() - 0.5) * this.radius * 1.5;
                    const ry = (Math.random() - 0.5) * this.radius * 1.5;
                    renderer.ctx.beginPath();
                    renderer.ctx.moveTo(rx, ry - 10);
                    renderer.ctx.lineTo(rx, ry + 10);
                    renderer.ctx.stroke();
                }
            }
        } else if (this.type === 'delayed_burst') {
            // Draw warning circle
            const progress = Math.min(1, this.timer / this.config.delay);
            
            renderer.ctx.strokeStyle = this.config.color;
            renderer.ctx.lineWidth = 2;
            renderer.ctx.beginPath();
            renderer.ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            renderer.ctx.stroke();
            
            renderer.ctx.fillStyle = this.config.color;
            renderer.ctx.globalAlpha = 0.3 * progress;
            renderer.ctx.beginPath();
            renderer.ctx.arc(0, 0, this.radius * progress, 0, Math.PI * 2);
            renderer.ctx.fill();
        }
        
        renderer.ctx.restore();
    }
}
