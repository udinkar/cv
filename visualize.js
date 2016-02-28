(function(context){
	var createURL = function() {
		var URL;
		URL = document.getElementById("localCL").value;
		URL = URL + document.getElementById("area").value + "?";
		if (document.getElementById("pic").value === "yes")
			URL = URL + "hasPic=1&";
		if (document.getElementById("minprice").value && (Number.parseFloat(document.getElementById("minprice").value) > 0))
			URL = URL + "min_price=" + document.getElementById("minprice").value + "&";
		if (document.getElementById("maxprice").value && (Number.parseFloat(document.getElementById("maxprice").value) > 0))
			URL = URL + "max_price=" + document.getElementById("maxprice").value + "&";
		if (document.getElementById("furnished").value === "yes")
			URL = URL + "is_furnished=1&";
		return URL;
	};

	var extractLinks = function(page) {
		var content = page.documentElement.getElementsByClassName("content")[0];
		var aElements = $(content).find('.i');
		var links = [];
		for (var i=0; i<aElements.length; i++) {
			links[i] = aElements[i].href;
		}
		return links;
	};

	document.getElementById('visualize').addEventListener('click', function() {
		//var iframe = document.getElementsByTagName('iframe')[0];
		//iframe.src("http://vancouver.craigslist.ca/search/apa?hasPic=1&min_price=500&max_price=1500&is_furnished=1")

		var xhr = new XMLHttpRequest();
		xhr.responseType = 'document';

		xhr.open('GET', createURL(), true);
		xhr.onload = function(e) {
			var clPage = this.response;
			var links = extractLinks(clPage);
			debugger;
		};
		xhr.send();
	});
})(window)