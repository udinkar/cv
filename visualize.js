(function(context){
	var p1;
	p1 = document.getElementById("poi1").value;
	p1 = p1.split(' ').join('+');
	var serverKey = "AIzaSyBRIRzB2MfLqEE_T8Njt_L8PLz5aytm0oM";

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

	var decodeGeoLocation = function(url) {
		var dl = '';
		if (url.match(/\/@/)) {
			dl = url.match(/\/@(.*),16z$/)[1];
		} else if (url.match(/\/\?q=loc/)) {
			dl = url.match(/((\+[\w]+)+)/)[1].replace(/^\+/, '');
		};
		if (dl.length < 20) {
			dl = '';
		};
		return dl;
	};

	var measureDistance = function(unit) {
		var promise = new Promise(function(resolve, reject) {
			var origin = decodeGeoLocation(unit.googleMapLink);
			if(origin === '') {
				resolve(null);
			}
			var request = 'https://maps.googleapis.com/maps/api/distancematrix/' + 'json?' +
						'origins=' + origin +
						'&destinations=' + p1+
						'&mode=' + 'transit' +
						'&key=' + serverKey

			$.getJSON(request, function(response) {
				try {
					unit.duration = response['rows'][0]['elements'][0]['duration']['value'] / 60.0;
					unit.location = origin;
					resolve(unit);
				}
				catch(ignore) {
					resolve(null);
				}
			}).fail(function() {
				resolve(null);
			});
		});
		return promise;
	};

	var processunit = function (url) {
	  var promise = new Promise(function(resolve, reject) {
	    var xhr = new XMLHttpRequest();
	    xhr.responseType = 'document';
	    xhr.open('GET', url, true);
	    xhr.onload = function(e) {
	      var clPage = this.response;
	      var unit = {};
	      unit.price = $(clPage).find(".price").text().replace(/[$]/, '');
	      unit.googleMapLink = $(clPage).find("a:contains('google map')").attr('href');
	      unit.imgs = [];
	      $(clPage).find("#thumbs a").toArray().forEach(function(image) {
	        unit.imgs.push($(image).attr('href'));
	      })
	      if (unit.price && unit.googleMapLink) {
			resolve(unit);
	      }
	      else {
	      	resolve(null);
	      }
	    };
	    xhr.send();
	  });
	  return promise;
	};

	// var saveToJSON = function(list) {
	// 	if (!list) {
 //          return;
 //        }
 //        chrome.storage.sync.set({'data': list}, function() {
 //          console.log('data saved');
 //        });
	// };

	var processLinks = function(unitList) {
		Promise.all(unitList.map(processunit))
		.then(function(processedList){
		  return Promise.all(processedList.filter(function(e){
		  	return e !== null;
		  }).map(measureDistance));
		})
		.then(function(list){
		  return list.filter(function(e){
		    return e !== null;
		  })
		})
		.then(function(list){
		  console.log(JSON.stringify(list));
		  //saveToJSON(list);
		  //window.open('visualizer/index.html');
		})
	};

	document.getElementById('visualize').addEventListener('click', function() {
		var xhr = new XMLHttpRequest();
		xhr.responseType = 'document';

		xhr.open('GET', createURL(), true);
		xhr.onload = function(e) {
			var clPage = this.response;
			var links = extractLinks(clPage);
			//processLinks(links); // Promise
		};
		xhr.send();
	});
})(window)