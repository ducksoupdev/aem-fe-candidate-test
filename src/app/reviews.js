(function (root) {
    "use strict";

    var isNode = false;

    // are we running on the server
    if (typeof module !== "undefined" && module.exports) {
        isNode = true;
    }

    var parse = function (req) {
        var result;
        try {
            result = JSON.parse(req.responseText);
        } catch (e) {
            result = req.responseText;
        }
        return [result, req];
    };

    var xhr = function (type, url, data) {
        var methods = {
            success: function () {},
            error: function () {}
        };

        if (isNode) {
            var fs = require("fs");
            if (fs.existsSync(url)) {
                var obj = JSON.parse(fs.readFileSync(url, "utf8"));
                methods.success.apply(methods, obj);
            } else {
                methods.error.apply(methods);
            }
        } else {
            var XHR = root.XMLHttpRequest || ActiveXObject;
            var request = new XHR("MSXML2.XMLHTTP.3.0");
            request.open(type, url, true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.onreadystatechange = function () {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        methods.success.apply(methods, parse(request));
                    } else {
                        methods.error.apply(methods, parse(request));
                    }
                }
            };
            request.send(data);
        }

        return {
            success: function (callback) {
                methods.success = callback;
                return methods;
            },
            error: function (callback) {
                methods.error = callback;
                return methods;
            }
        };
    };

    var reviews = {
        get: function(src) {
            return xhr("GET", src);
        }
    };

    // are we running on the server
    if (isNode) {
        module.exports = reviews;
    } else {
        root.reviews = reviews;
    }
})(this);