const config=require('./config.json');
const mysqlController = require('./mysqlController');
module.exports = {
    cleanRedis: function () {
        redisClient.keys('*online*', function (error, keys) {
            if (error) {
                console.log("we have error while getting", error);
            } else {
                console.log(keys)
                keys.map((key) => {
                    let exploadedKeyArray = key.split("_");  
                    let appId = exploadedKeyArray[0],
                        timestamp = exploadedKeyArray[2],
                        currentTime = new Date().getTime();
                    if ((currentTime - (currentTime % (config.redis_flush_time))) >= timestamp) {
                        redisClient.smembers(key,function(error,members){
                            mysqlController.insertIntoUsersLogs(members);                            
                        });
                    }
                });
            }
        });
    }
}