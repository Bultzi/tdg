import { Entity } from './Entity.js';

export class Projectile extends Entity {
    constructor(x, y, dx, dy, damage, isEnemy = false, speed = 400, color = '#ffff00') {
        super(x, y, 5, color);
        this.dx = dx;
        this.dy = dy;
        this.speed = speed;
        this.damage = damage;
        this.isEnemy = isEnemy;
        this.lifeTime = 2; // Seconds
    }

    update(dt) {
        this.x += this.dx * this.speed * dt;
        this.y += this.dy * this.speed * dt;
        
        this.lifeTime -= dt;
        if (this.lifeTime <= 0) {
            this.isDead = true;
        }
    }
}
