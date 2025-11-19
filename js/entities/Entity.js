export class Entity {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.isDead = false;
    }

    update(dt) {
        // Base update logic
    }

    draw(renderer) {
        renderer.drawCircle(this.x, this.y, this.radius, this.color);
    }
}
