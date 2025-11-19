import { Entity } from './Entity.js';

export class Terrain extends Entity {
    constructor(x, y, w, h, color) {
        super(x, y, 0, color);
        this.w = w;
        this.h = h;
        this.type = 'rect';
    }

    draw(renderer) {
        renderer.drawRect(this.x, this.y, this.w, this.h, this.color);
    }
}
