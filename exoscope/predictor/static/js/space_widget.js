document.addEventListener('DOMContentLoaded', function () {
    // Initialize Cesium if the container exists
    if (document.getElementById('cesiumContainer')) {
        initCesium();
    }

    // Setup NASA media gallery if the section exists
    if (document.getElementById('nasa-gallery')) {
        setupNasaGallery();
    }

    // Setup Mars rover photos if the section exists
    if (document.getElementById('mars-gallery')) {
        setupMarsRover();
    }

    // Event listeners — only if elements exist
    const resetBtn = document.getElementById('reset-view');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetCesiumView);
    }

    const lightMapBtn = document.getElementById('refresh-light-map');
    if (lightMapBtn) {
        lightMapBtn.addEventListener('click', refreshLightMap);
    }

    const nasaRandomBtn = document.getElementById('random-nasa');
    if (nasaRandomBtn) {
        nasaRandomBtn.addEventListener('click', fetchRandomNasaMedia);
    }

    const nasaSearchBtn = document.getElementById('nasa-search-btn');
    if (nasaSearchBtn) {
        nasaSearchBtn.addEventListener('click', searchNasaMedia);
    }

    const marsBtn = document.getElementById('fetch-mars');
    if (marsBtn) {
        marsBtn.addEventListener('click', fetchMarsPhotos);
    }

    const roverSelect = document.getElementById('rover-select');
    if (roverSelect) {
        roverSelect.addEventListener('change', updateRoverSelection);
    }
});


// Cesium 3D Earth Functions
let viewer;
function initCesium() {
    try {
        // Your Cesium ion access token
        Cesium.Ion.defaultAccessToken = CESIUM_TOKEN;
        
        // Initialize the Cesium Viewer
        viewer = new Cesium.Viewer('cesiumContainer', {
            terrainProvider: Cesium.createWorldTerrain(),
            timeline: false,
            animation: false,
            baseLayerPicker: false,
            sceneModePicker: false,
            navigationHelpButton: false,
            homeButton: false,
            geocoder: false,
            infoBox: false,
            selectionIndicator: false,
            shouldAnimate: true,
            skyAtmosphere: false,
            imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }) // Use a high-res basemap
        });
        
        // Enable lighting effects
        viewer.scene.globe.enableLighting = true;
        
        // Remove loading overlay
        document.querySelector('.cesium-loading').style.display = 'none';
        
        // Set initial view to show the whole Earth
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(0, 0, 20000000),
            orientation: {
                heading: 0.0,
                pitch: -Cesium.Math.PI_OVER_TWO,
                roll: 0.0
            }
        });
    } catch (error) {
        console.error('Error initializing Cesium:', error);
        document.querySelector('.cesium-loading p').textContent = 'Failed to load 3D Earth. Please try refreshing the page.';
    }
}

function resetCesiumView() {
    if (viewer) {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(0, 0, 20000000),
            orientation: {
                heading: 0.0,
                pitch: -Cesium.Math.PI_OVER_TWO,
                roll: 0.0
            }
        });
    }
}

// Light Pollution Map Functions
function refreshLightMap() {
    const iframe = document.querySelector('#light-pollution iframe');
    iframe.src = iframe.src; // Simple refresh by reloading the iframe
}

// NASA Media Gallery Functions
function setupNasaGallery() {
    // Load some initial content
    fetchRandomNasaMedia();
}

async function fetchRandomNasaMedia() {
    try {
        const gallery = document.getElementById('nasa-gallery');
        gallery.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div><p>Loading NASA media...</p></div>';
        
        const response = await fetch(`https://images-api.nasa.gov/search?media_type=image&page_size=12&q=space`);
        const data = await response.json();
        
        displayNasaMedia(data.collection.items);
    } catch (error) {
        console.error('Error fetching NASA media:', error);
        document.getElementById('nasa-gallery').innerHTML = '<div class="alert alert-danger">Failed to load NASA media. Please try again later.</div>';
    }
}

async function searchNasaMedia() {
    try {
        const query = document.getElementById('nasa-search').value.trim();
        if (!query) return;
        
        const gallery = document.getElementById('nasa-gallery');
        gallery.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div><p>Searching NASA media...</p></div>';
        
        const response = await fetch(`https://images-api.nasa.gov/search?media_type=image&page_size=12&q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        displayNasaMedia(data.collection.items);
    } catch (error) {
        console.error('Error searching NASA media:', error);
        document.getElementById('nasa-gallery').innerHTML = '<div class="alert alert-danger">Failed to search NASA media. Please try again later.</div>';
    }
}

function displayNasaMedia(items) {
    const gallery = document.getElementById('nasa-gallery');
    
    if (!items || items.length === 0) {
        gallery.innerHTML = '<div class="alert alert-info">No media found matching your criteria.</div>';
        return;
    }
    
    gallery.innerHTML = '';
    
    items.forEach(item => {
        const mediaCard = document.createElement('div');
        mediaCard.className = 'media-card';
        
        const imgSrc = item.links ? item.links[0].href : 'https://via.placeholder.com/300x200?text=NASA+Image';
        const title = item.data[0].title || 'Untitled';
        const date = item.data[0].date_created || 'Date unknown';
        const description = item.data[0].description || 'No description available.';
        
        mediaCard.innerHTML = `
            <img src="${imgSrc}" alt="${title}">
            <div class="media-card-body">
                <h3 class="media-card-title">${title}</h3>
                <p class="media-card-date">${date.split('T')[0]}</p>
                <p class="media-card-desc">${description.substring(0, 100)}${description.length > 100 ? '...' : ''}</p>
            </div>
        `;
        
        gallery.appendChild(mediaCard);
    });
}

// Mars Rover Photos Functions
let currentRover = 'curiosity';
function setupMarsRover() {
    fetchMarsPhotos();
}

function updateRoverSelection() {
    currentRover = document.getElementById('rover-select').value;
    document.getElementById('current-rover').textContent = currentRover.charAt(0).toUpperCase() + currentRover.slice(1);
    fetchMarsPhotos();
}

async function fetchMarsPhotos() {
    try {
        const gallery = document.getElementById('mars-gallery');
        gallery.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary"></div><p>Loading Mars rover photos...</p></div>';
        
        const response = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${currentRover}/latest_photos?api_key=${NASA_API_KEY}`);
        const data = await response.json();
        
        displayMarsPhotos(data.latest_photos);
    } catch (error) {
        console.error('Error fetching Mars photos:', error);
        document.getElementById('mars-gallery').innerHTML = '<div class="alert alert-danger">Failed to load Mars photos. Please try again later.</div>';
    }
}

function displayMarsPhotos(photos) {
    const gallery = document.getElementById('mars-gallery');
    
    if (!photos || photos.length === 0) {
        gallery.innerHTML = '<div class="alert alert-info">No photos available for this rover.</div>';
        return;
    }
    
    // Limit to 12 photos for better performance
    const limitedPhotos = photos.slice(0, 12);
    
    gallery.innerHTML = '';
    
    limitedPhotos.forEach(photo => {
        const mediaCard = document.createElement('div');
        mediaCard.className = 'media-card';
        
        mediaCard.innerHTML = `
            <img src="${photo.img_src}" alt="Mars rover photo">
            <div class="media-card-body">
                <h3 class="media-card-title">${photo.rover.name} Rover</h3>
                <p class="media-card-date">Sol ${photo.sol} - ${photo.earth_date}</p>
                <p class="media-card-desc">Camera: ${photo.camera.full_name}</p>
            </div>
        `;
        
        gallery.appendChild(mediaCard);
    });
}