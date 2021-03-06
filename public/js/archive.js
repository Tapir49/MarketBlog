let blogList = []

function showList(blog_posts) {
    console.log("showing list")

    $("#blog_table").empty()
    $("#blog_table").append(
        `<thead> 
            <tr> 
                <th>Banner</th>
                <th>State</th>
                <th>Municipality</th>
                <th>Address</th>
                <th>Date Posted</th>
                <th>Post Type</th>
            </tr>
        </thead>
        <tbody></ttbody>`
    );

    for (let i = 0; i < blog_posts.length; i++) {
        // $('#blog_list').append("<li class='list-group-item'></li>");
        $('#blog_table tbody').append("<tr class='post-entry'></tr>");
    }

    $('#blog_table .post-entry')
        .attr("value", function (idx) {
            return blog_posts[idx]._id;
        })
    // .append("<div class='row'></div>");
    $('#blog_table .post-entry')
        .append("<td class='bannerDiv'></td>")
        .append("<td class='stateDiv'></td>")
        .append("<td class='municipalityDiv'></td>")
        .append("<td class='addressDiv'></td>")
        .append("<td class='postedDiv'></td>")
        .append("<td class='typeDiv'></td>")
        .on('click', function () {
            location.href="blogpost_detail.html?blog_id=" + $(this).attr("value")
        })
    // .append("<div class='col-1 regionDiv'></div>")
    // .append("<div class='col-1 groupDiv'></div>")
    // .append("<div class='col-1 linkDiv'></div>")

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
        return `<p>${testDate.toISOString().split('T')[0]}</p>`
    });

    $('.typeDiv').append(idx => {
        return `<p>${blog_posts[idx].type}</p>`
    });
}

$.getJSON("/get_all_blog_posts")
    .done(function (data) {
        console.log(data.message)
        if (data.message === "success") {
            $.getJSON("/get_current_user")
                .done(function (data) {
                    if (data.data.admin === true) {
                        $('#search').append("<a class='btn btn-primary w-100' href='/edit-post'>Add Post</a>")
                    } else {
                        console.log("There is no Admin")
                    }
                })
            blogList = data.data;

            // create sets of unique filter criteria
            let states = new Set();
            let postType = new Set();
            let banners = new Set();
            let regions = new Set();
            let groups = new Set();

            // iterate through blog posts and add info to relative sets
            blogList.forEach((item) => {
                states.add(item.state);
                postType.add(item.type);
                banners.add(item.banner);
                regions.add(item.region);
                if (item.group) {
                    groups.add(item.group);
                }
            })
            // convert the sets to lists and sort them alphabetically
            states = Array.from(states).sort()
            postType = Array.from(postType).sort()
            banners = Array.from(banners).sort()
            regions = Array.from(regions).sort()
            groups = Array.from(groups).sort()
            // add items in sets to dropdown filters
            states.forEach((state) => {
                $('#state').append(`<option value="${state}">${state}</option>`)
            })
            postType.forEach((type) => {
                $('#post_type').append(`<option value="${type}">${type}</option>`)
            })
            banners.forEach((banner) => {
                $('#banner').append(`<option value="${banner}">${banner}</option>`)
            })
            regions.forEach((region) => {
                $('#region').append(`<option value="${region}">${region}</option>`)
            })
            groups.forEach((group) => {
                $('#group').append(`<option value="${group}">${group}</option>`)
            })
            const query = window.location.search;
            const urlParams = new URLSearchParams(query);
            const region = urlParams.get('region');
            if(region) {
                $("#region").val(region)
                searchBlogPosts()
            } else {
                showList(blogList)
            }
        }
    })

function searchBlogPosts() {
    const sk = $("#search_box").val().toLowerCase();
    const state = $("#state").val();
    const post_type = $("#post_type").val();
    const region = $("#region").val();
    const group = $("#group").val();
    const banner = $("#banner").val();

    showList(blogList.filter((e) => {
        return (e.content.toLowerCase().includes(sk) ||
            e.municipality.toLowerCase().includes(sk) ||
            e.banner.toLowerCase().includes(sk) ||
            e.address.toLowerCase().includes(sk) ||
            e.region.toLowerCase().includes(sk) ||
            e.group.toLowerCase().includes(sk)) &&
            (e.state === state || !state) &&
            (e.type === post_type || !post_type) &&
            (e.region === region || !region) &&
            (e["group"] === group || !group) &&
            (e.banner === banner || !banner)
    }));

}
