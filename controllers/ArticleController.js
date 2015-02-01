var passport = require("passport"),
    utils = require("../lib/utils"),
    Q = require("Q"),
    async = require('async');

// var Tag = require("../model/tag");
module.exports = function(app, mongoose) {

    var Article = mongoose.model("Article");
    var Tag = mongoose.model("Tag");

    app.get("/new_blog", ensureAuthenticated, function(req, res, next) {
        var data = {};
        data['tags'] = [];
        data['totalTags'] = 0
        Tag.find({}, function(err, alltags) {
            alltags.forEach(function(onetag) {
                data['tags'].push({name:onetag.name,numberOf:onetag.numberOf});
                data['totalTags'] += onetag.numberOf;
            });
            console.log(data);
            res.render("article-new", {
                 data: data
            });
        });
    });

    app.post("/article/create", ensureAuthenticated, function(req, res) {
        var errInfo='';
        var title = req.body.title;
        var content = req.body.content;
        console.log('-----Made it here');
        var tags = [];
        if(req.body.tag != "")
          tags = req.body.tag.split(/[\s|,]/g).filter(function(n){ return n !== undefined && n!=''; });;

        var articleModel = new Article();
        articleModel.title = title;
        articleModel.content = content;
        articleModel.author = "anonymous";
        articleModel.tags = tags;

        var data = {};
        req.data = data;
        data['tags'] = [];
        data['totalTags'] = 0;
        data['article_err'] = {};
        data['tags_err'] = [];
        articleModel.save(function(err, articleReturnData) {
          if (err) {
              var article_err = {};
              article_err["error_code"] = "1";
              article_err["error_info"] = "Article create failed: " + err;
              data['article_err'] = article_err;              
              console.log("Article create failed: " + err);
              res.json(data);
          } else {
              var article_err = {};
              article_err["error_code"] = "0";
              article_err["error_info"] = "Article created successfully";
              article_err["article_id"] = articleReturnData._id;
              data['article_err'] = article_err;              
 
              var tagLength = tags.length;
              var id = articleReturnData._id;
              async.each(tags, function(tag, callback){
                  Tag.findOne({name: tag}, function(err, tagData) {
                      console.log('=====tags[index]:===='+tag);
                      var tag_err = {};
                      tag_err['id'] = tag;
                      if (err) {
                          tag_err['error_code'] = 1;
                          tag_err['error_info'] = err;
                          data['tags_err'].push(tag_err);
                      } else {
                          if(!tagData) {
                              tagData = new Tag();
                              tagData.name = tag;
                              tagData.numberOf = 1;
                              tagData.articles = [id];
                          }else{
                              tagData.numberOf += 1;
                              tagData.articles.push(id);
                          }
                          tagData.save(function(err) {
                              if(!err) {
                                  tag_err['error_code'] = 0;
                                  tag_err['error_info'] = err;
                              }
                              else {
                                  tag_err['error_code'] = 1;
                                  tag_err['error_info'] = tagData.numberOf;
                              }
                              data['tags_err'].push(tag_err);
                              tagLength--;
                              if(tagLength == 0){
                                  callback(data);    
                              }
                          });
                      }
                  });
              }, function(err){
                  console.log(data);
                  res.json(data);

              });
              console.log('=====all done ===');
           }
       })
       // all error info will be saved in tmp 
    });

    // app.post("/article/create", ensureAuthenticated, function(req, res) {
    //     var errInfo='';
    //     var title = req.body.title;
    //     var content = req.body.content;
    //     console.log('-----Made it here');
    //     var tags = [];
    //     if(req.body.tag != "")
    //       tags = req.body.tag.split(/[\s|,]/g).filter(function(n){ return n !== undefined && n!=''; });;
    //     debugger;

    //     var articleModel = new Article();
    //     articleModel.title = title;
    //     articleModel.content = content;
    //     articleModel.author = "anonymous";
    //     articleModel.tags = tags;

    //     var tmp = {};
    //     tmp['article_err'] = {};
    //     tmp['tags_err'] = [];
    //     articleModel.save(function(err, articleReturnData) {
    //       if (err) {
    //           var article_err = {};
    //           article_err["error_code"] = "1";
    //           article_err["error_info"] = "Article create failed: " + err;
    //           tmp['article_err'] = article_err;              
    //           console.log("Article create failed: " + err);
    //           debugger;
    //           res.json(tmp);
    //       } else {
    //           var article_err = {};
    //           article_err["error_code"] = "0";
    //           article_err["error_info"] = "Article created successfully";
    //           article_err["article_id"] = articleReturnData._id;
    //           tmp['article_err'] = article_err;              
    //           debugger;
    //        
    //           console.log("article " + articleReturnData._id + " save successfully");
    //           // Fix me!!! should use promise instead
    //           var id = articleReturnData._id;
    //           for(var i=0; i<tags.length; ++i){
    //             (function(tags, id, i, tmp){
    //               Tag.findOne({name: tags[i]}, function(err, tagData) {
    //                   console.log('=====index:===='+i);
    //                   console.log('=====tags[index]:===='+tags[i]);
    //                   var tag_err = {};
    //                   tag_err['id'] = tags[i];
    //                   if (err) {
    //                       tag_err['error_code'] = 1;
    //                       tag_err['error_info'] = err;
    //                   } else {
    //                       if(!tagData) {
    //                           tagData = new Tag();
    //                           tagData.name = tags[i];
    //                           tagData.numberOf = 1;
    //                           tagData.articles = [id];
    //                       }else{
    //                           tagData.numberOf += 1;
    //                           tagData.articles.push(id);
    //                       }
    //                       tagData.save(function(err) {
    //                           if(!err) {
    //                               tag_err['error_code'] = 0;
    //                               tag_err['error_info'] = err;
    //                           }
    //                           else {
    //                               tag_err['error_code'] = 1;
    //                               tag_err['error_info'] = tagData.numberOf;
    //                           }
    //                       });
    //                   }
    //                   tmp['tags_err'].push(tag_err);
    //               });
    //             })(tags, id, i, tmp);
    //           }
    //           //res.json(tmp);
    //        }
    //    })
    //    // all error info will be saved in tmp 
    // });

    // app.post("/article/create", ensureAuthenticated, function(req, res) {
    //     var title = req.body.title;
    //     var content = req.body.content;
    //     console.log('-----Made it here');
    //     var tags = [];
    //     if(req.body.tag != "")
    //       tags = req.body.tag.split(/[\s+|,]/g);

    //     var articleModel = new Article();
    //     articleModel.title = title;
    //     articleModel.content = content;
    //     articleModel.author = "anonymous";
    //     articleModel.tags = tags;

    //     articleModel.save(function(err, articleReturnData) {
    //       if (err) {V
    //           var tmp = {};
    //           tmp["error_code"] = "1";
    //           tmp["error_info"] = "Article create failed: " + err;
    //           console.log("Article create failed: " + err);
    //           res.json(tmp);
    //       } else {
    //           var tmp = {};
    //           tmp["error_code"] = "0";
    //           tmp["error_info"] = "Article created successfully";
    //           tmp["article_id"] = articleReturnData._id;
    //           console.log("article " + articleReturnData._id + " save successfully");
    //           res.json(tmp);
    //           // Fix me!!! should use promise instead
    //           // var id = articleReturnData._id;
    //           // for(var i=0; i<tags.length; ++i){
    //           //     (function(index){ // use closure to encapsulate the data
    //           //         Tag.findOne({"name": tags[index]}, function(err, tagReturnData) {
    //           //             console.log('=====index:===='+index);
    //           //             console.log('=====tags[index]:===='+tags[index]);
    //           //             if (err) {
    //           //                 res.render("error", {err: err});
    //           //             } else {
    //           //                 // tag does not exist
    //           //                 console.log(tagReturnData);
    //           //                 if(tagReturnData == null){
    //           //                     var tagModel = new Tag();
    //           //                     tagModel.name = tags[index];// || "I DEFINED";
    //           //                     debugger;
    //           //                     tagModel.numberOf = 1;
    //           //                     tagModel.save(function(err, tagSaveData) {
    //           //                         if (err) {
    //           //                             res.render("error", {err: err});
    //           //                         } else {
    //           //                             var tmp = {};
    //           //                             tmp[tagSaveData.name] = tagSaveData.numberOf;
    //           //                             console.log(tmp);
    //           //                             //res.json(tmp);
    //           //                         }
    //           //                     }); 
    //           //                 } else {
    //           //                     tagReturnData.numberOf += 1;
    //           //                     debugger;
    //           //                     tagReturnData.save(function(err, tagSaveData){
    //           //                         if (err) {
    //           //                             res.render("error", {err: err});
    //           //                         } else {                                  
    //           //                             var tmp = {};
    //           //                             tmp[tagSaveData.name] = tagSaveData.numberOf;
    //           //                             console.log(tmp);
    //           //                             //res.json(tmp);    
    //           //                         }
    //           //                     });
    //           //                 }
    //           //             }
    //           //         });//findOne
    //           //     })(i);
    //           // }//for
    //       }//else
    //    })
    // });

    // app.post("/article/create", ensureAuthenticated, function(req, res) {
    //     var title = req.body.title;
    //     var content = req.body.content;
    //     console.log('-----Made it here');
    //     var tags = [];
    //     if(req.body.tag != "")
    //       tags = req.body.tag.split(/[\s|,]/g).filter(function(n){ return n !== undefined && n!=''; });;

    //     var articleModel = new Article();
    //     articleModel.title = title;
    //     articleModel.content = content;
    //     articleModel.author = "anonymous";
    //     articleModel.tags = tags;

    //     var allTags = [];
    //     for(var i=0; i<tags.length; ++i){
    //         allTags.push({'name':tags[i]});
    //     }

    //     debugger;
    //     Tag.create(allTags, function(err){
    //         if(err){
    //           debugger; 
    //         }else{
    //         
    //              debugger;
    //              articleModel.save(function(err, articleReturnData) {
    //                if (err) {
    //                    var tmp = {};
    //                    tmp["error_code"] = "1";
    //                    tmp["error_info"] = "Article create failed: " + err;
    //                    console.log("Article create failed: " + err);
    //                    res.json(tmp);
    //                } else {
    //                    var tmp = {};
    //                    tmp["error_code"] = "0";
    //                    tmp["error_info"] = "Article created successfully";
    //                    tmp["article_id"] = articleReturnData._id;
    //                    console.log("article " + articleReturnData._id + " save successfully");
    //                    res.json(tmp);
    //                }//else
    //            }); //article.model.save
    //         }
    //     });
    // });

    app.get("/article/:id", function(req, res) {
        var id = req.params.id;
        Article.findOne({"_id": id}, function(err, article) {
          var data = {};
          data['tags'] = [];
          data['totalTags'] = 0
          if (err) {
              data["error_code"] = "1";
              data["error_info"] = "Couldn't get article: " + err;
              console.log("Couldn't get article: " + err);
              res.json(tmp);
          } else {
              data['articleInfo'] = article;
              Tag.find({}, function(err, alltags) {
                  alltags.forEach(function(onetag) {
                      data['tags'].push({name:onetag.name,numberOf:onetag.numberOf});
                      data['totalTags'] += onetag.numberOf;
                  });
                  console.log(data);
                  res.render("article-detail", {
                       data: data
                  });
              });
                 // console.log(data);
                 // res.render("article-detail", {
                 //      articleInfo: data
                 // });
          }
        });
        //   } else {
        //       // var tmp = {};
        //       // tmp["error_code"] = "0";
        //       // tmp["error_info"] = "Article created successfully";
        //       // tmp["article"] = articleInfo;
        //       // console.log("Successfully retrieved article: " + id);
        //       // res.json(tmp);
        //       console.log(data);
        //       res.render("article-detail", {
        //            articleInfo: data
        //       });
        //   }
        // });
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
