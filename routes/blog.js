var express = require('express');
var router = express.Router();

function print_call_stack() {
      var stack = new Error().stack;
        console.log("PRINTING CALL STACK");
          console.log( stack );
}

/* GET home page. */
router.get('/blog', function(req, res) {
  //console.debug('index.js');
  res.render('blog', { title: 'blog' });
  //res.render('index', { title: 'Index' });
});

module.exports = router;
