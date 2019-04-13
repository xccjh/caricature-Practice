!function($, window, document, undefined) {

    function Report()
    {
        this.data = {
            width: 0,
            height: 0,
            uri: "",
            userAgent: "",
            host: "",
            os: "",
        };
    }

    Report.prototype.getUri = function() {
        var pathname = location.pathname;
        var queryString = location.search;
        this.data.uri = encodeURIComponent(pathname + queryString);
    };

    Report.prototype.getScreenSize = function() {
        this.data.width = window.screen.width;
        this.data.height = window.screen.height;
    };

    Report.prototype.getUA = function() {
        this.data.userAgent = encodeURIComponent(navigator.userAgent);
    };

    Report.prototype.getOS = function() {
        if (this.data.userAgent.match(/windows/i)) {
            this.data.os = "windows";
        } else if (this.data.userAgent.match(/mac/i)) {
            this.data.os = "mac";
        } else if(this.data.userAgent.match(/linux/i)) {
            this.data.os = "linux";
        } else {
            this.data.os = "unknown";
        }
    };

    Report.prototype.getHost = function() {
        this.data.host = encodeURIComponent(location.host);
    };

    Report.prototype.send = function() {
        this.getUri();
        this.getHost();
        this.getScreenSize();
        this.getUA();
        this.getOS();
        $.get('/report', this.data);
    };

    var report = new Report();
    report.send();
}(jQuery, window, document);