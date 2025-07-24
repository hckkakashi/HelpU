let map;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    const userLat = position.coords.latitude;
    const userLon = position.coords.longitude;

    map = L.map('map').setView([userLat, userLon], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    L.marker([userLat, userLon]).addTo(map)
      .bindPopup("You are here")
      .openPopup();

    const queryURL = `https://nominatim.openstreetmap.org/search?format=json&q=rehabilitation+center&limit=20&bounded=1&viewbox=${userLon - 0.05},${userLat + 0.05},${userLon + 0.05},${userLat - 0.05}`;

    fetch(queryURL)
      .then(response => response.json())
      .then(data => {
        data.forEach(place => {
          L.marker([place.lat, place.lon])
            .addTo(map)
            .bindPopup(`<b>${place.display_name}</b>`);
        });
      })
      .catch(error => {
        console.error("Search error:", error);
        alert("Could not fetch nearby centers.");
      });

  }, error => {
    alert("Location access denied.");
  });
} else {
  alert("Geolocation not supported by your browser.");
}
