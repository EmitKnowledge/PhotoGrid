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
            var $photoBoxes = $('.photo-grid-image-box');
			var containerWidth = $(_this.domElement).width();
			var rowWidth = 0;
			var rowNumber = 0;
            var i = 0;
            var isProcessing = true;
			var previousElements = [];
            while(isProcessing){
                var $el = $photoBoxes[i];
                _this.assignRandomHover($el);
                // calculate how much space we have for row
                rowWidth = _this.calculateCurrentRowWidth(previousElements);
                var diff = _this.calculateLeftoutWidth(previousElements, containerWidth);
                // when 80% is filled distribute the left over width to the buffer elements
                var nextElementWidth = $el && $($el).next().width() || diff + 1;
                if(rowWidth > containerWidth*80/100 || nextElementWidth > diff){
                    _this.adjustRow(previousElements, diff);
                    previousElements = [];
                    rowWidth = 0;
                    rowNumber++;
                }
                if($el){
                    previousElements.push($el);
                    // assign row number
                    $($el).attr(key.rowNumber, rowNumber);
                }
                if(previousElements.length == 0) isProcessing = false;
                i++
            }
		}

        _this.calculateCurrentRowWidth = function(elements){
            var widthSum = 0;
            for(var i = 0; i < elements.length; i++){
                widthSum += $(elements[i]).outerWidth(true);
            }
            return widthSum;
        };

        _this.calculateLeftoutWidth = function(elements, containerWidth){
            return containerWidth - _this.calculateCurrentRowWidth(elements);
        };

		/**
		* @desc adjust the row width
		*/			
		_this.adjustRow = function(previousElements, availableWidth){
			// calculate normal width distribution
			var elementsCount = previousElements.length;
            var lastMargin = $(previousElements[elementsCount - 1]).css('margin-right') || 0;
			var widthPerElement = Math.round((availableWidth/elementsCount) * 100) / 100;
			for(var i = 0; i < previousElements.length; i++){
                var width = $(previousElements[i]).width() + widthPerElement;
                $(previousElements[i]).width(width);
                // adjust image width
				var $img = $('img', previousElements[i]).width(width);
                if(elementsCount == 1){
                    $(previousElements[i]).css({
                        'marginLeft' : 'auto',
                        'marginRight' : 'auto',
                        'float' : 'none'
                    });
                    var fullsize = $img.attr('data-fullsize');
                    $img.attr('src', fullsize);
                }
				// set background for images that does not fit the height
				if($img.height() < $(previousElements[i]).height()){
					$(previousElements[i]).css('background-color', $.fn.photogrid.config.noFitThumbsBackground)
				}
				if($img.width() < $(previousElements[i]).width()){
					$(previousElements[i]).css('background-color', $.fn.photogrid.config.noFitThumbsBackground)
				}				
			}

            if(elementsCount > 1){
			    // clear margin for the last element
			    $(previousElements[elementsCount - 1]).css('margin-right', 0);
            }
		}
		
		/**
		* @desc adjust the row width
		*/			
		_this.assignRandomHover = function($element){
            if(!$element) return;
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
			var imgSrc = $('img', $element).attr('data-fullsize');
			var title = $($element).attr('data-title');
			var description = $($element).attr('data-description');
	        var url = $($element).attr('data-url');

			$('.photo-grid-info-image', _this.domDetails).css('background', 'url(' + imgSrc + ') no-repeat');
			$('.photo-grid-info-title', _this.domDetails).text(title);
			$('.photo-grid-info-description', _this.domDetails).text(description);
			$('.photo-grid-info-open-image', _this.domDetails).attr('href', url);

			// show the details
            var containerWidth = $(_this.domElement).width();
			var $lastRowElement = $("[" + key.rowNumber + "='" + rowNumber + "']", _this.domElement).last();
            $(_this.domDetails).hide();
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

        _this.hideDetails = function(){
            $(_this.domDetails).slideUp();
            return false;
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
			$('.photo-grid-info-close').click(_this.hideDetails);
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