// photo grid container
var $photoGrid = $('.photo-grid');

/**
* @desc generate random number
*/		
function random(from, to){
	return Math.floor(Math.random() * (to - from + 1)) + from;
}

/**
* @desc generate random samples for the demo
*/		
function createRandomSamples(){
	for(var i = 0; i < 25; i++){
		// create the image element
		var $imageBox = $("<div class='photo-grid-image-box' data-title='Some title " + i + "' data-description='Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit'/>");
		// assign some random width/height
		var width = random(150, 300);
		var height = random(150, 150);
		// create random image
		var imageThumbLocation = 'http://lorempixel.com/' + width + '/' + height + '/';
		var $randomImage = $("<img src='" + imageThumbLocation + "'/>");															   		
		$imageBox.append($randomImage);
		// add it to the grid
		$photoGrid.append($imageBox);
	}			
}

/**
* @desc create photo grid layout
*/
$(function(){
	createRandomSamples();
	$photoGrid.photogrid();
});