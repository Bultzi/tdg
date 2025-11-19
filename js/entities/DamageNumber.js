import { Entity } from './Entity.js';
import { Utils } from '../utils.js';

export class DamageNumber extends Entity {
    constructor(x, y, amount, isCritical = false) {
        const color = isCritical ? '#FFD700' : 'white'; // Gold for critical, white otherwise
        super(x, y, 0, color);
        
        this.amount = Math.round(amount);
        this.lifeTime = 1.2; // Slightly longer life
        this.duration = this.lifeTime;
        
        // Initial velocity
        this.vy = -80; // More pronounced pop upwards
        this.vx = Utils.random(-25, 25); // Spread out
        this.gravity = 90; // Pulls the number down
        
        this.alpha = 1.0;
        this.initialSize = isCritical ? 28 : 20;
        this.size = this.initialSize;
    }

    update(dt) {
        // Apply physics
        this.vy += this.gravity * dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        this.lifeTime -= dt;
        
        // Update visuals based on lifetime
        const progress = Math.max(0, this.lifeTime / this.duration);
        this.alpha = progress; // Fade out
        this.size = this.initialSize * progress + 2; // Shrink but don't disappear completely
        
        if (this.lifeTime <= 0) {
            this.isDead = true;
        }
    }

    draw(renderer) {
        renderer.ctx.globalAlpha = this.alpha;
        renderer.drawText(this.amount, this.x, this.y, this.color, this.size, 'bold');
        renderer.ctx.globalAlpha = 1.0;
    }
}
