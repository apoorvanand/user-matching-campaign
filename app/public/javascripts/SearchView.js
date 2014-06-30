(function() {

	app.SearchView = function (id) {
	  this.el = $(id);
	  //this.startBtn = this.el.find('.btn-success');
	  this.startBtn = this.el.find('.btn-search');
	  this.startDateInput = this.el.find('.startDate');
	  this.endDateInput = this.el.find('.endDate');
	  this.hashTagInput = this.el.find('.hashtag');

	  this.init();
	};

	app.SearchView.prototype.init = function () {
		var that = this;

		$('.datetimepicker').datetimepicker({
        	format: 'YYYY-MM-DD hh:mm',
		})

		this.startBtn.click(function () {
			that.startSearch();
		});
	};

	app.SearchView.prototype.startSearch = function () {
		var that = this;
		
		console.log(this.hashTagInput.val());

		var data = {
			fromDate: moment(this.startDateInput.val()).format('YYYYMMDDhhmmss') ,
			toDate: moment(this.endDateInput.val()).format('YYYYMMDDhhmmss') ,
			query: this.hashTagInput.val()
		};

		console.log(data);

	    $.ajax({
			url: '/search',
			type: 'GET',
			data: data,
			dataType: 'json',
			success: function(data) {
				that.onSearchComplete(data);
			}
		});
	};

	app.SearchView.prototype.onSearchComplete = function (res) {

		// do something

		console.log(res);

	};

})();
