export const Utils = {
    // Get random float between min and max
    random: (min, max) => Math.random() * (max - min) + min,

    // Get random integer between min and max (inclusive)
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

    // Calculate distance between two points
    distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),

    // Check collision between two circles
    circleCollision: (c1, c2) => {
        const dist = Utils.distance(c1.x, c1.y, c2.x, c2.y);
        return dist < c1.radius + c2.radius;
    },

    // Check collision between circle and rectangle (AABB)
    rectCircleCollision: (rect, circle) => {
        let testX = circle.x;
        let testY = circle.y;

        if (circle.x < rect.x) testX = rect.x;
        else if (circle.x > rect.x + rect.w) testX = rect.x + rect.w;

        if (circle.y < rect.y) testY = rect.y;
        else if (circle.y > rect.y + rect.h) testY = rect.y + rect.h;

        const distX = circle.x - testX;
        const distY = circle.y - testY;
        const distance = Math.sqrt((distX * distX) + (distY * distY));

        return distance <= circle.radius;
    },
    
    // Clamp a value between min and max
    clamp: (val, min, max) => Math.min(Math.max(val, min), max)
};
