
var earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var earthquakes = L.layerGroup();


var grayscaleMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/light-v10"
});


var myMap = L.map("mapid", {
  center: [
    40.73, -74.0059
  ],
  zoom: 2,
  layers: [grayscaleMap, earthquakes]
});

d3.json(earthquakesURL, function(earthquakeData) {
  
  function markerSize(magnitude) {
    return magnitude * 4;
  };
 
  function chooseColor(depth) {

  if (depth > 90) {
    return "red";
  }
  else if(depth > 70){
    return "orangered";
  }
  else if(depth > 50){
    return "orange";
  } else if(depth > 30){
    return "gold";
  }
  else if(depth > 10){
    return "yellow";
  }
  else{
    return "lightgreen";
  }
  }

  
  L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, 
        // Set the style of the markers based on properties.mag
        {
          radius: markerSize(feature.properties.mag),
          fillColor: chooseColor(feature.geometry.coordinates[2]),
          fillOpacity: 0.7,
          color: "black",
          stroke: true,
          weight: 0.5
        }
      );
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h1>Location: " + feature.properties.place + "</h1><hr><p>Date: "
      + new Date(feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }
  }).addTo(earthquakes);
  
  earthquakes.addTo(myMap);

    // Add legend
  var legend = L.control({position: "bottomright"});
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend"),
    depth = [-10, 10, 30, 50, 70, 90];
    var labels = [];

    var legendInfo = "<h3 style='text-align: center'>Depth</h3>";
    
    div.innerHTML += legendInfo

    limits.forEach(function(limit, index) {
      labels.push('<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' +
      depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+'));
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;

  };
  legend.addTo(myMap);
});