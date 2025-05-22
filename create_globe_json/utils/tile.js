var Point = require('./point');
const { calculateSurfaceNormal } = require('./helpers');
const { pointingAwayFromOrigin } = require('./helpers');


class Tile {
    constructor(centerPoint, hexSize) {

        this.centerPoint = centerPoint;
        this.faces = centerPoint.getOrderedFaces();
        this.pentagon = false;
        this.land = false;
        this.isCity = false;
        this.continent = null;

        this.boundary = [];
        this.neighborIds = [];
        this.neighbors = [];
        this.buildBoundaryAndNeighbors();

        hexSize = Math.max(0.01, Math.min(1.0, hexSize));
        this.hexSize = hexSize

        // Some of the faces are pointing in the wrong direction
        // Fix this.  Should be a better way of handling it
        // than flipping them around afterwards
        const normal = calculateSurfaceNormal(this.boundary[1], this.boundary[2], this.boundary[3]);
        if (!pointingAwayFromOrigin(this.centerPoint, normal)) {
            this.boundary.reverse();
        }
    }

    getLatLon(radius, boundaryNum) {
        let point = this.centerPoint;
        if (typeof boundaryNum === "number" && boundaryNum < this.boundary.length) {
            point = this.boundary[boundaryNum];
        }
        const phi = Math.acos(point.y / radius); // latitude
        const theta = (Math.atan2(point.x, point.z) + Math.PI + Math.PI / 2) % (2 * Math.PI) - Math.PI; // longitude

        return {
            lat: (180 * phi / Math.PI) - 90,
            lon: 180 * theta / Math.PI
        };
    }

    scaledBoundary(scale) {
        scale = Math.max(0, Math.min(1, scale));
        return this.boundary.map(point => this.centerPoint.segment(point, 1 - scale));
    }

    toJson() {
        return {
            tileId: this.tileId,
            centerPoint: this.centerPoint.toJson(),
            neighbors: this.neighbors.map(neighbor => neighbor.tileId),
            // boundary: this.boundary.map(point => point.toJson()),
            pentagon: this.pentagon,
            land: this.land,
            city: this.isCity,
            continent: this.continent,
        };
    }

    toString() {
        return this.centerPoint.toString();
    }

    buildBoundaryAndNeighbors() {
        var neighborHash = {};
        for(var f=0; f< this.faces.length; f++){
            // build boundary
            this.boundary.push(this.faces[f].getCentroid().segment(this.centerPoint, this.hexSize));

            // get neighboring tiles
            var otherPoints = this.faces[f].getOtherPoints(this.centerPoint);
            for(var o = 0; o < 2; o++){
                neighborHash[otherPoints[o]] = 1;
            }

        }

        this.neighborIds = Object.keys(neighborHash);
        }
    }

module.exports = Tile;