var pg = require("pg");

module.exports.createSpawnTable = function() {
    if (!process.env.DATABASE_URL) {
        return;
    }
    var createTableCommand = "CREATE TABLE spawn (" + 
        "spawned timestamp DEFAULT current_timestamp NOT NULL, userid text NOT NULL, item text NOT NULL); " +
        "CREATE INDEX ON spawn (userid);" +
        "CREATE INDEX ON spawn (item);";
    pg.connect(process.env.DATABASE_URL, function(connectError, client, close) {
        if (connectError) {
            console.error("Error connecting to database: ", connectError);
            return;
        }
        client.query(createTableCommand, function(queryError, result) {
            close();
            if (queryError) {
                console.error("Error creating table", queryError); 
            } else {
                console.log("Created spawn table");
            }
        });
    });
};

module.exports.insertSpawn = function(userid, item) {
    if (!process.env.DATABASE_URL) {
        return;
    }
    var insertCommand = "INSERT INTO spawn (userid, item) values ($1, $2)";
    pg.connect(process.env.DATABASE_URL, function(connectError, client, close) {
        if (connectError) {
            console.error("Error connecting to database: ", connectError);
            return;
        }
        client.query({
            "text": insertCommand,
            "values": [userid, item]
        }, function(queryError, result) {
            close();
            if (queryError) {
                console.error("Error inserting into spawn table", queryError); 
            } 
        });
    });
}

module.exports.getSpawnsByUser = function(userid) {
    if (!process.env.DATABASE_URL) {
        return;
    }
    var selectCommand = "SELECT * FROM spawn WHERE userid = $1";
    pg.connect(process.env.DATABASE_URL, function(connectError, client, close) {
        if (connectError) {
            console.error("Error connecting to database: ", connectError);
            return;
        }
        client.query({
            "text": selectCommand,
            "values": [userid]
        }, function(queryError, result) {
            close();
            console.log("Query result for " + userid, result);
            if (queryError) {
                console.error("Error selecting from spawn table", queryError); 
            } else {
                return result.rows;
            } 
        });
    });
}