var passport = require("passport");

module.exports = function(app, mongoose) {

    var Article = mongoose.model("Article");
    var Tag = mongoose.model("Tag");

    app.get("/new_blog", ensureAuthenticated, function(req, res, next) {
        res.render("article-new");
    });

    app.post("/article/create", ensureAuthenticated, function(req, res) {
        var title = req.body.title;
        var content = req.body.content;
        console.log('-----Made it here');
        debugger;
        var tags = req.body.tag.split(/[\s+|,]/g);
        var articleModel = new Article();
        articleModel.title = title;
        articleModel.content = content;
        articleModel.author = "anonymous";
        articleModel.tag = tags;
        articleModel.save(function(err, data) {
            if (err) {
                res.render("error", {err: err});
            } else {
                var id = data._id;
                for(tag in tags){
                  Tag.findOne({"name": tag}, function(err, data) {
                      if (err) {
                         var tagModel = new Tag();
                         tagModel.name = tag;
                         tagModel.numberOf = 1;
                         tagModel.save(function(err, tagData) {
                             if (err) {
                                 res.render("error", {err: err});
                             } else {
                                res.redirect("/article/show/" + id);
                             }
                         });
                      }else{
                         data.numberOf += 1;
                         data.save(function(err, tagData){
                             if (err) {
                                 res.render("error", {err: err});
                             } else {
                                res.redirect("/article/show/" + id);
                             }
                         });
                      }
                  });//findOne
                }//for
            }//else
        })
    });

    app.get("/blog/show/:id", function(req, res) {
        var id = req.params.id;
        Article.findOne({"_id": id}, function(err, data) {
            if (err) {
                res.render("error", {err: err});
            } else {
                res.render("article-detail", {
                    articleInfo: data
                });
            }
        })
    });
}

function ensureAuthenticated(req, res, next) {
    return next();
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/signin')
}
