


global.config = require('./config.json');
global.mysql = require('mysql');
global.redis = require("redis");

global.mysqlController = require('./mysqlController');
global.redisConroller=require('./redisTimerTask');
global.logsPool = mysql.createPool(config.logs_mysql_config);

function startRedisConnection(retry) {
    console.log("Starting the Redis Connection")
    global.redisClient = redis.createClient(config.logs_redis_config);
    redisClient.on('error', function (err) {
        console.log(err);
        startRedisConnection();
    })
}

mysqlController.createTables();
startRedisConnection();



setInterval(function () {
    try {
      redisConroller.cleanRedis();
    } catch (e) {
        console.log(e)
    }
}, config.redis_flush_time);