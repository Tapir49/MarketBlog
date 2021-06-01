$.getJSON("/get_all_blog_posts")
    .done(function (data) {
        console.log(data.message)
        if (data.message === "success") {
            blogList = data.data;
            // create sets of unique filter criteria
            let regions = new Set();
            // iterate through blog posts and add info to relative sets
            blogList.forEach((item) => {
                regions.add(item.region);
            })
            regions = Array.from(regions).sort()

            regions.forEach((region) => {
                let file_name = region
                // if the region is rockland/westchester, change the region name to
                // get to right file. Cannot have '/' in file name
                if (region === "ROCKLAND / WESTCHESTER") {
                    file_name = "ROCKLANDWESTCHESTER"
                }
                $("#region_images").append(`<div class='col-xl-4 col-lg-6 col-12'>
                                                <img class="btn image w-100 mb-3" value="${region}" src="../img/regions/${file_name}.png"/>
                                            </div>`)
            })

            $("#region_images img").on('click', function() {
                location.href="region_detail.html?region=" + $(this).attr("value")
            })
        }
    })