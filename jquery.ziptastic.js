(function( $ ) {
	var requests = {};
	var zipValid = {
		us: /[0-9]{5}(-[0-9]{4})?/
	};

	$.ziptastic = function(country, zip, callback){
		// If only zip and callback are given default to US
		if (arguments.length == 2 && typeof arguments[1] == 'function') {
			callback = arguments[1];
			zip = arguments[0];
			country = 'US';
		}


		country = country.toUpperCase();
		// Only make unique requests
		if(!requests[country]) {
			requests[country] = {};
		}


		if(!requests[country][zip]) {

			requests[country][zip] = $.ajax({
				url: 'http://127.0.0.1:8321/v3/' + country + '/' + zip,
				headers: {'x-referrer': 'http://ford.com', 'x-key': 'ac2218f205e94e0647210b3927f94f4a213e6ff3' },
				contentType: "application/json",
				type: 'GET',
				dataType: 'json',
				// success: function(data) { console.log(data); requests[country][zip] = data[0]; },
				error: function(e) { alert('There was an error. ' + e.message ); }
			});


			// Bind to the finished request
			requests[country][zip].done(function(data) {

				if (typeof callback == 'function') {
					var data_temp = data[0]
					var key = Object.keys(data_temp)[0];

					requests[country][zip] = data_temp[key];
					callback(data_temp[key].country, data_temp[key].state, data_temp[key].state_short, data_temp[key].city, zip);
				}
			});
		}
		// Allow for binding to the deferred object
		return requests[country][zip];
	};

	$.fn.ziptastic = function( options ) {
		return this.each(function() {
			var ele = $(this);

			ele.on('keyup', function() {
				var zip = ele.val();

				// TODO Non-US zip codes?
				if(zipValid.us.test(zip)) {
					$.ziptastic(zip, function(country, state, state_short, city) {
						// Trigger the updated information
						ele.trigger('zipChange', [country, state, state_short, city, zip]);
					});
				}
			});
		});
	};
})( jQuery );
