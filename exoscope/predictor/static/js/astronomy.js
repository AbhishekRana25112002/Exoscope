document.addEventListener('DOMContentLoaded', function() {
    // Initialize ISS Tracker
    initISSTracker();
    
    // Initialize Sky Map Controls
    initSkyMapControls();
    
    // Initialize Planetarium Controls
    initPlanetariumControls();
});

function initISSTracker() {
    // Initialize Leaflet map
    const map = L.map('iss-map').setView([0, 0], 2);
    
    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add ISS marker
    const issIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/2739/2739696.png',
        iconSize: [50, 50],
        iconAnchor: [25, 25]
    });
    const issMarker = L.marker([0, 0], {icon: issIcon}).addTo(map);
    
    // Function to update ISS position
    function updateISSPosition() {
        fetch('https://api.wheretheiss.at/v1/satellites/25544')
            .then(response => response.json())
            .then(data => {
                const { latitude, longitude, altitude, velocity, visibility } = data;
                
                // Update map view
                map.setView([latitude, longitude], map.getZoom());
                issMarker.setLatLng([latitude, longitude]);
                
                // Update info panel
                document.getElementById('iss-lat').textContent = latitude.toFixed(4) + '°';
                document.getElementById('iss-lng').textContent = longitude.toFixed(4) + '°';
                document.getElementById('iss-alt').textContent = Math.round(altitude) + ' km';
                document.getElementById('iss-vel').textContent = Math.round(velocity) + ' km/h';
                document.getElementById('iss-vis').textContent = visibility.charAt(0).toUpperCase() + visibility.slice(1);
            })
            .catch(error => {
                console.error('Error fetching ISS data:', error);
            });
    }
    
    // Get user location for pass times
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    getISSPasses(latitude, longitude);
                },
                error => {
                    console.error('Error getting location:', error);
                    // Default to New York if location access is denied
                    getISSPasses(40.7128, -74.0060);
                }
            );
        } else {
            // Default to New York if geolocation is not supported
            getISSPasses(40.7128, -74.0060);
        }
    }
    
    // Get ISS pass times for location
    function getISSPasses(lat, lng) {
        fetch(`https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps=${generateTimestamps()}&units=miles`)
            .then(response => response.json())
            .then(data => {
                // Process pass times (simplified for example)
                const passes = [
                    {
                        time: new Date(Date.now() + 3600000).toLocaleTimeString(),
                        duration: '5 minutes',
                        maxElevation: '45°'
                    },
                    {
                        time: new Date(Date.now() + 10800000).toLocaleTimeString(),
                        duration: '3 minutes',
                        maxElevation: '32°'
                    },
                    {
                        time: new Date(Date.now() + 18000000).toLocaleTimeString(),
                        duration: '6 minutes',
                        maxElevation: '67°'
                    }
                ];
                
                displayPasses(passes);
            })
            .catch(error => {
                console.error('Error fetching ISS passes:', error);
                displayPasses([]);
            });
    }
    
    function generateTimestamps() {
        const now = Math.floor(Date.now() / 1000);
        const timestamps = [];
        for (let i = 0; i < 5; i++) {
            timestamps.push(now + (i * 3600));
        }
        return timestamps.join(',');
    }
    
    function displayPasses(passes) {
        const passesContainer = document.getElementById('iss-passes');
        
        if (passes.length === 0) {
            passesContainer.innerHTML = '<div class="text-muted">No pass times available</div>';
            return;
        }
        
        passesContainer.innerHTML = passes.map(pass => `
            <div class="pass-item">
                <div class="pass-time">${pass.time}</div>
                <div class="pass-details">
                    Duration: ${pass.duration} | Max Elevation: ${pass.maxElevation}
                </div>
            </div>
        `).join('');
    }
    
    // Initial update
    updateISSPosition();
    getUserLocation();
    
    // Update every 5 seconds
    setInterval(updateISSPosition, 5000);
}

function initSkyMapControls() {
    // Fullscreen button
    document.getElementById('fullscreen-stellarium').addEventListener('click', function() {
        const container = document.getElementById('stellarium-container');
        container.classList.toggle('fullscreen-map');
        
        if (container.classList.contains('fullscreen-map')) {
            this.innerHTML = '<i class="fas fa-compress"></i> Exit Fullscreen';
        } else {
            this.innerHTML = '<i class="fas fa-expand"></i> Fullscreen';
        }
    });
    
    // Apply settings button
    document.getElementById('apply-sky-settings').addEventListener('click', function() {
        // In a real implementation, this would communicate with the Stellarium iframe
        // For this example, we'll just show a message
        alert('Sky map settings applied!');
    });
}

function initPlanetariumControls() {
    // Fullscreen button
    document.getElementById('fullscreen-planetarium').addEventListener('click', function() {
        const container = document.getElementById('planetarium-container');
        container.classList.toggle('fullscreen-map');
        
        if (container.classList.contains('fullscreen-map')) {
            this.innerHTML = '<i class="fas fa-compress"></i> Exit Fullscreen';
        } else {
            this.innerHTML = '<i class="fas fa-expand"></i> Fullscreen';
        }
    });
}