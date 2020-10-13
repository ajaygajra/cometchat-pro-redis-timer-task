module.exports = {
    queries: {               
        createUserLogs: "CREATE TABLE IF NOT EXISTS `user_logs` ("+
            "`id` varchar(255) NOT NULL,"+
            "`app_id` varchar(255) NOT NULL,"+
            "`uts` BIGINT,"+
            "`sent` BIGINT,"+
            "`uid` varchar(50) NOT NULL,"+
            "`auth_token` varchar(255) DEFAULT NULL,"+
            "`resource` varchar(255) DEFAULT NULL,"+
            "`v` smallint DEFAULT '1',"+
            "`app_info` JSON,"+
            "`sid` varchar(255) DEFAULT NULL,"+
            "`origin` varchar(255) DEFAULT NULL,"+
            "`version` varchar(15) DEFAULT NULL,"+
            "`platform` varchar(50) DEFAULT NULL,"+
            "`os_version` varchar(50) DEFAULT NULL,"+
            "`user_agent` varchar(50) DEFAULT NULL,"+
            "`api_version` varchar(50) DEFAULT NULL,"+
            "`build_number` varchar(50) DEFAULT NULL,"+
            "`date` varchar(50) DEFAULT NULL,"+
            "`year` smallint DEFAULT NULL,"+
            "`month` smallint DEFAULT NULL,"+
            "`day` smallint DEFAULT NULL,"+
            "`hour` smallint DEFAULT NULL,"+
            "KEY `id` (`id`),"+
            "KEY `app_id` (`app_id`),"+
            "KEY `uid` (`uid`),"+            
            "KEY `auth_token` (`auth_token`),"+
            "KEY `resource` (`resource`),"+
            "KEY `origin` (`origin`),"+
            "KEY `platform` (`platform`),"+
            "KEY `user_agent` (`user_agent`),"+
            "KEY `api_version` (`api_version`),"+
            "KEY `sent` (`sent`),"+
            "KEY `uts` (`uts`),"+
            "KEY `date` (`date`),"+
            "KEY `app_id_uid` (`app_id`,`uid`),"+
            "KEY `app_id_auth_token` (`app_id`,`auth_token`),"+
            "KEY `app_id_api_version` (`app_id`,`api_version`),"+
            "KEY `app_id_resource` (`app_id`,`resource`),"+
            "KEY `app_id_date` (`app_id`,`date`),"+
            "KEY `app_id_sent` (`app_id`,`sent`),"+
            "KEY `app_id_uid_auth_token` (`app_id`,`uid`,`auth_token`),"+
            "KEY `app_id_uid_resource` (`app_id`,`uid`,`resource`),"+
            "KEY `app_id_resource_auth_token` (`app_id`,`resource`,`auth_token`),"+
            "KEY `year_month_day_hour` (`year`,`month`,`day`,`hour`),"+
            "KEY `uts_year_month_day_hour` (`uts`,`year`,`month`,`day`,`hour`),"+
            "KEY `app_id_uts_year_month_day_hour` (`app_id`,`uts`,`year`,`month`,`day`,`hour`),"+
            "UNIQUE (`app_id`,`resource`,`auth_token`,`year`,`month`,`day`,`hour`) ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;",
        concurrentUsersCountTable:"CREATE TABLE IF NOT EXISTS `concurrent_user_count` ("+
            "`id` varchar(255) NOT NULL,"+
                "`app_id` varchar(255) NOT NULL,"+
                "`uts` BIGINT ,"+
                "`sent` BIGINT ,"+
                "`date` varchar(50) DEFAULT NULL,"+
                "`year` smallint DEFAULT NULL,"+
                "`month` smallint DEFAULT NULL,"+
                "`day` smallint DEFAULT NULL,"+
                "`hour` smallint DEFAULT NULL,"+
                "`minute` smallint DEFAULT NULL,"+
                "`users_count` bigint,"+
                "key(`app_id`),key(`date`),key(`sent`),key(`uts`),key(`year`),key(`users_count`),"+
                "key `year_month`(`year`,`month`),key`app_id_date`(`app_id`,`date`),key`app_id_year`(`app_id`,`year`),key`app_id_month`(`app_id`,`month`),"+
                "key `app_id_sent`(`app_id`,`sent`),key`app_id_uts`(`app_id`,`uts`),"+
                "key `year_month_hour`(`year`,`month`,`hour`),key `app_id_year_month`(`app_id`,`year`,`month`),key `app_id_year_month_day`(`app_id`,`year`,`month`,`day`),key `app_id_year_month_day_hour`(`app_id`,`year`,`month`,`day`,`hour`),key `app_id_year_month_day_hour_minute`(`app_id`,`year`,`month`,`day`,`hour`,`minute`),"+
                "key `app_id_year_month_hour`(`app_id`,`year`,`month`,`hour`), "+
                "UNIQUE (`app_id`,`year`,`month`,`day`,`hour`,`minute`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;"
    },
}