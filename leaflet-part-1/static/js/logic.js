

let basmap = L.tileLayer(
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        attribution: 'Map data: &copy;'
    }
    );

let map = L.map("map", {
    center: [40.7, -94.5],
    zoom: 3
})

basmap.addTo(map);

function getColor(depth) {
    if (depth > 90) {
        return "#EA2C2C"
    } else if (depth > 70) {
        return "#EA822C"
    } else if (depth > 50) {
        return "#EE9C00"
    } else if (depth > 30) {
        return "#EECC00"
    } else if (depth > 10) {
        return "#D4EE00"
    }
    else {
        return "#98EE00"
    }
}

function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1
    }
    return magnitude*4
}


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    console.log(data);

    function styleInfo(feature) {
        return {
            opacity: 1, 
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.6
        }
    }
    L.geoJson(data, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,
        onEachFeature: function(feature, layer) {
            layer.bindPopup(`
                Magnitute: ${feature.properties.mag} <br>
                Depth: ${feature.geometry.coordinates[2]} <br>
                Location: ${feature.properties.place}
            `);
        }
    }).addTo(map);
    
    let legend = L.control({
        position: "bottomright"
    });

    legend.onAdd = function() {
        let container = L.DomUtil.create("div", "info legend");
        let grades = [-10, 10, 30, 50, 70, 90];
        let colors = ["#98ee00", "#D4EE00", "#EECC00","#EE9C00","#EA822C","EA2C2C"];
    
        for (let index = 0; index < grades.length; index++) {
            container.innerHTML += `<i style="background: ${colors[index]}"></i> ${grades[index]}+<br>`

        }
        return container
    }

    legend.addTo(map);

})