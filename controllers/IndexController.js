module.exports = function(app) {

    var jade = require('jade')
    app.get("/", function(req, res) {
        res.render("index",{
            page_title: "Home",
        });
    });
    app.get("/index", function(req, res) {
        res.render("index",{
            page_title: "Home",
        });
    });
    app.get("/home", function(req, res) {
        res.render("carousel",{
            page_title: "Home",
        });
    });

    // app.post("/signin", function(req, res) {
    //    res.json({message: "Sigin post request"});
    // });

    // app.get("/user/:id", function(req, res) {
    //    var id = req.params.id;
    //     res.json({userid: id});
    // });

    // app.post("/user/create", function(req, res) {
    //    var id = req.body.id;
    //     res.json({user: id});
    // });
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/signin')
}
