// this is the id of the form
$("#signupform").submit(function() {
    var url = "/signup"; // the script where you handle the form input.

    $.ajax({
           type: "POST",
           url: url,
           data: $("#signupform").serialize(), // serializes the form's elements.
           success: function(res)
           {
              $.get("/signin", function(data,status){
                  $('#signIn').addClass('active').text('Signin' );
                  $('span.text-muted.tpad.welcome-title').html('» My sign in');
                  $(".page_content").html(data);
              });
           },
            error: function(res){
               console.log(res);
            }
         });

    return false; // avoid to execute the actual submit of the form.
});
