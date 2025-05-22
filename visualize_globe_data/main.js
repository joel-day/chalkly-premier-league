import *as THREE from "three"

// For working with the tiles from the json
class VisualTile {
  constructor(data) {
    this.tileId = data.tileId;
    this.centerPoint = data.centerPoint;
    this.neighbors = data.neighbors;
    this.boundary = data.boundary.map(p => ({
      x: parseFloat(p.x),
      y: parseFloat(p.y),
      z: parseFloat(p.z)
    }));
    this.pentagon = data.pentagon;
    this.land = data.land;
    this.isCity = data.city;
    this.continent = data.continent;
    this.mesh = null;
  }
}

// All items related to rendering this globe
class GlobeApp {
  constructor() {

    // THREE configuration for globe visualization
    this.container = document.body;
    this.renderer = this.createRenderer();
    this.camera = this.createCamera();
    this.scene = new THREE.Scene();
    this.globeGroup = new THREE.Object3D();
    this.scene.add(this.globeGroup);

    // Feature 1: For moving the globe with the mouse
    this.isDragging = false;
    this.previousMousePosition = new THREE.Vector2();

    // Feature 2: Center and resize the globe on page resize
    this.onWindowResize = this.onWindowResize.bind(this);

    // Feature 3: Double click tile for an informative pop-up window
    this.onDoubleClick = this.onDoubleClick.bind(this);

    // Feature 4: To highlight the tile the mouse in hovering over
    this.onMouseMoveHighlight = this.onMouseMoveHighlight.bind(this);
    this.currentlyHoveredMesh = null;
    this.originalColors = new Map();

    // Feature 5: For zoom in and out with wheel
    this.targetZoom = this.camera.position.z;
    this.minZoom = 60;
    this.maxZoom = 120;

    // Used in multiple features
    this.tileMap = new Map();
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
  
    // Visualize the damn thing
    this.animate = this.animate.bind(this);

    this.init()
    }

    init() {
        // This solves a problem with window size when rendering
        this.onWindowResize();

        // Load the data when the class is called
        this.loadTiles('hexasphere_v1.json').then(() => {
            console.log('Globe fully initialized');
            this.animate();
        });
        
        // Add event listeners for the globe's interactive features
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mousemove', this.onMouseMoveDrag.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        window.addEventListener('dblclick', this.onDoubleClick.bind(this));
        window.addEventListener('mousemove', this.onMouseMoveHighlight.bind(this));
        window.addEventListener('wheel', this.onWheel.bind(this), { passive: false });

        // Add a close button to the popup window in the doubleclick feature
        const closeBtn = document.getElementById('closePopupBtn');
        if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('tileInfoPopup').style.display = 'none';
        });
        }
    }

    // Helper function for loadTiles.Configure custom tile materials
    getTileMaterial(tile) {

        function createMaterials(colors) {
            return colors.map(color => new THREE.MeshBasicMaterial({ color, transparent: true }));
        }

        const materialsMap = {
            default: createMaterials([
                0x7cfc00, 0x397d02, 0x77ee00, 0x61b329, 0x83f52c, 0x83f52c, 0x4cbb17, 0x00ee00, 0x00aa11
            ]),
            velmara: createMaterials([
                0xba3f35, 0xc11109, 0xba3f35, 0x854442, 0xba3f35, 0xc11109, 0xba3f35, 0xba3f35, 0x854442
            ]),
            almira: createMaterials([
                0x3b5998, 0x8b9dc3, 0x003366, 0x3b5998, 0x3b5998, 0x8b9dc3, 0x8b9dc3, 0x3b5998
            ]),
            brontis: createMaterials([
                0xffdc73, 0xbf9b30, 0xffbf00, 0xffcf40, 0xffdc73, 0xbf9b30, 0xffbf00, 0xa67c00, 0xffcf40
            ]),
            caldra: createMaterials([
                0x234d20, 0x36802d, 0x234d20, 0x77ab59, 0x234d20, 0x36802d, 0x36802d, 0x77ab59, 0x234d20
            ]),
            ocean: createMaterials([
                0x0f2342, 0x0f1e38
            ]),
            city: createMaterials([
                0xe6e6fa
            ])
        };

        if (tile.isCity) {
            return materialsMap["city"][0].clone();
        } else if (tile.land) {
            const continentKey = tile.continent?.toLowerCase();
            const materials = materialsMap[continentKey] || materialsMap["land"];
            return materials[Math.floor(Math.random() * materials.length)].clone();
        } else {
            const oceanMaterials = materialsMap["ocean"];
            return oceanMaterials[Math.floor(Math.random() * oceanMaterials.length)].clone();
    }
}          

    // Load the data from a json file
    async loadTiles(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            data.tiles.forEach(tileData => {
                // Initiate it as a tile object
                const tile = new VisualTile(tileData);

                function getTileMaterial(tile) {

                        function createMaterials(colors) {
                            return colors.map(color => new THREE.MeshBasicMaterial({ color, transparent: true }));
                        }

                        const materialsMap = {
                            default: createMaterials([
                                0x7cfc00, 0x397d02, 0x77ee00, 0x61b329, 0x83f52c, 0x83f52c, 0x4cbb17, 0x00ee00, 0x00aa11
                            ]),
                            velmara: createMaterials([
                                0xba3f35, 0xc11109, 0xba3f35, 0x854442, 0xba3f35, 0xc11109, 0xba3f35, 0xba3f35, 0x854442
                            ]),
                            almira: createMaterials([
                                0x3b5998, 0x8b9dc3, 0x003366, 0x3b5998, 0x3b5998, 0x8b9dc3, 0x8b9dc3, 0x3b5998
                            ]),
                            brontis: createMaterials([
                                0xffdc73, 0xbf9b30, 0xffbf00, 0xffcf40, 0xffdc73, 0xbf9b30, 0xffbf00, 0xa67c00, 0xffcf40
                            ]),
                            caldra: createMaterials([
                                0x234d20, 0x36802d, 0x234d20, 0x77ab59, 0x234d20, 0x36802d, 0x36802d, 0x77ab59, 0x234d20
                            ]),
                            ocean: createMaterials([
                                0x0f2342, 0x0f1e38
                            ]),
                            city: createMaterials([
                                0xe6e6fa
                            ])
                        };

                        if (tile.isCity) {
                            return materialsMap["city"][0].clone();
                        } else if (tile.land) {
                            const continentKey = tile.continent?.toLowerCase();
                            const materials = materialsMap[continentKey] || materialsMap["land"];
                            return materials[Math.floor(Math.random() * materials.length)].clone();
                        } else {
                            const oceanMaterials = materialsMap["ocean"];
                            return oceanMaterials[Math.floor(Math.random() * oceanMaterials.length)].clone();
                    }
                }

                // Build geometry
                const geometry = new THREE.BufferGeometry();
                const vertices = [];
                const indices = [];
                tile.boundary.forEach(bp => {
                    vertices.push(bp.x, bp.y, bp.z);
                });

                // Create faces based on number of vertices (assuming pentagon or hexagon)
                indices.push(0, 1, 2);
                indices.push(0, 2, 3);
                indices.push(0, 3, 4);
                if (vertices.length / 3 > 5) {
                    indices.push(0, 4, 5);
                }
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                geometry.setIndex(indices);
                geometry.computeVertexNormals();

                // Customize tile colors
                const material = getTileMaterial(tile);
                material.opacity = 1;
                material.transparent = true;

                // Add tile to scene
                const mesh = new THREE.Mesh(geometry, material);
                this.scene.add(mesh);
                this.globeGroup.add(mesh);
                tile.mesh = mesh;
                this.tileMap.set(mesh.uuid, tile);
            });
            console.log('Tiles loaded:', this.tileMap.size);

            } catch (error) {
            console.error('Error loading tiles:', error);
        }
    }

    // Feature 1: For moving the globe with the mouse
    onMouseDown(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.globeGroup.children);

        if (intersects.length > 0) {
        this.isDragging = true;
        this.previousMousePosition.set(event.clientX, event.clientY);
        this.intersectedPoint = intersects[0].point;
        }
    }
    onMouseMoveDrag(event) {
        if (!this.isDragging) return;

        const deltaX = event.clientX - this.previousMousePosition.x;
        const deltaY = event.clientY - this.previousMousePosition.y;

        const rotationSpeed = 0.005;

        this.globeGroup.rotation.y += deltaX * rotationSpeed;
        this.globeGroup.rotation.x += deltaY * rotationSpeed;

        // Clamp vertical rotation to prevent flipping
        this.globeGroup.rotation.x = Math.min(Math.max(this.globeGroup.rotation.x, -Math.PI / 2), Math.PI / 2);

        this.previousMousePosition.set(event.clientX, event.clientY);
    }
    onMouseUp(event) {
        this.isDragging = false;
        this.intersectedPoint = null;
    }

    // Feature 2: Center and resize the globe on page resize
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Feature 3: Double click tile for an informative pop-up window
    onDoubleClick(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.globeGroup.children);

        if (intersects.length > 0) {
        const intersectedMesh = intersects[0].object;
        const tile = this.tileMap.get(intersectedMesh.uuid);

        if (tile) {
            const infoHtml = `
            <strong>Tile ID:</strong> ${tile.tileId}<br>
            <strong>Center Point:</strong> ${JSON.stringify(tile.centerPoint)}<br>
            <strong>Continent:</strong> ${JSON.stringify(tile.continent)}<br>
            <strong>Neighbors:</strong> ${tile.neighbors}
            `;

            const popup = document.getElementById('tileInfoPopup');
            const content = document.getElementById('popupContent');
            content.innerHTML = infoHtml;

            popup.style.left = event.clientX + 'px';
            popup.style.top = event.clientY + 'px';
            popup.style.display = 'block';
        }
        }
    }

    //Feature 4: To highlight the tile the mouse in hovering over
    onMouseMoveHighlight(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.globeGroup.children);

        if (intersects.length > 0) {
        const intersectedMesh = intersects[0].object;

        if (this.currentlyHoveredMesh !== intersectedMesh) {
            if (this.currentlyHoveredMesh) {
            const origColor = this.originalColors.get(this.currentlyHoveredMesh.uuid);
            if (origColor) {
                this.currentlyHoveredMesh.material.color.set(origColor);
            }
            }

            if (!this.originalColors.has(intersectedMesh.uuid)) {
            this.originalColors.set(intersectedMesh.uuid, intersectedMesh.material.color.getHex());
            }

            intersectedMesh.material.color.set(0xffffff);

            this.currentlyHoveredMesh = intersectedMesh;
        }
        } else {
        if (this.currentlyHoveredMesh) {
            const origColor = this.originalColors.get(this.currentlyHoveredMesh.uuid);
            if (origColor) {
            this.currentlyHoveredMesh.material.color.set(origColor);
            }
            this.currentlyHoveredMesh = null;
        }
        }
    }

    // Feature 5: For zoom in and out with wheel
    onWheel(event) {
        event.preventDefault();

        this.targetZoom += event.deltaY * 0.1;
        this.targetZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.targetZoom));
    }
    
    // THREE configuration for globe visualization
    createRenderer() {
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(this.width, this.height);
        this.container.appendChild(renderer.domElement);
        return renderer;
    }
    createCamera() {
        const aspect = this.width / this.height;
        const camera = new THREE.PerspectiveCamera(65, aspect, 1, 200);
        camera.position.z = 100;
        return camera;
    }

    // Render the damn thing
    animate() {
        requestAnimationFrame(this.animate); // `this.animate` is already bound in constructor
        this.camera.position.z += (this.targetZoom - this.camera.position.z) * 0.1;
        this.renderer.render(this.scene, this.camera);
        }
}

window.addEventListener("DOMContentLoaded", () => {
    
    // Render the globe
    new GlobeApp();
});







