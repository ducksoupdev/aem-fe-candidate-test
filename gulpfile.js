(function() {
    "use strict";

    var gulp = require("gulp"),
        jasmine = require("gulp-jasmine"),
        sass = require("gulp-sass"),
        concat = require("gulp-concat"),
        rename = require("gulp-rename"),
        minifyCss = require("gulp-minify-css"),
        uglify = require("gulp-uglify"),
        processhtml = require("gulp-processhtml");

    gulp.task("default", function () {
        return gulp.src(["src/app/*.js", "src/test/*.spec.js"])
            .pipe(jasmine());
    });

    gulp.task("sass", function() {
        gulp.src("./src/sass/*.scss")
            .pipe(sass())
            .pipe(gulp.dest("./src/css"))
            .pipe(rename({suffix: ".min"}))
            .pipe(minifyCss())
            .pipe(gulp.dest("./dist/css"));
    });

    gulp.task("uglify", function() {
        return gulp.src(["./src/bower_components/handlebars.js/dist/handlebars.js", "./src/app/app.js", "./src/app/reviews.js"])
            .pipe(concat("app.js"))
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify())
            .pipe(gulp.dest("dist/js"));
    });

    gulp.task("processhtml", function () {
        gulp.src("./src/index.html")
            .pipe(processhtml())
            .pipe(gulp.dest("dist"));
    });

    gulp.task("copy", function() {
        return gulp.src("./data/test.json")
            .pipe(gulp.dest("./dist/data"));
    });

    gulp.task("build", ["sass", "uglify", "copy", "processhtml"]);
})();