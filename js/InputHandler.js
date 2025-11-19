export class InputHandler {
    constructor() {
        this.keys = {};
        this.mouse = { x: 0, y: 0, isDown: false };
        
        // Key mappings
        this.keyMap = {
            'w': 'up', 'arrowup': 'up',
            's': 'down', 'arrowdown': 'down',
            'a': 'left', 'arrowleft': 'left',
            'd': 'right', 'arrowright': 'right',
            'q': 'skill_q',
            'e': 'skill_e',
            'r': 'skill_r',
            'f': 'use_item'
        };

        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (this.keyMap[key]) {
                this.keys[this.keyMap[key]] = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (this.keyMap[key]) {
                this.keys[this.keyMap[key]] = false;
            }
        });

        window.addEventListener('mousemove', (e) => {
            const rect = document.querySelector('canvas').getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        window.addEventListener('mousedown', () => {
            this.mouse.isDown = true;
        });

        window.addEventListener('mouseup', () => {
            this.mouse.isDown = false;
        });
    }

    isDown(action) {
        return this.keys[action] === true;
    }
}
