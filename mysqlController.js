`use strict`
const helper = require("./helper");
const {
    queries
} = require("./mysql_strings");
let mysqlStrings = require("./mysql_strings");

module.exports = {
    createTables: function () {
        logsPool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(mysqlStrings.queries.concurrentUsersCountTable, function (error, result) {
                connection.release();
                if (error) {
                    console.log(error);
                }
            });
        });
        logsPool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(mysqlStrings.queries.createUserLogs, function (error, result) {
                connection.release();
                if (error) {
                    console.log(error);
                }
            });
        })
    },
    insertIntoUsersCounter: (ccuArray, callback) => {
        let perChunk = 1000;
        let fullQuery;
        let ccuLogsAarray = helper.chunkArray(ccuArray, perChunk);
        ccuLogsAarray.map((ccuLogs, iteration) => {
            let insertIntoUsersCounterQuery = "INSERT IGNORE INTO `concurrent_user_count`(`id`,`app_id`,`uts`,`sent`,`date`,`year`,`month`,`day`,`hour`,`minute`,`users_count`) VALUES";
            ccuLogs.map((ccuLog, index) => {
                let date = new Date(parseInt(ccuLog.timestamp));
                ccuLog.uts = ccuLog.timestamp;
                ccuLog.sent = ccuLog.timestamp;
                ccuLog.date = date.toUTCString();
                ccuLog.year = date.getUTCFullYear();
                ccuLog.month = date.getUTCMonth();
                ccuLog.day = date.getUTCDate();
                ccuLog.hour = date.getUTCHours();
                ccuLog.minute = date.getUTCMinutes();

                let sqlValues = `(UUID(),'${ccuLog.app_id}','${ccuLog.uts}','${ccuLog.sent}','${ccuLog.date?ccuLog.date:null}','${ccuLog.year?ccuLog.year:null}','${ccuLog.month?ccuLog.month:null}','${ccuLog.day?ccuLog.day:null}','${ccuLog.hour?ccuLog.hour:null}','${ccuLog.minute?ccuLog.minute:null}','${ccuLog.count?ccuLog.count:0}')`;

                if (index == 0) {
                    fullQuery = insertIntoUsersCounterQuery + sqlValues;
                } else {
                    fullQuery = fullQuery + "," + sqlValues;

                }
            });
            logsPool.getConnection(function (err, connection) {
                if (err) throw err;
                connection.query(fullQuery, function (error, result) {
                    connection.release();
                    if (error) {
                        callback(error, false);
                    } else {


                        if (iteration == (ccuLogsAarray.length - 1)) {
                            callback(undefined, true);
                        }
                    }
                });
            });
        });
    },
    insertIntoUsersLogs: (appLogsArray, callback) => {
        appLogsArray.map((logs, j) => {
            let appLogs=logs.members;            
            let perChunk = 1000;          
            let usersLogsAarray = helper.chunkArray(appLogs, perChunk);
            usersLogsAarray.map((userLogs, iteration) => {
                let fullQuery;
                let insertIntoUsersLogs = "INSERT IGNORE INTO `user_logs`(`id`,`app_id`,`uts`,`sent`,`uid`,`auth_token`,`resource`,`v`,`app_info`,`sid`,`origin`,`version`,`platform`,`os_version`,`user_agent`,`api_version`,`build_number`,`date`,`year`,`month`,`day`,`hour`) VALUES";
                userLogs.map((userLog, index) => {              
                    userLog = JSON.parse(userLog);
                    let user = {};
                    user.app_info = JSON.stringify(userLog);
                    if (userLog.hasOwnProperty('headers')) {
                        let headers = userLog.headers;
                        user.app_id = headers.appid;
                        if (headers.authtoken) user.auth_token = headers.authtoken;
                    }
                    if (userLog.hasOwnProperty('body')) {
                        let body = userLog.body;
                        if (body.hasOwnProperty('appInfo')) {
                            let appInfo = body.appInfo;                            
                            if (appInfo.uts) user.uts = appInfo.uts;
                            if (appInfo.uts) user.sent = appInfo.uts;
                            if (appInfo.authToken) user.auth_token = appInfo.authToken;
                            if (appInfo.resource) user.resource = appInfo.resource;
                            if (appInfo.resource) user.sid = appInfo.resource;
                            if (appInfo.origin) user.origin = appInfo.origin;
                            if (appInfo.version) user.version = appInfo.version;
                            if (appInfo.platform) user.platform = appInfo.platform;
                            if (appInfo.osVersion) user.os_version = appInfo.osVersion;
                            if (appInfo.apiVersion) user.api_version = appInfo.apiVersion;
                            if (appInfo.build_number) user.build_number = appInfo.buildNumber;
                        }

                        if (body.platform) user.platform = body.platform;
                        if (body.osVersion) user.os_version = body.osVersion;
                        if (body.userAgent) user.user_agent = body.userAgent;
                        if (body.authToken) user.auth_token = body.authToken;
                        if (body.uid) user.uid = body.uid;
                        if (body.resource) user.resource = body.resource;
                        if (user.uts) {
                            let dateStamp = new Date(user.uts);
                            user.date = dateStamp.toUTCString();
                            user.month = dateStamp.getUTCMonth();
                            user.year = dateStamp.getUTCFullYear();
                            user.day = dateStamp.getUTCDate();
                            user.hour = dateStamp.getUTCHours();
                            user.minute = dateStamp.getUTCMinutes();
                        } else {
                            let dateStamp = new Date();
                            user.date = dateStamp.toUTCString();
                            user.month = dateStamp.getUTCMonth();
                            user.year = dateStamp.getUTCFullYear();
                            user.day = dateStamp.getUTCDate();
                            user.hour = dateStamp.getUTCHours();
                            user.minute = dateStamp.getUTCMinutes();
                        }
                    }

                    let sqlValues = `(UUID(),'${user.app_id}','${user.uts}','${user.sent}','${user.uid?user.uid:''}','${user.auth_token?user.auth_token:''}','${user.resource?user.resource:''}','1','${user.app_info?user.app_info:null}','${user.sid?user.sid:null}','${user.origin?user.origin:null}','${user.version?user.version:null}','${user.platform?user.platform:null}','${user.os_version?user.os_version:null}','${user.user_agent?user.user_agent:null}','${user.api_version?user.api_version:null}','${user.build_number?user.build_number:null}','${user.date?user.date:null}','${user.year?user.year:null}','${user.month?user.month:null}','${user.day?user.day:null}','${user.hour?user.hour:null}')`;

                    if (index == 0) {
                        fullQuery = insertIntoUsersLogs + sqlValues;
                    } else {
                        fullQuery = fullQuery + "," + sqlValues;
                    }
                });
                
                logsPool.getConnection(function (err, connection) {
                    if (err) throw err;
                    connection.query(fullQuery, function (error, result) {
                        connection.release();
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(fullQuery);
                            if (iteration == (usersLogsAarray.length - 1)) { 
                                console.log({iteration});
                                if (j == (appLogsArray.length - 1)) {
                                    callback(undefined, true);
                                }
                            }
                            
                        }
                    });
                });
                
            });

        });

    }
}