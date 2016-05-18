var monsterSpawns = require("./monsterSpawns.js");

module.exports.getMonster = function() {
    return getSpawn(monsterSpawns);
}

function getSpawn(spawnItems) {
    var spawnPool = buildSpawnPool(spawnItems)
    var randomMonster = getRandomItem(spawnPool);
    randomMonster.probability = randomMonster.appearanceRate * 10000 / spawnPool.length;
    return randomMonster;
}

function buildSpawnPool(spawnItems) {
    var pool = []
    for (itemIndex = 0; itemIndex < spawnItems.length; itemIndex++) {
        var item = spawnItems[itemIndex];
        var appearancesInPool = item.appearanceRate * 100;
        for (iteration = 0; iteration < appearancesInPool; iteration++) {
            pool.push(item);
        }
    }
    return pool;
}

function getRandomItem(pool) {
    var randomIndex = Math.random() * (pool.length) | 0;
    return pool[randomIndex];
}