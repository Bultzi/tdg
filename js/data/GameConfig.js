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
    ui: {
        showDamageNumbers: true
    }
};
