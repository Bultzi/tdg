import { Entity } from './Entity.js';
import { Utils } from '../utils.js';
import { Projectile } from './Projectile.js';
import { EnemyTypes } from '../data/EnemyData.js';

export class Enemy extends Entity {
    constructor(x, y, type = 'basic') {
        const data = EnemyTypes[type] || EnemyTypes['basic'];
        super(x, y, data.radius, data.color);
        
        this.type = type;
        this.data = data;
        this.speed = data.speed;
        this.hp = data.hp;
        this.maxHp = data.maxHp;
        this.damage = data.damage;
        
        // Behavior state
        this.shootTimer = 0;
    }

    update(dt, player, game) {
        // Move towards player
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        this.x += Math.cos(angle) * this.speed * dt;
        this.y += Math.sin(angle) * this.speed * dt;

        // Behavior Logic
        if (game && (this.data.behavior === 'shoot_single' || this.data.behavior === 'shoot_multi')) {
            this.shootTimer += dt;
            if (this.shootTimer >= this.data.shootInterval) {
                this.shootTimer = 0;
                
                if (this.data.behavior === 'shoot_single') {
                    // Shoot at player
                    const dx = Math.cos(angle);
                    const dy = Math.sin(angle);
                    const proj = new Projectile(this.x, this.y, dx, dy, this.damage, true, this.data.projectileSpeed, this.color);
                    game.projectiles.push(proj);
                } else if (this.data.behavior === 'shoot_multi') {
                    // Shoot in multiple directions
                    const count = this.data.projectileCount || 5;
                    for (let i = 0; i < count; i++) {
                        const shootAngle = angle + (i - (count-1)/2) * (Math.PI / 4); // Spread
                        const dx = Math.cos(shootAngle);
                        const dy = Math.sin(shootAngle);
                        const proj = new Projectile(this.x, this.y, dx, dy, this.damage, true, this.data.projectileSpeed, this.color);
                        game.projectiles.push(proj);
                    }
                }
            }
        }
    }

    takeDamage(amount, game) {
        this.hp -= amount;
        if (game && game.config && game.config.ui.showDamageNumbers) {
            game.spawnDamageNumber(this.x, this.y - 20, amount);
        }
        
        if (this.hp <= 0) {
            this.isDead = true;
        }
    }
    
    draw(renderer) {
        const ctx = renderer.ctx;
        ctx.fillStyle = this.color;
        
        if (this.data.shape === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.radius);
            ctx.lineTo(this.x + this.radius, this.y + this.radius);
            ctx.lineTo(this.x - this.radius, this.y + this.radius);
            ctx.closePath();
            ctx.fill();
        } else if (this.data.shape === 'square') {
            const size = this.radius * 2;
            ctx.fillRect(this.x - this.radius, this.y - this.radius, size, size);
        } else if (this.data.shape === 'star') {
            // Draw Star
            const spikes = 5;
            const outerRadius = this.radius;
            const innerRadius = this.radius / 2;
            let rot = Math.PI / 2 * 3;
            let x = this.x;
            let y = this.y;
            let step = Math.PI / spikes;

            ctx.beginPath();
            ctx.moveTo(this.x, this.y - outerRadius);
            for (let i = 0; i < spikes; i++) {
                x = this.x + Math.cos(rot) * outerRadius;
                y = this.y + Math.sin(rot) * outerRadius;
                ctx.lineTo(x, y);
                rot += step;

                x = this.x + Math.cos(rot) * innerRadius;
                y = this.y + Math.sin(rot) * innerRadius;
                ctx.lineTo(x, y);
                rot += step;
            }
            ctx.lineTo(this.x, this.y - outerRadius);
            ctx.closePath();
            ctx.fill();
        } else {
            // Default Circle
            super.draw(renderer);
        }
        
        // Health Bar
        const pct = this.hp / this.maxHp;
        const w = 30;
        const h = 4;
        const x = this.x - w / 2;
        const y = this.y - this.radius - 10;
        
        renderer.drawRect(x, y, w, h, 'red');
        renderer.drawRect(x, y, w * pct, h, '#2ed573');
    }
}
