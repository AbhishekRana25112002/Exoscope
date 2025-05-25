document.addEventListener('DOMContentLoaded', function() {
    // Initialize Cesium 3D Earth
    initCesium();
    
    // NASA Media Gallery
    setupNasaGallery();
    
    // Mars Rover Photos
    setupMarsGallery();
    
    // Light Pollution Map Refresh
    document.getElementById('refresh-light-map').addEventListener('click', function() {
        const iframe = document.querySelector('#light-pollution iframe');
        iframe.src = iframe.src;
    });
});

function initCesium() {
    try {
        Cesium.Ion.defaultAccessToken = CESIUM_TOKEN;
        
        const viewer = new Cesium.Viewer('cesiumContainer', {
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
            shouldAnimate: true
        });
        
        // Enable lighting effects
        viewer.scene.globe.enableLighting = true;
        
        // Remove loading overlay
        document.querySelector('.cesium-loading').style.display = 'none';
        
        // Reset view button
        document.getElementById('reset-view').addEventListener('click', function() {
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(0, 0, 20000000),
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-90),
                    roll: 0.0
                }
            });
        });
        
    } catch (error) {
        console.error('Error initializing Cesium:', error);
        document.querySelector('.cesium-loading p').textContent = 'Failed to load 3D Earth. Please refresh the page.';
    }
}

function setupNasaGallery() {
    const nasaSearch = document.getElementById('nasa-search');
    const nasaSearchBtn = document.getElementById('nasa-search-btn');
    const nasaGallery = document.getElementById('nasa-gallery');
    const randomNasaBtn = document.getElementById('random-nasa');
    
    const searchTerms = ['earth', 'mars', 'jupiter', 'nebula', 'galaxy', 'supernova', 'black hole', 'satellite'];
    
    // Search function
    function searchNasaMedia(query) {
        nasaGallery.innerHTML = '<div class="col-12 text-center py-4"><div class="spinner-border text-primary"></div><p class="mt-2">Searching NASA media...</p></div>';
        
        fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`)
            .then(response => response.json())
            .then(data => {
                nasaGallery.innerHTML = '';
                
                if (data.collection.items.length === 0) {
                    nasaGallery.innerHTML = '<div class="col-12 text-center py-4"><p>No results found. Try a different search term.</p></div>';
                    return;
                }
                
                data.collection.items.slice(0, 12).forEach(item => {
                    const card = createMediaCard(item);
                    nasaGallery.appendChild(card);
                });
                
                // Initialize Masonry layout
                new Masonry(nasaGallery, {
                    itemSelector: '.media-card',
                    columnWidth: 300,
                    gutter: 20,
                    fitWidth: true
                });
            })
            .catch(error => {
                console.error('Error fetching NASA media:', error);
                nasaGallery.innerHTML = '<div class="col-12 text-center py-4"><p>Failed to load NASA media. Please try again later.</p></div>';
            });
    }
    
    // Create media card
    function createMediaCard(item) {
        const card = document.createElement('div');
        card.className = 'media-card';
        
        const imgSrc = item.links ? item.links[0].href : '';
        const title = item.data ? item.data[0].title : 'Untitled';
        const date = item.data ? new Date(item.data[0].date_created).toLocaleDateString() : 'Unknown date';
        const description = item.data ? item.data[0].description : 'No description available';
        
        card.innerHTML = `
            <img src="${imgSrc}" alt="${title}" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Available'">
            <div class="media-card-body">
                <h3 class="media-card-title">${title}</h3>
                <div class="media-card-date">${date}</div>
                <p class="media-card-description">${description}</p>
            </div>
        `;
        
        return card;
    }
    
    // Event listeners
    nasaSearchBtn.addEventListener('click', () => {
        if (nasaSearch.value.trim()) {
            searchNasaMedia(nasaSearch.value.trim());
        }
    });
    
    nasaSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && nasaSearch.value.trim()) {
            searchNasaMedia(nasaSearch.value.trim());
        }
    });
    
    randomNasaBtn.addEventListener('click', () => {
        const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
        nasaSearch.value = randomTerm;
        searchNasaMedia(randomTerm);
    });
    
    // Initial search
    searchNasaMedia('earth');
}

function setupMarsGallery() {
    const fetchMarsBtn = document.getElementById('fetch-mars');
    const marsGallery = document.getElementById('mars-gallery');
    const roverSelect = document.getElementById('rover-select');
    const currentRover = document.getElementById('current-rover');
    
    // Fetch Mars photos
    function fetchMarsPhotos(rover) {
        marsGallery.innerHTML = '<div class="col-12 text-center py-4"><div class="spinner-border text-primary"></div><p class="mt-2">Loading Mars photos...</p></div>';
        
        fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${NASA_API_KEY}`)
            .then(response => response.json())
            .then(data => {
                marsGallery.innerHTML = '';
                
                if (!data.latest_photos || data.latest_photos.length === 0) {
                    marsGallery.innerHTML = '<div class="col-12 text-center py-4"><p>No photos available for this rover.</p></div>';
                    return;
                }
                
                data.latest_photos.slice(0, 12).forEach(photo => {
                    const card = createMarsPhotoCard(photo);
                    marsGallery.appendChild(card);
                });
                
                // Initialize Masonry layout
                new Masonry(marsGallery, {
                    itemSelector: '.media-card',
                    columnWidth: 300,
                    gutter: 20,
                    fitWidth: true
                });
            })
            .catch(error => {
                console.error('Error fetching Mars photos:', error);
                marsGallery.innerHTML = '<div class="col-12 text-center py-4"><p>Failed to load Mars photos. Please try again later.</p></div>';
            });
    }
    
    // Create Mars photo card
    function createMarsPhotoCard(photo) {
        const card = document.createElement('div');
        card.className = 'media-card';
        
        const imgSrc = photo.img_src;
        const title = `Sol ${photo.sol}: ${photo.camera.full_name}`;
        const date = new Date(photo.earth_date).toLocaleDateString();
        
        card.innerHTML = `
            <img src="${imgSrc}" alt="${title}">
            <div class="media-card-body">
                <h3 class="media-card-title">${title}</h3>
                <div class="media-card-date">${date}</div>
                <p class="media-card-description">Taken by ${photo.rover.name} rover on Martian day (sol) ${photo.sol}.</p>
            </div>
        `;
        
        return card;
    }
    
    // Event listeners
    fetchMarsBtn.addEventListener('click', () => {
        const rover = roverSelect.value;
        currentRover.textContent = rover.charAt(0).toUpperCase() + rover.slice(1);
        fetchMarsPhotos(rover);
    });
    
    roverSelect.addEventListener('change', () => {
        const rover = roverSelect.value;
        currentRover.textContent = rover.charAt(0).toUpperCase() + rover.slice(1);
        fetchMarsPhotos(rover);
    });
    
    // Initial load
    fetchMarsPhotos('curiosity');
}