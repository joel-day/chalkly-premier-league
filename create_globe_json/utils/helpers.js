// create_globe_js/main.js
// Helper function for assign_land_continent
function getContinentFromColor(r, g, b) {
    const colorMap = {
        "0,0,0": "Velmara",
        "255,0,0": "Almira",
        "0,255,0": "Brontis",
        "0,0,255": "Caldra",
        "255,255,255": "Zevarn"
    };
    return colorMap[`${r},${g},${b}`] || null;
}

// create_globe_js/main.js
// Checks if the tile location is on land or water. If land, check which continent
// I export a pixel png image with up to 5 colors. The colors, as (r, g, b, alpha) determine continents
export function assign_land_continent(lat, lon, img, pixelData) {
    const x = parseInt(img.width * (lon + 180) / 360);
    const y = parseInt(img.height * (lat + 90) / 180);

    const index = (y * pixelData.width + x) * 4;
    const [r, g, b, alpha] = pixelData.data.slice(index, index + 4);

    const continent = getContinentFromColor(r, g, b);

    return {
        land: alpha > 0,
        continent: alpha > 0 ? continent : 'na'
    };
}

// create_globe_js/main.js
export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// tile.js 
// helper for calculateSurfaceNormal
function vector(p1, p2){
    return {
        x: p2.x - p1.x,
        y: p2.y - p1.y,
        z: p2.z - p1.z
    }

}

// tile.js
export function calculateSurfaceNormal(p1, p2, p3) {
    const U = vector(p1, p2);  // declare with const or let
    const V = vector(p1, p3);

    const N = {
        x: U.y * V.z - U.z * V.y,
        y: U.z * V.x - U.x * V.z,
        z: U.x * V.y - U.y * V.x
    };

    return N;
}

// tile.js
export function pointingAwayFromOrigin(p, v){
    return ((p.x * v.x) >= 0) && ((p.y * v.y) >= 0) && ((p.z * v.z) >= 0)
}