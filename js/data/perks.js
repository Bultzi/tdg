export const Perks = [
    {
        id: 'speed_boost',
        name: 'Speed Boost',
        description: 'Increases movement speed by 10%',
        icon: '⚡',
        apply: (player) => {
            player.speed *= 1.1;
        }
    },
    {
        id: 'health_boost',
        name: 'Max Health Up',
        description: 'Increases Max HP by 20',
        icon: '❤️',
        apply: (player) => {
            player.maxHp += 20;
            player.hp += 20;
        }
    },
    {
        id: 'attack_speed',
        name: 'Attack Speed',
        description: 'Increases attack speed by 15%',
        icon: '⚔️',
        apply: (player) => {
            player.autoAttackCooldown *= 0.85;
        }
    },
    {
        id: 'damage_boost',
        name: 'Damage Up',
        description: 'Increases projectile damage',
        icon: '💥',
        apply: (player) => {
            // This would require modifying the projectile damage logic, 
            // for now we can store a damage multiplier on the player
            player.damageMultiplier = (player.damageMultiplier || 1) + 0.2;
        }
    }
];
