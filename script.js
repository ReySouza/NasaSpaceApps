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


    const toggleButton = document.getElementById('toggleKML');
        let kmlLayerVisible = false;

         toggleButton.addEventListener('click', function () {
      if (kmlLayerVisible) {
        kmlLayer.setStyle({ opacity: 0, fillOpacity: 0 });
    } else {
        kmlLayer.setStyle({ opacity: 1, fillOpacity: 1 });
    }
        kmlLayerVisible = !kmlLayerVisible;
    });
});
