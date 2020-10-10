const config = require('./config.json');
const mysqlController = require('./mysqlController');
const redisController = require('./redisController');
module.exports = {
    cleanRedis: function () {
        redisClient.keys('*online*', function (error, keys) {
            if (error) {
                console.log("we have error while getting", error);
            } else {                
                let filterKeys = keys.filter((key) => {
                    let exploadedKeyArray = key.split("_");
                    let appId = exploadedKeyArray[0],
                        timestamp = exploadedKeyArray[2],
                        currentTime = new Date().getTime();
                    if ((currentTime - (currentTime % (config.redis_flush_time))) >= timestamp) {
                        return true;                      
                    }
                });
            
                redisController.getCCUFromRedis(filterKeys,(ccuArray)=>{                    
                    mysqlController.insertIntoUsersCounter(ccuArray,(err,isUpdated)=>{
                        if(err){
                            console.log(err)
                        }else{
                          if(isUpdated){
                              console.log("Updated CCU count");
                            redisController.getAppUsersArray(filterKeys,(appUsersArray)=>{
                                 mysqlController.insertIntoUsersLogs(appUsersArray,(err,isUpdated)=>{
                                    if(err){
                                        console.log(err)
                                    }else{
                                      if(isUpdated){
                                        console.log("Updated All users");
                                        redisController.clearRedisKeys(filterKeys);
                                      }
                                    }
                                 });
                            });
                          }
                        }
                    });
                });               
            }
        });
    }
}