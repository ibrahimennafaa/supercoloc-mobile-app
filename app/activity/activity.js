var observableModule = require("data/observable");
var observableArray = require("data/observable-array");
var viewModule = require("ui/core/view");
var frameModule = require("ui/frame");

var http = require("http");

var events = new observableArray.ObservableArray([]);
var pageData = new observableModule.Observable();
var page;

var start = 0;
var limit = 20;

exports.onPageLoaded = function(args) {
    page = args.object;
    pageData.set("events", events);
    page.bindingContext = pageData;

    // Make sure we're on iOS before making iOS-specific changes
    if (page.ios) {

        // Change the UIViewController's title property
        page.ios.title = "My Awesome App";

        // Get access to the native iOS UINavigationController
        var controller = frameModule.topmost().ios.controller;

        controller.navigationBar.barTintColor = UIColor.redColor();

        // Call the UINavigationController's setNavigationBarHidden method
        controller.navigationBarHidden = false;
    }

	refresh();
};

function getData() {
	console.log(start);
	http.getJSON("https://api.supercoloc.com/activity?token=zaaka&start="+start+"&limit="+limit).then(function (r) {
    	// Argument (r) is JSON!
        events = events.concat(r);
        pageData.set("events", events);
	}, function (e) {
	    // Argument (e) is Error!
	    console.log(e);
	    done(e);
	});
}

function refresh() {
	start = 0;
	events = [];
	getData();
}

function more() {
	start++;
	getData();
}

exports.refresh = refresh;
exports.more = more;