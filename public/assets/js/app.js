// making the buttons work!
// scrape button
$("#scrape").on("click", function(){
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).done(function(data) {
        console.log(data)
        window.location= "/"
    })
});
//Set clicked nav option to active
$(".navbar-nav li").click(function() {
    $(".navbar-nav li").removeClass("active");
    $(this).addClass("active");
 });

//saving the article
$(".save").on("click", function(){
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/save/" + thisId
    }).done(function(data){
        window.location = "/"
    })
});
//delete article button
$(".delete").on("click", function(){
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/delete/" + thisId
    }).done(function(data){
        window.location = "/savedArticles"
    })
});
//save not button
$(".addNote").on("click", function(){
    var thisId = $(this).attr("data-id");
    if(!$("#noteText" + thisId).val()) {
        alert("Enter a note to save")
        $('#noteModal').modal('show');

    }else {
        
        $.ajax({
            method: "POST",
            url: "/notes/save/" + thisId,
            data: {
                text: $("#noteText" + thisId).val()
            }
        }).done(function(data) {
            console.log(data);
            $("#noteText" + thisId).val("");
            $(".modalNote").modal("hide");
            window.location = "/savedArticles";
        })
    };
});
//delete not button
$(".deleteNote").on("click", function(){
    var noteId = $(this).attr("data-note-id");
    var articleId = $(this).attr("data-article-id");
    $.ajax({
        method: "DELETE",
        url: "/notes/delete/" + noteId + "/" + articleId
    }).done(function(data){
        console.log(data)
        $(".noteModal").modal("hide");
        window.location = "/savedArticles"
    })
});