`use strict`
const { queries } = require("./mysql_strings");
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
    insertIntoUsersLogs(userLogs) {  
        let perChunk = 1;
        let fullQuery;
        let iterations=(userLogs.length/perChunk),iteration=1;
        if(iterations==0) iterations=1;      
                
        let queryArray=[];
        let insertIntoUsersLogs="INSERT IGNORE INTO `user_logs`(`id`,`app_id`,`uts`,`sent`,`uid`,`auth_token`,`resource`,`v`,`app_info`,`sid`,`origin`,`version`,`platform`,`os_version`,`user_agent`,`api_version`,`build_number`,`date`,`year`,`month`,`day`,`hour`) VALUES";
        userLogs.map((userLog,index)=>{
            console.log({index});
            userLog=JSON.parse(userLog);
            let user={};
            if (userLog.hasOwnProperty('headers')) {
                let headers=userLog.headers;
                user.app_id=headers.app_id;         
                if(headers.authToken)user.auth_token=headers.authToken;
       
            }
            if (userLog.hasOwnProperty('body')) {
                let body=userLog.body;
                if(body.hasOwnProperty('appInfo')){
                    let appInfo=body.appInfo;
                    user.app_info=JSON.stringify(appInfo);
                    if(appInfo.uts)user.uts=appInfo.uts;
                    if(appInfo.uts)user.sent=appInfo.uts;
                    if(appInfo.authToken)user.auth_token=appInfo.authToken;
                    if(appInfo.resource)user.resource=appInfo.resource;                    
                    if(appInfo.resource)user.sid=appInfo.resource;                 
                    if(appInfo.origin)user.origin=appInfo.origin;  
                    if(appInfo.version)user.version=appInfo.version;  
                    if(appInfo.platform)user.platform=appInfo.platform;  
                    if(appInfo.osVersion)user.os_version=appInfo.osVersion;  
                    if(appInfo.apiVersion)user.api_version=appInfo.apiVersion;      
                    if(appInfo.build_number)user.build_number=appInfo.buildNumber;      
                }

                if(body.platform) user.platform=body.platform;
                if(body.osVersion) user.os_version=body.osVersion;  
                if(body.userAgent) user.user_agent=body.userAgent;
                if(body.authToken)user.auth_token=body.authToken;
                if(body.uid)user.uid=body.uid;
                if(body.resource)user.resource=body.resource;
                if(user.uts){
                    let dateStamp=new Date(user.uts);
                    user.date=dateStamp.toUTCString();
                    user.month=dateStamp.getMonth();
                    user.year=dateStamp.getFullYear();
                    user.day=dateStamp.getDate();
                    user.hour=dateStamp.getHours();
                    user.minute=dateStamp.getMinutes();
                }else{
                    let dateStamp=new Date();
                    user.date=dateStamp.toUTCString();
                    user.month=dateStamp.getMonth();
                    user.year=dateStamp.getFullYear();
                    user.day=dateStamp.getDate();
                    user.hour=dateStamp.getHours();
                    user.minute=dateStamp.getMinutes();
                }                
            }         
            
            let sqlValues=`(UUID(),'${user.app_id}','${user.uts}','${user.sent}','${user.uid?user.uid:''}','${user.auth_token?user.auth_token:''}','${user.resource?user.resource:''}','1','${user.app_info?user.app_info:null}','${user.sid?user.sid:null}','${user.origin?user.origin:null}','${user.version?user.version:null}','${user.platform?user.platform:null}','${user.os_version?user.os_version:null}','${user.user_agent?user.user_agent:null}','${user.api_version?user.api_version:null}','${user.build_number?user.build_number:null}','${user.date?user.date:null}','${user.year?user.year:null}','${user.month?user.month:null}','${user.day?user.day:null}','${user.hour?user.hour:null}')`;
            
            // if(index==0||index==(perChunk*iteration)){                
                if(index==0){   
                fullQuery=insertIntoUsersLogs+sqlValues;
            }else {                
                fullQuery=fullQuery+","+sqlValues;
            }
            
            if(index==((perChunk*iteration)-1)){                
                queryArray.push(fullQuery);
                fullQuery=undefined;
            }
        });        
        console.log(queryArray);        
    }
}