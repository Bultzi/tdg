import { Entity } from './Entity.js';

export class Item extends Entity {
    constructor(x, y, type) {
        super(x, y, 15, '#fdcb6e');
        this.type = type;
        this.lifeTime = 15; // Default, overridden by config
        this.blinkTimer = 0;
    }

    update(dt) {
        this.lifeTime -= dt;
        if (this.lifeTime <= 0) {
            this.isDead = true;
        }
        
        this.blinkTimer += dt;
    }

    draw(renderer) {
        // Blink effect when expiring
        if (this.lifeTime < 3 && Math.floor(this.blinkTimer * 5) % 2 === 0) {
            return;
        }
        
        renderer.drawCircle(this.x, this.y, this.radius, this.color);
        renderer.drawText("?", this.x - 5, this.y + 5, 'black', 14);
    }
    
    use(player, game) {
        if (this.type === 'potion') {
            player.hp = Math.min(player.hp + 50, player.maxHp);
        } else if (this.type === 'bomb') {
            game.enemies.forEach(e => e.takeDamage(100, game));
        }
    }
}

export const ItemTypes = ['potion', 'bomb'];
