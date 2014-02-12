;(function ($) {
    $.fn.photogrid = function (options) {
		// default options
		options = $.extend(true, {}, $.fn.photogrid.config, options);					
		var _this = {};
		_this.id;
		_this.domElement;
		_this.domDetails;
		_this.domDetailsPointer;
		
		var key = {
			rowNumber:'row-number'
		}
		
		/**
		* @desc generate random number in interval
		*/			
		function random(from, to){
			return Math.floor(Math.random() * (to - from + 1)) + from;
		}

		/**
		* @desc generate unique id
		*/			
		function uid(){
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
				return v.toString(16);
			});		
		}
		
		/**
		* @desc adjust the photogrid matrix
		*/			
		_this.adjustLayout = function(){
			var containerWidth = $(_this.domElement).width();
			var rowWidth = 0;
			var rowNumber = 0;
			var previousElements = [];
			$('.photo-grid-image-box').each(function(){
				_this.assignRandomHover(this);
				// assign row number
				$(this).attr(key.rowNumber, rowNumber);
				// calculate how much space we have for row
				var width = $(this).outerWidth(true);					
				rowWidth += width;
				var diff = containerWidth - rowWidth;
				previousElements.push(this);
				// when 80% is filled distribute the left over width to the buffer elements
				if(rowWidth > containerWidth*80/100){
					_this.adjustRow(previousElements, diff);
					previousElements = [];
					rowWidth = 0;
					rowNumber++;
				}
			});
		}			
		
		/**
		* @desc adjust the row width
		*/			
		_this.adjustRow = function(previousElements, availableWidth){
			// calculate normal width distribution
			var elementsCount = previousElements.length;
			var widthPerElement = availableWidth/elementsCount;
			for(var i = 0; i < previousElements.length; i++){
				var width = $(previousElements[i]).width() + widthPerElement;
				$(previousElements[i]).width(width);
				// adjust image width
				var $img = $('img', previousElements[i]).width(width);
				// set background for images that does not fit the height
				if($img.height() < $(previousElements[i]).height()){
					$(previousElements[i]).css('background-color', $.fn.photogrid.config.noFitThumbsBackground)
				}
				if($img.width() < $(previousElements[i]).width()){
					$(previousElements[i]).css('background-color', $.fn.photogrid.config.noFitThumbsBackground)
				}				
			}	
			// clear margin for the last element
			$(previousElements[elementsCount - 1]).css('margin-right', 0);
		}
		
		/**
		* @desc adjust the row width
		*/			
		_this.assignRandomHover = function($element){
			var colors = $.fn.photogrid.config.hoverColors;
			if(colors.length == 0) return;
			var index = random(0, colors.length - 1);
			$($element).css('background-color', colors[index]);		
		};
		
		/**
		* @desc show the details view
		*/			
		_this.showDetails = function($element){
			var rowNumber = $($element).attr(key.rowNumber);
			var imgSrc = $('img', $element).attr('src');
			var title = $($element).attr('data-title');
			var description = $($element).attr('data-description');
	
			$('.photo-grid-info-image img', _this.domDetails).attr('src', imgSrc);
			$('.photo-grid-info-title', _this.domDetails).text(title);
			$('.photo-grid-info-description', _this.domDetails).text(description);
			$('.photo-grid-info-open-image', _this.domDetails).attr('href', imgSrc);
			
			// show the details
			var $lastRowElement = $("[" + key.rowNumber + "='" + rowNumber + "']", _this.domElement).last();
			$(_this.domDetails).detach().insertAfter($lastRowElement);
			$(_this.domDetails).slideDown();
			
			// calculate pointer position
			var detailsPosition = $(_this.domDetails).position();
			var elementPosition = $($element).position();
			var width = $($element).outerWidth(true);
			var height = $(_this.domDetailsPointer).outerHeight(true);
			$(_this.domDetailsPointer).css('top', detailsPosition.top - height);
			$(_this.domDetailsPointer).css('left', elementPosition.left + width/2);			
		}
		
		/**
		* @desc handles image click event
		*/			
		_this.onImageClick = function(e){
			_this.showDetails(this);
		}
		
		/**
		* @desc attach plugin events
		*/			
		_this.attachEvents = function(){
			// engage with the dom, once the images are ready
			$(window).on("load." + _this.id, _this.adjustLayout);
			$(document).on("click", '.photo-grid-image-box',_this.onImageClick);
			$(_this.domDetails).click(function(){ $(_this.domDetails).slideUp(); });
		};
		
		/**
		* @desc initialize the photogrid
		*/		
		_this.initPlugin = function(domElement){
			_this.id = uid();
			_this.domElement = domElement;
			_this.domDetails = $(".photo-grid-info-wrap", _this.domElement);
			_this.domDetailsPointer = $(".photo-grid-info-wrap-pointer", _this.domElement);
			_this.attachEvents(domElement);
		};		
		
        return this.each(function () {
			var selector = this;
			_this.initPlugin(selector);
        });
    };
	
    $.fn.photogrid.config = {
		noFitThumbsBackground:'#fff',
		hoverColors:['#3387ea', '#59b1e3', '#013f88', '#00abe3', '#f9be3e', '#d3573f', '#f14724', '#33af95', '#86a73f', '#7f5a8d']
    };
}(jQuery));