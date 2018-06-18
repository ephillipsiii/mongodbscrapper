// making the buttons work!
// scrape button
$('#scrape').on("click", function(){
    $.ajax({
        method: 'GET',
        url: '/scrape',
    }).done(function(data) {
        console.log(data)
        window.location= "/"
    })
});
//saving the article
$('.save').on('click', function(){
    var thisID = $(this).attr('data-id');
    $.ajax({
        method: "POST",
        url: '/articles/save/' + thisId
    }).done(function(data){
        window.location = '/'
    })
});
//delete article button
$('.delete').on('click', function(){
    var thisID = $(this).attr('data-id');
    $.ajax({
        method: 'POST',
        url: 'articles/delete/' + thisID
    }).done(function(data){
        window.location = '/saved'
    })
});
//save not button
$('.saveNote').on('click', function(){
    var thisID = $(this).attr('data-id');
    if(!$('#noteText' + thisID).val()) {
        alert("Enter a note to save")
    }else {
        $.ajax({
            method: 'POST',
            url: '/notes/save/' + thisID,
            data: {
                text: $('#noteText' + thisID).val()
            }
        }).done(function(data) {
            console.log(data);
            $('#noteText' + thisID).val("");
            $('.noteModal').modal('hide');
            window.location = '/saved';
        })
    }
});
//delete not button
$('.deleteNote').on('click', function(){
    var noteID = $(this).attr('data-note-id');
    var articleId = $(this).attr('data-article-id');
    $.ajax({
        method: 'DELETE',
        url: '/notes/delete/' + noteID + '/' + articleId
    }).done(function(data){
        console.log(data)
        $('.noteModal').modal('hide');
        window.location = '/saved'
    })
});