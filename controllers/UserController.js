var passport = require("passport");

module.exports = function(app, mongoose) {

    var User = mongoose.model("User");

    app.route("/signup")
        .get(function(req, res) {
            res.render("signup");
        })
        .post(function(req, res, next) {
            passport.authenticate('local-signup', function(err, user, info) {
                if (err) { return next(err) }
                if (!user) {
                    //return "not user"
                    //return res.redirect('/signup')
                    res.json({user: user.name});
                } else {
                    //return "user"
                    //res.redirect("/signin");
                    res.json({"foo1": "bar1"});
                }
            })(req, res, next);
        });

    app.route("/signin")
        .get(function(req, res) {
            res.render("signin");
        })
        .post(function(req, res, next) {
            passport.authenticate('local', function(err, user, info) {
                if (err) { 
                    return next(err); 
                }
                if (!user) {
                    //return res.redirect('/signin')
                    var tmp = {};
                    tmp["error_code"] = "1";
                    tmp["error_info"] = "Authentication failed";
                    console.log("Authentication failed");
                    res.json(tmp);
                }else{
                    req.logIn(user, function(err) {
                        if (err) { 
                            return next(err); 
                        }
                        var tmp = {};
                        tmp["error_code"] = "0";
                        tmp["error_info"] = "Authentication succeeded";
                        console.log("Authentication succeeded");
                        res.json(tmp);
//                        res.redirect('/blog');
                    });
                }
            })(req, res, next);
        });

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/signin');
    });

}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { 
        return next(); 
    }
    res.redirect('/signin')
}
