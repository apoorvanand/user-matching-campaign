(function() {

	app.SearchView = function (id) {
	  this.el = $(id);
	  //this.startBtn = this.el.find('.btn-success');
	  this.saveSettingsBtn = this.el.find('#save-settings');
	  this.startDateInput = this.el.find('.startDate');
	  this.endDateInput = this.el.find('.endDate');
	  this.queryInput = this.el.find('.search');
    this.button_search   = this.el.find('.btn-search');
    this.button_export   = this.el.find('.btn-export');
    this.button_flush   = this.el.find('.btn-flush');

	  this.init();
	};

	app.SearchView.prototype.init = function () {
		var that = this;

		this.saveSettingsBtn.click(function () {
			that.saveSettings();
		});
		
    this.button_search.click(function () {
      that.startSearch();
    });

    this.button_export.click(function () {
      that.startExport();
    });   

    this.button_flush.click(function () {
      that.startFlush();
    });   

	};

	app.SearchView.prototype.saveSettings = function () {
		var that = this;

		if (this.startDateInput.val() == '' || this.endDateInput.val() == '') {
			console.log('invalid dates');
			return;
		}

		// Process dates
		var start_date = new Date(this.startDateInput.val());
		var start_date_str = start_date.getFullYear()
			 + ('0' + (start_date.getMonth()+1)).slice(-2)
			 + ('0' + start_date.getDate()).slice(-2)
			 + ('0' + start_date.getHours()).slice(-2)
			 + ('0' + start_date.getMinutes()).slice(-2);

		var end_date = new Date(this.endDateInput.val());
		var end_date_str = end_date.getFullYear()
			 + ('0' + (end_date.getMonth()+1)).slice(-2)
			 + ('0' + end_date.getDate()).slice(-2)
			 + ('0' + end_date.getHours()).slice(-2)
			 + ('0' + end_date.getMinutes()).slice(-2);

		var data = {
			start_date: start_date_str,
			end_date: end_date_str,
			query: this.queryInput.val()
		};

	    $.ajax({
  			url: '/settings/search',
  			type: 'POST',
  			data: data,
  			dataType: 'json',
  			success: function(data) {
  				that.onUpdateSettingsComplete(data);
  			},
  			error: function(data) {
  				that.onUpdateSettingsComplete(data);
  			}
		  });
	};

	app.SearchView.prototype.onUpdateSettingsComplete = function (res) {
		var n = noty({
            text        : res.responseText,
            type        : 'success',
            dismissQueue: true,
            timeout: 2000,
            layout      : 'bottomLeft',
            theme       : 'defaultTheme'
        });
	};
	

  app.SearchView.prototype.startSearch = function () {
    var that = this;

      $.ajax({
      url: '/search',
      type: 'GET',
      success: function(data) {
        that.onSearchComplete(data);
      }
    });
  };

  app.SearchView.prototype.onSearchComplete = function (res) {
    // do something
    console.log(res);
  };

  app.SearchView.prototype.startExport = function () {
    var that = this;

    window.location.href = './export';
  };

  app.SearchView.prototype.onExportComplete = function (res) {
    // do something
    console.log(res);
  };
  
  app.SearchView.prototype.startFlush = function () {
    var that = this;

      $.ajax({
        url: '/flush',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
          that.onFlushComplete(data);
        },
        error: function(data) {
          that.onFlushComplete(data);
        }
      });
  };
  
  app.SearchView.prototype.onFlushComplete = function (res) {
    var n = noty({
            text        : res.responseText,
            type        : 'success',
            dismissQueue: true,
            timeout: 2000,
            layout      : 'bottomLeft',
            theme       : 'defaultTheme'
        });
  };

})();
