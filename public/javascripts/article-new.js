// this is the id of the form
$("#createArticleForm").submit(function() {
    var url = "/article/create"; // the script where you handle the form input.

    $.ajax({
           type: "POST",
           url: url,
           data: $("#createArticleForm").serialize(), // serializes the form's elements.
           success: function(res){
              //alert('sucess created article 232');
              alert(res.error_info);
              console.log('success created articlei  111')
              $('span.text-muted.tpad.welcome-title').text('» My new article');
              $.get("/article/"+res.article_id, function(data, status){
                  //alert("Data: " + data + "\nStatus: " + status);
                  $(".page_content").html(data);
              });
           },
            error: function(res){
               console.log(res);
               alret(res.error_info);
            }
         });

    return false; // avoid to execute the actual submit of the form.
});
