$("#signInCreate").on('click',function() {
    $.get("/signup", function(data,status){
      $('#signIn').text('Signup');//.addClass('active');
      //$('#signIn > a').text('Signup');//.addClass('active');
      $('span.text-muted.tpad.welcome-title').html('» My Signup');
      $(".page_content").html(data);
    });
    return false; // avoid to execute the actual submit of the form.
});

$("#signInSubmit").on('click',function() {
    var url = "/signin"; // the script where you handle the form input.

    $.ajax({
           type: "POST",
           url: url,
           data: $("#signInForm").serialize(), // serializes the form's elements.
           success: function(res){
              //alert('sucess created article 232');
              if(res.error_code != 0){
                alert(res.error_info);
              }else{
                console.log('success logged in');

                $('span.text-muted.tpad.welcome-title').text('» My blog');
                $.get("/blog", function(data, status){
                    //alert("Data: " + data + "\nStatus: " + status);
                    $(".page_content").html(data);
                });
              $('ul.nav.navbar-nav.navbar-right.col-sm-3').append('<li><a id="welcome" href="#">Welcome '+$('#email').val()+'</a></li><li class="pull-right"><a id="newBlog" href="#">New blog</a></li>');
            
$('#newBlog').on("click", function(event){
    console.log('newblog click');
    $('.nav.navbar-nav > li').removeClass('active');
    $(this).addClass('active');
    $(this).text('New Blog');
    $('span.text-muted.tpad.welcome-title').html('» My New Blog');
    $.get("/new_blog", function(data,status){
        $(".page_content").html(data);
    });

});
              $('#signIn').text('logout');
              }
           },
            error: function(res){
               console.log(res);
               alret(res.error_info);
            }
         });

    return false; // avoid to execute the actual submit of the form.
});
