(function(context){
	var createURL = function() {
		var URL;
		// Append allowed URLs to permissions in manifest file
		// Check the URL here against a pre-defined list
		URL = document.getElementById("localCL").value;
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
	document.getElementById('visualize').addEventListener('click', function() {
		//var iframe = document.getElementsByTagName('iframe')[0];
		//iframe.src("http://vancouver.craigslist.ca/search/apa?hasPic=1&min_price=500&max_price=1500&is_furnished=1")

		var xhr = new XMLHttpRequest();
		xhr.responseType = 'document';

		xhr.open('GET', createURL(), true);
		xhr.onload = function(e) {
			var clPage = this.response;
			var content = clPage.documentElement.getElementsByClassName("content")[0];
			debugger;
		};
		xhr.send();
	});
})(window)