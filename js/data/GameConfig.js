export const GameConfig = {
    terrain: {
        enabled: true,
        count: 15,
        minSize: 40,
        maxSize: 100,
        colors: ['#5c5c5c', '#4a4a4a', '#3d3d3d'] // Rock colors
    },
    airdrops: {
        enabled: true,
        interval: 45, // Seconds
        chance: 0.4, // Chance per interval check
        duration: 15 // Seconds before disappearing
    },
    spawning: {
        baseInterval: 2.0,
        minInterval: 0.5,
        decreasePerWave: 0.05
    },
    waves: [
        // Example Wave: At 10s, spawn 5 fast enemies
        { time: 60, type: 'fast', count: 5, interval: 0.5 },
        { time: 120, type: 'shooter', count: 3, interval: 1 },
        { time: 180, type: 'tank', count: 2, interval: 2 },
        { time: 240, type: 'star', count: 1, interval: 0 } // Boss spawn
    ],
    spawnPools: [
        { 
            minTime: 0, 
            weights: { basic: 100 } 
        },
        { 
            minTime: 30, 
            weights: { basic: 80, fast: 20 } 
        },
        { 
            minTime: 60, 
            weights: { basic: 60, fast: 30, shooter: 10 } 
        },
        { 
            minTime: 120, 
            weights: { basic: 50, fast: 20, shooter: 20, basic_strong: 10 } 
        },
        { 
            minTime: 180, 
            weights: { basic: 40, fast: 20, shooter: 20, tank: 10, fast_elite: 10 } 
        },
        { 
            minTime: 240, 
            weights: { basic: 30, shooter: 20, tank: 15, star: 10, shooter_rapid: 15, tank_armored: 10 } 
        }
    ],
    ui: {
        showDamageNumbers: true
    }
};
