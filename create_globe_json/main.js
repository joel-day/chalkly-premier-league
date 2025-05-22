/////////////////////////////////////
// This file creates a json file to later render a 3d globe in the '/visualize_globe_data/main.js' file. 
// The json file is a dctionary of tile data, where each tile is a ahexagon on the 3d globe.
// The pint and face javascript files are used in the hexasphere.js file only
// If you want to add more tile features, make sure to it to the tile.tojson() function in the tile.js
// The input is a png file which will determine which tiles are land, and identify continents. 
// An equal number of cities are randomly placed each continent.
// num_divisions = 25 leads to around 6000 tiles 
///////////////////////////////////////

const Hexasphere = require('./utils/hexasphere');
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const { assign_land_continent } = require('./utils/helpers');
const { shuffle } = require('./utils/helpers');

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

    // Creates an off-screen HTML canvas element with the same width and height the image
    const projectionCanvas = createCanvas(img.width, img.height);
    // Gets the 2D drawing context for the canvas
    const projectionContext = projectionCanvas.getContext('2d');
    // This renders the image pixels onto the canvas 
    projectionContext.drawImage(img, 0, 0, img.width, img.height);
    // Returns pixel properties object containing the 4 data properties (red, green, blue, alpha)
    var pixelData = projectionContext.getImageData(0, 0, img.width, img.height);

    // Loop through each tile, get its location, assign land continent features based on pixelData
    for (const tile of tiles) {
        const { lat, lon } = tile.getLatLon(radius);
        const { land, continent } = assign_land_continent(lat, lon, img, pixelData);

        tile.land = land;
        tile.continent = continent;
    }
}

function assignCities(allTiles, num_cities) {
    const city_tiles = [];

    // Reset city status on all tiles
    allTiles.forEach(tile => tile.isCity = false);

    // Filter valid land tiles (non-pentagon)
    const landTiles = allTiles.filter(t => t.land && !t.pentagon);

    // Group land tiles by continent
    const continents = {};
    for (const tile of landTiles) {
        const continent = tile.continent;
        if (!continent) continue; // Skip if continent is undefined
        if (!continents[continent]) {
            continents[continent] = [];
        }
        continents[continent].push(tile);
    }

    // Assign (n = num_cities) cities per continent
    for (const [continent, tiles] of Object.entries(continents)) {
        const citiesToPlace = num_cities[continent] || 0;
        if (tiles.length === 0 || citiesToPlace === 0) continue;

        shuffle(tiles); // Randomize tile order

        let placed = 0;
        for (const tile of tiles) {
            if (placed >= citiesToPlace) break;

            // Prevents cities from being on tiles next to each other
            const hasCityNeighbor = tile.neighbors.some(n => n.isCity === true);
            if (!hasCityNeighbor) {
                tile.isCity = true;
                city_tiles.push(tile);
                placed++;
            }
        }

        if (placed < citiesToPlace) {
            console.warn(`Not enough valid city tiles in ${continent}. Only placed ${placed} of ${citiesToPlace}.`);
        }
    }
}

// Main function
async function processTiles(num_cities, projection_image, num_divisions) {
    
    // Generate raw hexasphere json
    const hex = new Hexasphere(30, num_divisions, .95);

    // Assign Ids
    assignIds(hex.tiles);

    // Prevent putting cities on the few pentagons that make this globe possible
    checkPentagon(hex.tiles);

    // Assign Land/Water based on hand drawn 2D projection
    const img = await loadImage(projection_image);
    assignLand(hex.tiles, img, hex.radius);

    // Assign a custom number of cities
    assignCities(hex.tiles, num_cities);

    // Write to a file
    const jsonData = hex.toJson();
    fs.writeFileSync('visualize_globe_data/hexasphere.json', jsonData, 'utf8');
};

// Run the Main function
const num_cities = {
    Velmara: 8,   // 490 tiles on my custom map
    Almira: 8,    // 484 tiles on my custom map
    Brontis: 8,   // 487 tiles on my custom map
    Caldra: 8     // 486 tiles on my custom map
};

(async () => {
  await processTiles(num_cities, './create_globe_json/projection.png', 25);
})();

