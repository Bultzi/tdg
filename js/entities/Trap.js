import { Entity } from './Entity.js';
import { Utils } from '../utils.js';

export class Trap extends Entity {
    constructor(x, y, damage, radius, triggerRadius, owner) {
        super(x, y, 10, '#ff7675'); // Small red dot initially
        this.damage = damage;
        this.radius = radius; // Explosion radius
        this.triggerRadius = triggerRadius;
        this.owner = owner;
        this.triggered = false;
        this.triggerTimer = 0.5; // Delay before it can trigger
        this.lifeTime = 30;
    }

    update(dt, game) {
        this.lifeTime -= dt;
        if (this.lifeTime <= 0) {
            this.isDead = true;
            return;
        }

        if (this.triggerTimer > 0) {
            this.triggerTimer -= dt;
            return;
        }

        // Check for enemies
        for (const enemy of game.enemies) {
            if (Utils.distance(this.x, this.y, enemy.x, enemy.y) < this.triggerRadius + enemy.radius) {
                this.explode(game);
                break;
            }
        }
    }

    explode(game) {
        this.isDead = true;
        // Visual explosion
        game.renderer.drawCircle(this.x, this.y, this.radius, 'rgba(255, 100, 100, 0.5)'); // Instant visual, but ideally we spawn an effect entity
        
        // Damage
        game.enemies.forEach(enemy => {
            if (Utils.distance(this.x, this.y, enemy.x, enemy.y) <= this.radius) {
                enemy.takeDamage(this.damage * this.owner.damageMultiplier, game);
            }
        });
        
        // Spawn visual effect
        game.addEffect('explosion', this.x, this.y, { radius: this.radius, color: '#ff7675' });
    }

    draw(renderer) {
        // Draw trap
        renderer.ctx.save();
        renderer.ctx.translate(this.x, this.y);
        renderer.ctx.fillStyle = '#555';
        renderer.ctx.beginPath();
        renderer.ctx.arc(0, 0, 8, 0, Math.PI * 2);
        renderer.ctx.fill();
        
        renderer.ctx.strokeStyle = '#ff7675';
        renderer.ctx.lineWidth = 2;
        renderer.ctx.beginPath();
        renderer.ctx.moveTo(-5, -5);
        renderer.ctx.lineTo(5, 5);
        renderer.ctx.moveTo(5, -5);
        renderer.ctx.lineTo(-5, 5);
        renderer.ctx.stroke();
        
        // Draw trigger radius indicator (faint)
        renderer.ctx.strokeStyle = 'rgba(255, 118, 117, 0.3)';
        renderer.ctx.beginPath();
        renderer.ctx.arc(0, 0, this.triggerRadius, 0, Math.PI * 2);
        renderer.ctx.stroke();
        
        renderer.ctx.restore();
    }
}
