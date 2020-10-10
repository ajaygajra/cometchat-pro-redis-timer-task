const helper = require("./helper");

module.exports = {
    getCCUFromRedis: function (keys, callback) {
        let i = 0;
        let ccuArray = [];
        keys.map(key => {
            redisClient.scard(key, function (error, count) {

                ccuArray.push({
                    key,
                    count,
                    ...helper.explodeOnlineUsersKey(key)
                });
                i++;
                if (i == keys.length) {
                    callback(ccuArray);
                }
            });
        });
    },
    getAppUsersArray: function (keys, callback) {
        let i = 0;
        let appUsersArray = [];
        keys.map(key => {

            redisClient.smembers(key, function (error, members) {
                appUsersArray.push({
                    key,
                    members
                });
                i++;
                if (i == keys.length) {
                    callback(appUsersArray);
                }
            });

        });
    },
    clearRedisKeys: function (keys) {
        keys.map(key => {
            redisClient.del(key)
        });

    }

}