var crypto = require("crypto");
var Q = require("q");

var utils = {
    connectToDatabase:function (mongoose, config, cb) {
        var dbPath;

        dbPath = "mongodb://" + config.USER + ":";
        dbPath += config.PASS + "@";
        dbPath += config.HOST + ((config.PORT.length > 0) ? ":" : "");
        dbPath += config.PORT + "/";
        dbPath += config.DATABASE;
        return mongoose.connect(dbPath, cb);
    },
    ensureAuthenticated: function(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.redirect('/signin')
    },
    toMd5: function(pwd, cb) {
        return crypto.createHash('md5').update(pwd).digest('hex');
    },

    // `condition` is a function that returns a boolean
    // `body` is a function that returns a promise
    // returns a promise for the completion of the loop
    promiseWhile: function (condition, body) {
        var done = Q.defer();
    
        function loop() {
            // When the result of calling `condition` is no longer true, we are
            // done.
            if (!condition()) return done.resolve();
            // Use `when`, in case `body` does not return a promise.
            // When it completes loop again otherwise, if it fails, reject the
            // done promise
            Q.when(body(), loop, done.reject);
        }
    
        // Start running the loop in the next tick so that this function is
        // completely async. It would be unexpected if `body` was called
        // synchronously the first time.
        Q.nextTick(loop);
    
        // The promise
        return done.promise;
    }
};
module.exports = utils;
