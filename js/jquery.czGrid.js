// JavaScript Document

(function($) {
	var czUI = czUI || {}

	$.fn.czGrid = function( options ){
		
		var PNAME   = 'czGrid';
		var objData = $(this).data(PNAME);
		
		//get instance object
		if (typeof options == 'string' && options == 'instance') {
			return objData;
		}
		
		var options = $.extend( {}, czUI.czGrid.defaults, options || {} );
		
		return $(this).each(function (){
			
			var czGrid = new czUI.czGrid( options );
			czGrid.$element = $(this);
			czGrid.init();
			$(this).data( PNAME, czGrid );
			
		});
	}

	czUI.czGrid = function( options ) {
		this.NAME    = 'czGrid';
		this.VERSION = '0.1';
		this.options = options;
		this.$element= null;
		this.$wrap   = null;
		this.th      = [];
		this.td      = [];
	}
	
	czUI.czGrid.defaults = {
		title        : '',
		className    : '',
		width        : 100,
		initCallback : null,
		showCallback : null,
		hideCallback : null
	}

	czUI.czGrid.prototype = {
		
		init: function() {
			var self = this;

			this.$thead = this.$element.find('thead').eq(0);
			this.$tbody = this.$element.find('tbody').eq(0);
			this.$grid  = $("<div />").addClass(this.NAME).css('position','relative');
			this.$element.after(this.$grid);
			this.rows  = this.$tbody.find('tr').length;
			this.$thead.find('th').each(function () {
				self.th.push ( $(this).html() );
			});
			this.cols   = this.th.length;

			for(var i=0; i<this.rows; i++) {
				self.td[i] = [];
				this.$tbody.find('tr:eq('+i+') td').each(function () {
					self.td[i].push( $(this).html() )
				});
			}
			
			
			this.$element.remove();
			this._createThead();
			this._createTbody();
			this._createDrag();
			console.log(this);
			this._callback('init');
		},
		_createDrag : function() {
			var self = this;
			var grid_height = this.$grid.height();
			var $wrap_drag  = $("<div />").addClass('czGrid-th-dragwrap').appendTo(this.$grid);
			for(var i=0; i<this.cols; i++) {
				var $th = this.$grid.find('th').eq(i);

				var thisposition = $th.position();
				var divleft    = thisposition.left + $th.width() + 1;
				$("<div />").css({
					top      : 0,
					left     : divleft,
					width    : 4,
					height   : grid_height,
					display  : 'block',
					position : 'absolute',
					cursor   : 'col-resize'
					
				}).appendTo($wrap_drag);

			}
		},
		_createThead : function() {
			var self = this;

			var $wrap_th_arrow = $("<div />").addClass('czGrid-th-arrow').appendTo(this.$grid).append('<div />');
			var $wrap_th_btn = $("<div />").addClass('czGrid-th-btnwrap').appendTo(this.$grid);
			var $wrap_th     = $("<div />").addClass('czGrid-th-wrap').appendTo(this.$grid);
			
			var $tr    = $("<tr />");
			var $table = $("<table />")
			for(var i=0; i<this.cols; i++) {
				var $th = $("<th />").attr('data-col', i);
				$("<div />").html(this.th[i]).css('width', this.options.width).appendTo($th);
				$th.appendTo($tr);
				$th.bind('mouseenter', function() {
					$wrap_th_arrow.show();
					var thisposition = $(this).position();
					var arrowleft    = thisposition.left + $(this).width() - $wrap_th_arrow.width();
					$wrap_th_arrow.css('left', arrowleft);
				});
			}
			$tr.appendTo($table);
			$table.appendTo($wrap_th);
		},

		_createTbody : function() {
			var $wrap_td     = $("<div />").addClass('czGrid-td-wrap').appendTo(this.$grid);
			var $table = $("<table />");
			for(var l=0; l<this.rows; l++) {
				var $tr    = $("<tr />");
				(l % 2 == 1) ? $tr.addClass('czGrid-tr-even') : $tr.addClass('czGrid-tr-odd');
				for(var i=0; i<this.cols; i++) {
					var $td = $("<td />").attr('data-col', i);
					$("<div />").html(this.td[l][i]).css('width', this.options.width).appendTo($td);
					$td.appendTo($tr);
				}
				$tr.appendTo($table);
			}
			$table.appendTo($wrap_td);
		},

		debug : function( $message ) {
			
			if ( typeof $message == 'undefined') $message = this;
			
			if (window.console && window.console.log)
				window.console.log($message);
			else
				alert($message);
		},
		
		_callback: function(evt) {
			if( typeof this.options[evt + 'Callback'] != 'function')
				return;
			this.options[evt + 'Callback'].call(this);
		}
	}
})(jQuery);