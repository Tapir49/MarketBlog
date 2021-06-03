function load_account(user) {
    $("#user_name").text(user.firstname);
    console.log(user.likes)
    user.likes.forEach((blog_post) => {
        $(`#saved_posts tbody`).append(`<tr id=${blog_post.post_id}>
<td class='bannerDiv'>${blog_post.banner}</td>
<td class='stateDiv'>${blog_post.state}</td>
<td class='municipalityDiv'>${blog_post.municipality}</td>
<td class='addressDiv'>${blog_post.address}</td>
<td class='postedDiv'>${blog_post.posted}</td>
<td class='typeDiv'>${blog_post.postType}</td>
<td class="unsave"><button class="btn btn-danger" value="${blog_post.post_id}" onclick="unsavePost(this.value)">Unsave Post</button></td>
</tr>`);
    })
}

$.getJSON('/get_current_user')
    .done(function (data) {
        if (data['message'] === "success") {
            load_account(data["data"]);
        }
    })

function unsavePost(id) {
    $.post("/unsave_post", {post_id: id})
        .done((data) => {
            console.log(data.message);
            location.reload()
        })
}

