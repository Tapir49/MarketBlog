function load_blogpost(blog_post) {
    if(!blog_post.group) {
        blog_post.group = "N/A"
    }
    $("#detail_table tbody")
        .append(`<tr><td>Banner</td><td>${blog_post.banner}</td></tr>`)
        .append(`<tr><td>Post Type</td><td>${blog_post.type}</td></tr>`)
        .append(`<tr><td>Municipality</td><td>${blog_post.municipality}</td></tr>`)
        .append(`<tr><td>Address</td><td>${blog_post.address}</td></tr>`)
        .append(`<tr><td>State</td><td>${blog_post.state}</td></tr>`)
        .append(`<tr><td>Region</td><td>${blog_post.region}</td></tr>`)
        .append(`<tr><td>Group</td><td>${blog_post.group}</td></tr>`)
        .append(idx =>  {
            const date = new Date(Date.parse(blog_post.posted))
            // just get the Y/M/D of the date
            // TODO: change to MM/DD/YYYY
            return `<tr><td>Posted</td><td>${date.toISOString().split('T')[0]}</td></tr>`})
    $("#details").append('<div class="btn-group w-100" id="bottom_buttons" role="group"></div>')
    $("#bottom_buttons").append(`<a class="btn btn-primary" href="${blog_post.link}">Link to post</a>`)
    $("#bottom_buttons").append(`<a class="btn btn-secondary" href="/archive">Back to archive</a>`)
    $("#bottom_buttons").append(`<a class="btn btn-primary" onclick="savePost()">Save post</a>`)

}

$(document).ready(function () {
    const query = window.location.search;
    const urlParams = new URLSearchParams(query);
    const blog_id = urlParams.get('blog_id');
    if (blog_id) {
        $.getJSON('/get_blog_post_by_id?blog_id=' + blog_id)
            .done((data) => {
                if (data["message"] === "success") {
                    const blog_post = data["data"];
                    load_blogpost(blog_post[0]);
                }
            })
    }
})

function savePost() {
    console.log($.get('/get_current_user'))
}