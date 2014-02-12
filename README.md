PhotoGrid
=========

Photo Grid is an image grid layout library. The plugin create an interactive symmetric photo grid from dynamic sized images.

![alt text](https://raw2.github.com/EmitKnowledge/PhotoGrid/master/Photo-Grid.png "Screenshot")

## Usage
 ```html
 <div class="photo-grid">
	<!-- PHOTO GRID INFO WINDOW -->
	<div class="photo-grid-info-wrap">
		<!-- POINTER TO THE OPENED IMAGE -->
		<div class="photo-grid-info-wrap-pointer" style="top: -10px; bottom: auto; left: 770px;"></div>
		<!-- PHOTO -->
		<div class="photo-grid-info-image">
			<span></span>
			<img src="http://lorempixel.com/210/150/" />
		</div>
		<!-- PHOTO DETAILS -->
		<div class="photo-grid-info-details">
			<a href='#' class='photo-grid-info-close'></a>
			<a href='#'><h2 class="photo-grid-info-title">30 Fierce Women of Jazz from Yesterday and Today</h2></a>
			<p class="photo-grid-info-description">Everybody knows men usually take top dog positions in history even though women have contributed at least as much and in some cases more.</p>
			<a class="photo-grid-info-open-image" href="#"><span>Visit page</span></a>
		</div>
	</div>			
	<!-- IMAGES FOR GRID -->
	<div class="photo-grid-image-box" data-title="TITLE" data-description="DESCRIPTION">
		<img src="http://lorempixel.com/232/150/">
	</div>
	<div class="photo-grid-image-box" data-title="TITLE" data-description="DESCRIPTION">
		<img src="http://lorempixel.com/500/150/">
	</div>	
</div>


 ```javascript
 $('.photo-grid').photogrid();