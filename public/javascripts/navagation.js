$('.nav.navbar-nav > li').on("click", function(event){
    $('.nav.navbar-nav > li').removeClass('active');
    $(this).addClass('active');
    var text = $(this).text();
    $('span.text-muted.tpad.welcome-title').html('» My ' +text);
    $.get("/"+text.toLowerCase().match(/\S+/g).join('_'), function(data,status){
        //alert("Data: " + data + "\nStatus: " + status);
        $(".page_content").html(data);
        console.log(text.toLowerCase())
    });

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

