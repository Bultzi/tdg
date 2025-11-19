export const Characters = {
    mage: {
        name: "Mage",
        stats: {
            hp: 80,
            speed: 150,
            attackSpeed: 0.8
        },
        autoAttack: {
            type: 'projectile',
            damage: 10,
            speed: 300,
            color: '#a29bfe',
            range: 400,
            radius: 5
        },
        skills: {
            q: {
                name: "Fireball",
                cooldown: 5,
                description: "Shoots a large fireball.",
                type: 'projectile',
                damage: 30,
                speed: 400,
                radius: 12,
                color: '#ff7675',
                icon: '🔥'
            },
            e: {
                name: "Ice Nova",
                cooldown: 12,
                description: "Freezes enemies around you.",
                type: 'aoe',
                damage: 15,
                radius: 150,
                effect: 'freeze',
                effect: 'freeze',
                duration: 2,
                icon: '❄️'
            },
            r: {
                name: "Meteor",
                cooldown: 30,
                description: "Huge damage in an area.",
                type: 'aoe_cursor',
                damage: 100,
                damage: 100,
                radius: 100,
                delay: 1,
                icon: '☄️'
            }
        }
    },
    warrior: {
        name: "Warrior",
        stats: {
            hp: 140,
            speed: 130,
            attackSpeed: 0.6
        },
        autoAttack: {
            type: 'melee',
            damage: 15,
            range: 60,
            arc: Math.PI / 2, // 90 degrees
            duration: 0.2
        },
        skills: {
            q: {
                name: "Slash",
                cooldown: 3,
                description: "Wide slash attack.",
                type: 'melee_arc',
                damage: 25,
                range: 100,
                range: 100,
                arc: Math.PI,
                icon: '⚔️'
            },
            e: {
                name: "Dash",
                cooldown: 8,
                description: "Dash forward.",
                type: 'dash',
                distance: 200,
                distance: 200,
                speed: 800,
                icon: '👟'
            },
            r: {
                name: "Whirlwind",
                cooldown: 20,
                description: "Spin dealing damage to all nearby.",
                type: 'aoe_self',
                damage: 10, // per tick
                radius: 120,
                radius: 120,
                duration: 3,
                icon: '🌪️'
            }
        }
    },
    archer: {
        name: "Archer",
        stats: {
            hp: 90,
            speed: 160,
            attackSpeed: 0.5 // Fast
        },
        autoAttack: {
            type: 'projectile',
            damage: 8,
            speed: 500,
            color: '#55efc4',
            range: 500,
            radius: 3
        },
        skills: {
            q: {
                name: "Power Shot",
                cooldown: 6,
                description: "Piercing shot.",
                type: 'projectile',
                damage: 40,
                speed: 700,
                pierce: 3,
                radius: 6,
                radius: 6,
                color: '#00b894',
                icon: '🏹'
            },
            e: {
                name: "Trap",
                cooldown: 15,
                description: "Place a trap that explodes.",
                type: 'place',
                damage: 50,
                radius: 80,
                triggerRadius: 30,
                icon: '🪤'
            },
            r: {
                name: "Rain of Arrows",
                cooldown: 25,
                description: "Damage area over time.",
                type: 'aoe_cursor_dot',
                damage: 10, // per tick
                radius: 150,
                radius: 150,
                duration: 4,
                icon: '🌧️'
            }
        }
    }
};
