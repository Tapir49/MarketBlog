$(document).ready(function () {
    $.getJSON('/get_current_user').done(function (data) {
        if(data.message === "success") {
            $('#login').remove();
            $('#register').remove();
        } else {
            $('#logout').remove();
            $('#account').remove();
        }
    })
});