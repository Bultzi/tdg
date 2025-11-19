export class VisualEffect {
    constructor(x, y, type, config) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.config = config;
        this.lifeTime = 0;
        this.isDead = false;
        
        // Defaults
        this.duration = config.duration || 0.5;
        this.color = config.color || 'white';
        this.radius = config.radius || 20;
    }

    update(dt) {
        this.lifeTime += dt;
        if (this.lifeTime >= this.duration) {
            this.isDead = true;
        }
    }

    draw(renderer) {
        const ctx = renderer.ctx;
        const progress = this.lifeTime / this.duration;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        
        if (this.type === 'explosion') {
            ctx.globalAlpha = 1 - progress;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * (0.5 + progress * 0.5), 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'slash') {
            // Draw an arc
            ctx.globalAlpha = 1 - progress;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            const startAngle = this.config.angle - this.config.arc / 2;
            const endAngle = this.config.angle + this.config.arc / 2;
            ctx.arc(0, 0, this.radius, startAngle, endAngle);
            ctx.stroke();
        } else if (this.type === 'whirlwind') {
            ctx.globalAlpha = 0.5;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 3;
            ctx.beginPath();
            // Spin effect
            const rotation = this.lifeTime * 10;
            ctx.rotate(rotation);
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.moveTo(-this.radius, 0);
            ctx.lineTo(this.radius, 0);
            ctx.moveTo(0, -this.radius);
            ctx.lineTo(0, this.radius);
            ctx.stroke();
        } else if (this.type === 'nova') {
            ctx.globalAlpha = 1 - progress;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 2 + (1-progress) * 5;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * progress, 0, Math.PI * 2);
            ctx.stroke();
        } else if (this.type === 'dash') {
            ctx.globalAlpha = 0.5 * (1 - progress);
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 20 * (1 - progress);
            ctx.lineCap = 'round';
            ctx.beginPath();
            // Draw a line opposite to movement
            ctx.moveTo(0, 0);
            ctx.lineTo(-this.config.dx * 50, -this.config.dy * 50);
            ctx.stroke();
        } else if (this.type === 'hitSpark') {
            ctx.globalAlpha = 1 - progress;
            ctx.fillStyle = this.color;
            const currentRadius = this.radius * (progress);
            // Draw a sharp star-like shape
            ctx.beginPath();
            ctx.moveTo(0, -currentRadius);
            ctx.lineTo(0, currentRadius);
            ctx.moveTo(-currentRadius, 0);
            ctx.lineTo(currentRadius, 0);
            ctx.lineWidth = 3 * (1 - progress);
            ctx.strokeStyle = this.color;
            ctx.stroke();
        } else if (this.type === 'critSpark') {
            ctx.globalAlpha = 1 - progress;
            const outerRadius = this.radius * (0.5 + progress * 0.5);
            const innerRadius = outerRadius / 2;
            
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 4 * (1-progress);

            // Draw a more complex star for crits
            let angle = this.lifeTime * 20; // Spin
            for (let i = 0; i < 4; i++) {
                const x1 = Math.cos(angle) * innerRadius;
                const y1 = Math.sin(angle) * innerRadius;
                const x2 = Math.cos(angle) * outerRadius;
                const y2 = Math.sin(angle) * outerRadius;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                angle += Math.PI / 2;
            }
        }
        
        ctx.restore();
    }
}
