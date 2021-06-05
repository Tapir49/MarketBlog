// fill in any existing information for the blog post
function fillPost(blog_post) {
    const date = new Date(Date.parse(blog_post.posted)).toISOString().split('T')[0]

    console.log(blog_post)
    $('#state').val(blog_post.state);
    $('#municipality').val(blog_post.municipality);
    $('#address').val(blog_post.address);
    $('#banner').val(blog_post.banner);
    $('#posted').val(date);
    $('#type').val(blog_post.type);
    $('#region').val(blog_post.region);
    $('#group').val(blog_post.group);
    $('#link').val(blog_post.link);

}

// handles error and data from rejected insertion
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const error = JSON.parse(urlParams.get("error"));
const blog_post = JSON.parse(urlParams.get("input"));
if (error) {
    console.log(error);
    fillPost(blog_post);
}

// code to edit preexisting blog post
const blog_id = urlParams.get("blog_id");
console.log(blog_id);
if (blog_id) {
    console.log(blog_id)
    $.getJSON(`/get_blog_post_by_id?blog_id=${blog_id}`)
        .done((data) => {
            if (data.message === 'success') {
                console.log("here")
                fillPost(data.data[0])
            }
        })
}

$('form').on('submit', function () {
    if (blog_id) {
        $('form').append(function () {
            const input = $('<input/>')
                .attr("name", "blog_id")
                .attr("value", blog_id)
            return input
        })
    }
});