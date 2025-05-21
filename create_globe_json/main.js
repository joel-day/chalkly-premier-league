// ! npm install canvas
const Hexasphere = require('./utils/hexasphere'); // or import Hexasphere from './hexasphere' if using ES6
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

// Helper functions
function assignIds(tiles) {
    let counter = 69;
    for (const t of tiles) {
        t.tileId = counter;
        counter += 1;
    }
};

function checkPentagon(tiles) {
    for (const t of tiles) {
        // Count the number of boundaries for each tile
        const boundaryCount = t.boundary.length;

        // Assign true if it's a pentagon (5 sides), false otherwise
        t.pentagon = (boundaryCount === 5);
    }
}

function assignLand(tiles, img, radius) {
    const land_tiles = [];

    function isLand(lat, lon) {
        // Convert lat/lon to x/y pixel coordinates
        const x = parseInt(img.width * (lon + 180) / 360);
        const y = parseInt(img.height * (lat + 90) / 180);

        const index = (y * pixelData.width + x) * 4;

        const r = pixelData.data[index];
        const g = pixelData.data[index + 1];
        const b = pixelData.data[index + 2];
        const alpha = pixelData.data[index + 3];

        // Print values for debugging
        console.log(`Lat: ${lat}, Lon: ${lon}, X: ${x}, Y: ${y}`);
        console.log(`RGB: (${r}, ${g}, ${b}), Alpha: ${alpha}`);

        // RGB to continent name mapping
        let continent = null;
        if (r === 0 && g === 0 && b === 0) {
            continent = "Velmara";
        } else if (r === 255 && g === 0 && b === 0) {
            continent = "Almira";
        } else if (r === 0 && g === 255 && b === 0) {
            continent = "Brontis";
        } else if (r === 0 && g === 0 && b === 255) {
            continent = "Caldra";
        } else if (r === 255 && g === 255 && b === 255) {
            continent = "Zevarn";
        }

        // Still return whether it's land and which continent
        return {
            land: alpha > 0,
            continent: alpha > 0 ? continent : 'na'
        };
    }

    const projectionCanvas = createCanvas(img.width, img.height);
    const projectionContext = projectionCanvas.getContext('2d');


    projectionCanvas.width = img.width;
    projectionCanvas.height = img.height;
    projectionContext.drawImage(img, 0, 0, img.width, img.height);

    var pixelData = projectionContext.getImageData(0, 0, img.width, img.height);

    for (const t of tiles) {
        const latLon = t.getLatLon(radius);

        const { land, continent } = isLand(latLon.lat, latLon.lon);

        t.land = land;
        t.continent = continent;
        land_tiles.push(t);


    }

    return land_tiles; // Optional, returns list of city tiles
};

function assignCities(allTiles, num_cities) {
    const landTiles = allTiles.filter(t => t.land && t.pentagon === false);
    const city_tiles = [];
    
    // Shuffle the land tiles randomly
    for (let i = landTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [landTiles[i], landTiles[j]] = [landTiles[j], landTiles[i]];
    }

    for (const tile of landTiles) {
        // Check if any neighbors are already cities
        const hasCityNeighbor = tile.neighbors.some(n => n.isCity);
        if (!hasCityNeighbor) {
            tile.isCity = true;
            city_tiles.push(tile);
            if (city_tiles.length >= num_cities) break;
        } else {
            tile.isCity = false;
        }
    }

    // For all other land tiles not selected, ensure isCity is false
    for (const tile of allTiles) {
        if (!tile.isCity) tile.isCity = false;
    }

    return city_tiles; // Optional, returns list of city tiles
}

// Main function to process tiles and add isLand property
async function processTiles(num_cities, projection_image, num_divisions) {
    
    // Generate raw hexasphere json
    const hex = new Hexasphere(30, num_divisions, .95);

    // Assign Ids
    assignIds(hex.tiles);

    checkPentagon(hex.tiles);

    // Assign Land/Water based on hand drawn 2D projection
    const img = await loadImage(projection_image);
    var land_tiles = assignLand(hex.tiles, img, hex.radius);

    // Assign a custom number of cities
    var city_tiles = assignCities(hex.tiles, num_cities);

    // Write to a file
    const jsonData = hex.toJson();
    fs.writeFileSync('visualize_globe_data/hexasphere.json', jsonData, 'utf8');

    return { city_tiles, land_tiles };

};

// Run the function
var projection_image = './create_globe_json/projection.png'
var num_cities = 75;
var num_divisions = 25;

(async () => {
  const { city_tiles, land_tiles } = await processTiles(num_cities, projection_image, num_divisions);
})();

