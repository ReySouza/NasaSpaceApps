        document.addEventListener('DOMContentLoaded', function () {
            var map = L.map('map').setView([-29.0000, 24.0000], 5);

            var streetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
            });

            var satelliteMap = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
                attribution: 'Tiles &copy; Google',
                maxZoom: 20
            });

            var baseMaps = {
                "Street Map": streetMap,
                "Satellite Map": satelliteMap
            };

            L.control.layers(baseMaps).addTo(map);
            streetMap.addTo(map);

            var kmlUrl = 'bioscape_domain_20220201.kml';
        var kmlLayer = omnivore.kml(kmlUrl);
        kmlLayer.addTo(map);

        kmlLayer.on('ready', function () {
            map.fitBounds(kmlLayer.getBounds());

        });

        });
