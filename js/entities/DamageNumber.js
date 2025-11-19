import { Entity } from './Entity.js';

export class DamageNumber extends Entity {
    constructor(x, y, amount, color = 'white') {
        super(x, y, 0, color);
        this.amount = Math.round(amount);
        this.lifeTime = 1.0;
        this.vy = -50; // Float up
        this.alpha = 1.0;
    }

    update(dt) {
        this.y += this.vy * dt;
        this.lifeTime -= dt;
        this.alpha = Math.max(0, this.lifeTime);
        
        if (this.lifeTime <= 0) {
            this.isDead = true;
        }
    }

    draw(renderer) {
        renderer.ctx.globalAlpha = this.alpha;
        renderer.drawText(this.amount, this.x, this.y, this.color, 20);
        renderer.ctx.globalAlpha = 1.0;
    }
}
