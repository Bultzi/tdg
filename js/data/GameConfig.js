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
        // Example Wave: At 60s, spawn 5 fast enemies
        { time: 10, type: 'basic', count: 2, interval: 1.5 },
        { time: 35, type: 'fast', count: 2, interval: 1.5 },
        { time: 55, type: 'basic', count: 4, interval: 0.5 },
        { time: 75, type: 'fast', count: 3, interval: 1 },
        { time: 90, type: 'basic', count: 10, interval: 1 },
        { time: 110, type: 'shooter', count: 5, interval: 0.5 },
        { time: 120, type: 'fast', count: 3, interval: 1 },
        { time: 140, type: 'star', count: 1, interval: 0 },
        { time: 180, type: 'star', count: 2, interval: 2 },
        { time: 200, type: 'star_boss', count: 1, interval: 0 }, // Boss spawn
    ],
    spawnPools: [
        { 
            minTime: 0, 
            weights: { shooter: 100 } 
        },
        { 
            minTime: 20, 
            weights: { basic: 100 } 
        },
        { 
            minTime: 30, 
            weights: { shooter: 80, basic: 20 } 
        },
        { 
            minTime: 60, 
            weights: { shooter: 60, basic: 30, fast: 10 } 
        },
        { 
            minTime: 100, 
            weights: { basic: 50, fast: 20, shooter: 20, basic_strong: 10 } 
        },
        { 
            minTime: 140, 
            weights: { basic: 40, fast: 20, shooter: 20, tank: 10, fast_elite: 10 } 
        },
        { 
            minTime: 180, 
            weights: { basic: 30, shooter: 20, tank: 15, star: 10, shooter_rapid: 15, tank_armored: 10 } 
        }
    ],
    ui: {
        showDamageNumbers: true
    }
};
