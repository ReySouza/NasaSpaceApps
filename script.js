document.addEventListener('DOMContentLoaded', function () {
    const map = L.map('map').setView([-29.0000, 24.0000], 5);

    const streetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
    });

    const satelliteMap = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        attribution: 'Tiles &copy; Google',
        maxZoom: 20
    });

    const baseMaps = {
        "Street Map": streetMap,
        "Satellite Map": satelliteMap
    };

    L.control.layers(baseMaps).addTo(map);
    streetMap.addTo(map);

    const kmlUrl = 'bioscape_domain_20220201.kml';
    const kmlLayer = omnivore.kml(kmlUrl, {
        style: function (feature) {
            return {
                fillColor: 'transparent',
                color: 'blue',
                weight: 2,
            };
        }
    });

    kmlLayer.addTo(map);

    kmlLayer.on('ready', function () {
        map.fitBounds(kmlLayer.getBounds());
    });

    kmlLayer.on('error', function (error) {
        console.error('Error loading KML layer:', error);
    });

    let activeImageIndex = -1; // Variable to track the active image overlay
    const imageUrls = [
        'mapa_geologia.png',
        'mapa_geomorf.png',
        'Fire.png',
        'mapa_solo.png',
        'NDVI_Litoral.png',
        'NDVI_africa.png',
        'EMIT1.png',
    ];

    const imageBoundsArray = [
        [[-28.844, 14.618], [-34.142, 25.708]],  // Image 1 bounds
        [[-28.844, 14.618], [-34.142, 25.708]],  // Image 2 bounds
        [[-17.1369, 38.3144], [-37.5057, 10.8166]],  // Image 3 bounds
        [[-28.844, 14.618], [-34.142, 25.708]],  // Image 4 bounds
        [[-33.4985, 17.287], [-35.662, 22.855]],  // Image 5 bounds
        [[-12.566, 26.795], [-31.443, 36.74]],  // Image 6 bounds
        [[-33.018, 19.98], [-33.014, 21.242]],  // Image 7 bounds
    ];

            const imageOverlays = imageUrls.map((imageUrl, index) => {
                const bounds = imageBoundsArray[index];
                const imageOverlay = L.imageOverlay(imageUrl, bounds).addTo(map);

                // Add a click event listener to each image overlay
                imageOverlay.on('click', function () {
                    openSideMenu(index);
                });

                return imageOverlay;
            });

            // Function to open the side menu and display image details
            function openSideMenu(imageIndex) {
                const sideMenu = document.getElementById('side-menu');
                const sideMenuContent = document.getElementById('side-menu-content');

                // Add image details to the side menu content
                sideMenuContent.innerHTML = `
                    <h2>Image Details</h2>
                    <p>Image ${imageIndex + 1} details go here.</p>
                `;

                // Open the side menu
                sideMenu.classList.add('open');
            }

            // Create and add buttons to toggle image overlays
            for (let i = 0; i < imageUrls.length; i++) {
                const button = L.Control.extend({
                    options: {
                        position: 'topleft'
                    },

                    onAdd: function () {
                        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                        container.innerHTML = `<button class="leaflet-control-button" data-index="${i}">Toggle Image ${i + 1}</button>`;
                        L.DomEvent.disableClickPropagation(container);

                        L.DomEvent.on(container, 'click', function (e) {
                            const index = e.target.getAttribute('data-index');
                            toggleImageOverlay(index);
                        });

                        return container;
                    }
                });

                map.addControl(new button());
            }

            // Function to toggle image overlays
            function toggleImageOverlay(index) {
                const imageOverlay = imageOverlays[index];
                if (imageOverlay) {
                    if (activeImageIndex === index) {
                        // If the same image is clicked again, remove it
                        map.removeLayer(imageOverlay);
                        activeImageIndex = -1;
                    } else {
                        // Remove the active image overlay (if any)
                        if (activeImageIndex !== -1) {
                            map.removeLayer(imageOverlays[activeImageIndex]);
                        }
                        // Add the clicked image overlay
                        imageOverlay.addTo(map);
                        activeImageIndex = index;
                        openSideMenu(index);
                    }
                }
            }
        });
