var passport = require("passport");
// var Tag = require("../model/tag");
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
        var tags = [];
        if(req.body.tag != "")
          tags = req.body.tag.split(/[\s+|,]/g);

        var articleModel = new Article();
        articleModel.title = title;
        articleModel.content = content;
        articleModel.author = "anonymous";
        articleModel.tags = tags;

        articleModel.save(function(err, articleReturnData) {
          if (err) {V
              var tmp = {};
              tmp["error_code"] = "1";
              tmp["error_info"] = "Article create failed: " + err;
              console.log("Article create failed: " + err);
              res.json(tmp);
          } else {
              var tmp = {};
              tmp["error_code"] = "0";
              tmp["error_info"] = "Article created successfully";
              tmp["article_id"] = articleReturnData._id;
              console.log("article " + articleReturnData._id + " save successfully");
              res.json(tmp);
              // Fix me!!! should use promise instead
              // var id = articleReturnData._id;
              // for(var i=0; i<tags.length; ++i){
              //     (function(index){ // use closure to encapsulate the data
              //         Tag.findOne({"name": tags[index]}, function(err, tagReturnData) {
              //             console.log('=====index:===='+index);
              //             console.log('=====tags[index]:===='+tags[index]);
              //             if (err) {
              //                 res.render("error", {err: err});
              //             } else {
              //                 // tag does not exist
              //                 console.log(tagReturnData);
              //                 if(tagReturnData == null){
              //                     var tagModel = new Tag();
              //                     tagModel.name = tags[index];// || "I DEFINED";
              //                     debugger;
              //                     tagModel.numberOf = 1;
              //                     tagModel.save(function(err, tagSaveData) {
              //                         if (err) {
              //                             res.render("error", {err: err});
              //                         } else {
              //                             var tmp = {};
              //                             tmp[tagSaveData.name] = tagSaveData.numberOf;
              //                             console.log(tmp);
              //                             //res.json(tmp);
              //                         }
              //                     }); 
              //                 } else {
              //                     tagReturnData.numberOf += 1;
              //                     debugger;
              //                     tagReturnData.save(function(err, tagSaveData){
              //                         if (err) {
              //                             res.render("error", {err: err});
              //                         } else {                                  
              //                             var tmp = {};
              //                             tmp[tagSaveData.name] = tagSaveData.numberOf;
              //                             console.log(tmp);
              //                             //res.json(tmp);    
              //                         }
              //                     });
              //                 }
              //             }
              //         });//findOne
              //     })(i);
              // }//for
          }//else
       })
    });

    app.get("/article/:id", function(req, res) {
        var id = req.params.id;
        Article.findOne({"_id": id}, function(err, data) {
          if (err) {
              var tmp = {};
              tmp["error_code"] = "1";
              tmp["error_info"] = "Couldn't get article: " + err;
              console.log("Couldn't get article: " + err);
              res.json(tmp);
          } else {
              // var tmp = {};
              // tmp["error_code"] = "0";
              // tmp["error_info"] = "Article created successfully";
              // tmp["article"] = articleInfo;
              // console.log("Successfully retrieved article: " + id);
              // res.json(tmp);
              res.render("article-detail", {
                   articleInfo: data
              });
          }
        });
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
