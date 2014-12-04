(function () {
    "use strict";

    var reviews = require("../app/reviews");
    var path = require("path");
    var fs = require("fs");
    var url = require("url");
    var http = require("http");

    describe("Loading from files", function() {
        it("Should load the json data", function() {
            reviews.get(path.join(__dirname, "../../data/test.json"))
                .success(function(data, xhr) {
                    expect(data).toBeDefined();
                });
        });

        it("Should not load the json data", function() {
            reviews.get(path.join(__dirname, "../../data/test-not-there.json"))
                .error(function(data, xhr) {
                    expect(data).toBeUndefined();
                });
        });
    });

    describe("Loading from http", function() {
        var testServer;

        beforeEach(function() {
            testServer = http.createServer(function(req, res) {
                var uri = url.parse(req.url).pathname,
                    filename = path.join(process.cwd(), "../../data", uri);

                path.exists(function(exists) {
                    if (!exists) {
                        res.writeHead(404, {"Content-Type": "text/plain"});
                        res.write("404 Not Found\n");
                        res.end();
                        return;
                    }

                    fs.readFile(filename, "binary", function(err, file) {
                        if (err) {
                            res.writeHead(500, {"Content-Type": "text/plain"});
                            res.write(err + "\n");
                            res.end();
                            return;
                        }

                        res.writeHead(200);
                        res.write(file, "binary");
                        res.end();
                    });
                });
            }).listen(88888);
        });

        afterEach(function() {
            testServer.close();
        });

        it("Should load the json data", function() {
            reviews.get("http://localhost:88888/test.json")
                .success(function(data, xhr) {
                    expect(data).toBeDefined();
                });
        });

        it("Should not load the json data", function() {
            reviews.get("http://localhost:88888/test-not-there.json")
                .error(function(data, xhr) {
                    expect(xhr.statusCode).toBe(404);
                });
        });
    });
})();
