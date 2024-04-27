const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');

let isInitialLoad = true;
let readyToLoadNextImages = false;
let imagesLoaded = 0;
let totalImages = 0; // indicates everything is loaded
let photosArray = [];

// Unsplash API
let initialCount = 5; // initial load
const apiKey = 'RznySklIHDoJxZV1yhFKyFPnUDGDk7NcwbAjvr6-viY';
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`;

function updateApiUrlWithNewCount(imageCount) {
	apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${imageCount}`;
}

// Helper function to check if all images were loaded
function imageLoaded() {
	imagesLoaded++;
	if (imagesLoaded === totalImages) {
		readyToLoadNextImages = true;
		loader.hidden = true;
	}
}

//  Helper function to set attributes on DOM elements
function setAttributesToElements(element, attributes) {
	for (const key in attributes) {
		element.setAttribute(key, attributes[key]);
	}
}

// Create Elements for Links & Photos, and Add to DOM
const displayPhotos = () => {
	imagesLoaded = 0; // reset imagesLoaded
	totalImages = photosArray.length;
	photosArray.forEach((photo) => {
		// Create <a> link to Unsplash
		const item = document.createElement('a');
		setAttributesToElements(item, {
			href: photo.links.html,
			target: '_blank',
		});

		// Create <img> for photo
		const img = document.createElement('img');
		setAttributesToElements(img, {
			src: photo.urls.regular,
			alt: photo.alt_description,
			title: photo.alt_description,
		});

		// Event Listener, check when each is finished loading
		img.addEventListener('load', imageLoaded);

		// Put <img> inside <a>, then put both inside imageContainer Element
		item.appendChild(img);
		imageContainer.appendChild(item);
	});
};
// Get Photos from Unsplash API

const getPhotos = async () => {
	try {
		const response = await fetch(apiUrl);
		photosArray = await response.json();
		displayPhotos();
		if (isInitialLoad) {
			updateApiUrlWithNewCount(30);
			isInitialLoad = false;
		}
	} catch (error) {
		// alert('There was an error retrieving photos');
		console.log('There was an error getting photos', error);
	}
};

//  See if scrolling is near bottom of page, Load more photos
window.addEventListener('scroll', () => {
	if (
		window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
		readyToLoadNextImages
	) {
		readyToLoadNextImages = false;
		getPhotos();
	}
});

// On Load
getPhotos();
