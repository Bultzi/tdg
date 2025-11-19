export const EnemyTypes = {
    // Basic Enemies
    basic: {
        hp: 30,
        maxHp: 30,
        speed: 100,
        damage: 10,
        color: '#ff4757',
        radius: 15,
        shape: 'circle',
        behavior: 'follow'
    },
    basic_strong: {
        hp: 60,
        maxHp: 60,
        speed: 90,
        damage: 12,
        color: '#c0392b',
        radius: 16,
        shape: 'circle',
        behavior: 'follow'
    },

    // Fast Enemies
    fast: {
        hp: 15,
        maxHp: 15,
        speed: 180,
        damage: 8,
        color: '#ff6b81',
        radius: 15,
        shape: 'circle',
        behavior: 'follow'
    },
    fast_elite: {
        hp: 25,
        maxHp: 25,
        speed: 220,
        damage: 10,
        color: '#e67e22',
        radius: 14,
        shape: 'circle',
        behavior: 'follow'
    },

    // Shooter Enemies
    shooter: {
        hp: 20,
        maxHp: 20,
        speed: 50,
        damage: 10,
        color: '#a55eea',
        radius: 15,
        shape: 'triangle',
        behavior: 'shoot_single',
        shootInterval: 2,
        projectileSpeed: 150
    },
    shooter_rapid: {
        hp: 30,
        maxHp: 30,
        speed: 60,
        damage: 8,
        color: '#d980fa',
        radius: 15,
        shape: 'triangle',
        behavior: 'shoot_single',
        shootInterval: 1,
        projectileSpeed: 180
    },

    // Tank Enemies
    tank: {
        hp: 150,
        maxHp: 150,
        speed: 40,
        damage: 15,
        color: '#8B0000',
        radius: 20,
        shape: 'square',
        behavior: 'follow'
    },
    tank_armored: {
        hp: 300,
        maxHp: 300,
        speed: 35,
        damage: 20,
        color: '#2c3e50',
        radius: 22,
        shape: 'square',
        behavior: 'follow'
    },

    // Star Enemies
    star: {
        hp: 80,
        maxHp: 80,
        speed: 70,
        damage: 15,
        color: '#f1c40f',
        radius: 18,
        shape: 'star',
        behavior: 'shoot_multi',
        shootInterval: 3,
        projectileSpeed: 120,
        projectileCount: 5
    },
    star_boss: {
        hp: 200,
        maxHp: 200,
        speed: 60,
        damage: 20,
        color: '#e58e26',
        radius: 25,
        shape: 'star',
        behavior: 'shoot_multi',
        shootInterval: 2.5,
        projectileSpeed: 130,
        projectileCount: 8
    }
};
