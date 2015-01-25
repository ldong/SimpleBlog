/*
$('#signup').on("click", function(event, data){
    $(this).text('clicked');
    $("#signupform").ajaxSubmit({url: 'server.php', type: 'post'})
    console.log(data);
    debugger;
    var s= data;
});

$('a.navbar-brand').on("click", function(event){
    $('.nav.navbar-nav > li').removeClass('active');
    $('.nav.navbar-nav > li:first-child').addClass('active');
    var text = $('.nav.navbar-nav > li:first-child').text();
    $('.span.text-muted.tpad.welcome-title').html('» My ' +text);
    $.get("/home", function(data,status){
        //alert("Data: " + data + "\nStatus: " + status);
        $(".page_content").html(data);
    });
});
*/
// this is the id of the form
$("#signupform").submit(function() {
    debugger;
//    $('#signup').text('clicked');
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
 //              alert(data); // show response from the php script.
           },
            error: function(res){
               console.log(res);
            }
         });

    return false; // avoid to execute the actual submit of the form.
});
