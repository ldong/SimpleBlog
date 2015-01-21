
var passport = require("passport");

module.exports = function(app, mongoose) {

    //app.get("/blog", ensureAuthenticated, function(req, res, next) {
    app.get("/blog", function(req, res) {
        res.render("blog", {
            page_title: "Blog"
        });
        // if (err) {
        //     res.render("error", {err: err});
        // } else {
        //     res.render("blog", {
        //         title: "blog"
        //     });
        // }
    });

    // app.get("/blog/new", ensureAuthenticated, function(req, res, next) {
    //     res.render("blog-new");
    // });

    // app.post("/blog/create", ensureAuthenticated, function(req, res) {
    //     var title = req.body.title;
    //     var content = req.body.content;
    //     var blogModel = new Article();
    //     blogModel.title = title;
    //     blogModel.content = content;
    //     blogModel.author = "anonymous";
    //     blogModel.save(function(err, data) {
    //         if (err) {
    //             res.render("error", {err: err});
    //         } else {
    //             var id = data._id;
    //             res.redirect("/blog/show/" + id);
    //         }
    //     })
    // });

    // app.get("/blog/show/:id", function(req, res) {
    //     var id = req.params.id;
    //     Article.findOne({"_id": id}, function(err, data) {
    //         if (err) {
    //             res.render("error", {err: err});
    //         } else {
    //             res.render("blog-detail", {
    //                 blogInfo: data
    //             });
    //         }
    //     })
    // });
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/signin')
}
