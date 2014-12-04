(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function() {
        var template = Handlebars.compile(document.querySelector("#reviews-template").innerHTML);
        reviews.get("../data/test.json")
            .success(function(data, xhr) {
                document.querySelector("#review-container").innerHTML = template(data);
            });
    });
})();
