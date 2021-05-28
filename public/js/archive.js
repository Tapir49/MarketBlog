let blogList = []
function showList(blog_posts) {
    console.log("showing list")

    $("#blog_list").empty();

    for (let i = 0; i < blog_posts.length; i++){
        $('#blog_list').append("<li class='list-group-item'></li>");
    }

    $('#blog_list li')
        .attr("value", function (idx){
            return blog_posts[idx]._id;
        })
        .append("<div class='row'></div>");
    $('#blog_list .row')
        .append("<div class='col-1 stateDiv'></div>")
        .append("<div class='col-2 municipalityDiv'></div>")
        .append("<div class='col-2 addressDiv'></div>")
        .append("<div class='col-1 bannerDiv'></div>")
        .append("<div class='col-2 postedDiv'></div>")
        .append("<div class='col-1 typeDiv'></div>")
        .append("<div class='col-1 regionDiv'></div>")
        .append("<div class='col-1 groupDiv'></div>")
        .append("<div class='col-1 linkDiv'></div>")

    $('.stateDiv').append(idx => {
        return `<p>${blog_posts[idx].state}</p>`
    });

    $('.municipalityDiv').append(idx => {
        return `<p>${blog_posts[idx].municipality}</p>`
    });

    $('.addressDiv').append(idx => {
        return `<p>${blog_posts[idx].address}</p>`
    });

    $('.bannerDiv').append(idx => {
        return `<p>${blog_posts[idx].banner}</p>`
    });

    $('.postedDiv').append(idx => {
        const testDate = new Date(Date.parse(blog_posts[idx].posted))
        // just get the Y/M/D of the date
        // TODO: change to MM/DD/YYYY
        return `<p>${testDate.toISOString().split('T')[0]}</p>`
    });

    $('.typeDiv').append(idx => {
        return `<p>${blog_posts[idx].type}</p>`
    });

    $('.regionDiv').append(idx => {
        return `<p>${blog_posts[idx].region}</p>`
    });

    $('.groupDiv').append(idx => {
        return `<p>${blog_posts[idx].group}</p>`
    });

    $('.linkDiv').append(idx => {
        return `<a href="${blog_posts[idx].link}">Link to post</a>`
    });
    // console.log(states.sort());

}
$.getJSON("/get_all_blog_posts")
    .done(function (data) {
        console.log(data.message)
        if(data.message==="success"){
            blogList= data.data;

            // create sets of unique filter criteria
            const states = new Set();
            const postType = new Set();

            // iterate through blog posts and add info to relative sets
            blogList.forEach((item) => {
                states.add(item.state);
                postType.add(item.type)
            })
            // add items in sets to dropdown filters
            states.forEach((state) => {
                $('#state').append(`<option value="${state}">${state}</option>`)
            })
            postType.forEach((type) => {
                $('#post_type').append(`<option value="${type}">${type}</option>`)
            })
            showList(blogList)
        }
    })

function searchBlogPosts() {
    $.get("/get_blog_posts_by_filters", {
        search_key: $('#search_box').val()
    }).done((data) => {
        if(data.message==="success") {
            console.log(data.message)

            showList(data.data)
        }
    })
}
