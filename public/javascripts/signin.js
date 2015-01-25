$("#signInCreate").on('click',function() {
    $.get("/signup", function(data,status){
      $('#signIn').text('Signup');//.addClass('active');
      //$('#signIn > a').text('Signup');//.addClass('active');
      $('span.text-muted.tpad.welcome-title').html('» My Signup');
      $(".page_content").html(data);
    });
    return false; // avoid to execute the actual submit of the form.
});
