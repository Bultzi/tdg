import { Entity } from './Entity.js';
import { Utils } from '../utils.js';
import { Projectile } from './Projectile.js';

export class Enemy extends Entity {
    constructor(x, y, type = 'basic') {
        super(x, y, 15, '#ff4757');
        this.type = type;
        
        if (type === 'fast') {
            this.speed = 180;
            this.hp = 15;
            this.maxHp = 15;
            this.color = '#ff6b81';
            this.damage = 8;
        } else if (type === 'shooter') {
            this.speed = 50;
            this.hp = 20;
            this.maxHp = 20;
            this.color = '#a55eea'; // Purple
            this.damage = 10;
            this.shootTimer = 0;
            this.shootInterval = 2; // Seconds
        } else if (type === 'tank') {
            this.speed = 40;
            this.hp = 150;
            this.maxHp = 150;
            this.color = '#8B0000'; // Dark Red
            this.damage = 15;
            this.radius = 20; // Slightly larger (default is 15)
        } else {
            this.speed = 100;
            this.hp = 30;
            this.maxHp = 30;
            this.damage = 10;
        }
    }

    update(dt, player, game) {
        // Move towards player
        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        this.x += Math.cos(angle) * this.speed * dt;
        this.y += Math.sin(angle) * this.speed * dt;

        // Shooter logic
        if (this.type === 'shooter' && game) {
            this.shootTimer += dt;
            if (this.shootTimer >= this.shootInterval) {
                this.shootTimer = 0;
                // Shoot at player
                const dx = Math.cos(angle);
                const dy = Math.sin(angle);
                // Slow projectile (150 speed), purple color
                const proj = new Projectile(this.x, this.y, dx, dy, 10, true, 150, '#a55eea');
                game.projectiles.push(proj);
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
        if (this.type === 'shooter') {
            // Draw Triangle
            const ctx = renderer.ctx;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            // Pointing towards player would be nice, but for now just a triangle
            // Let's make it point up for simplicity or just a regular triangle
            ctx.moveTo(this.x, this.y - this.radius);
            ctx.lineTo(this.x + this.radius, this.y + this.radius);
            ctx.lineTo(this.x - this.radius, this.y + this.radius);
            ctx.closePath();
            ctx.fill();
        } else if (this.type === 'tank') {
            // Draw Square
            const ctx = renderer.ctx;
            ctx.fillStyle = this.color;
            const size = this.radius * 2;
            ctx.fillRect(this.x - this.radius, this.y - this.radius, size, size);
        } else {
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
