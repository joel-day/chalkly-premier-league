
import *as THREE from "three"

$(function() {


    function visual_tile(data) {
        this.tileId = data.tileId;
        this.centerPoint = data.centerPoint;
        this.neighbors = data.neighbors;
        this.boundary = data.boundary.map(p => ({
            x: parseFloat(p.x),
            y: parseFloat(p.y),
            z: parseFloat(p.z)
        }));
        this.pentagon = data.pentagon;
        this.isLand = data.isLand;
        this.isCity = data.city;
        this.mesh = null;
    }

    console.log(THREE.REVISION);
    var width = $(window).innerWidth();
    var height = $(window).innerHeight()-10;

    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( width, height);

    var cameraDistance = 65;
    var camera = new THREE.PerspectiveCamera( cameraDistance, width / height, 1, 200);
    camera.position.z = 100;

    var scene = new THREE.Scene();
    // scene.fog = new THREE.Fog( 0x000000, cameraDistance*.4, cameraDistance * 1.2);
    document.body.appendChild(renderer.domElement);



    var globeGroup = new THREE.Object3D();
    scene.add(globeGroup);

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var isDragging = false;
    var previousMousePosition = new THREE.Vector2();
    var intersectedPoint = null;


    var meshMaterials = [];
    meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x7cfc00, transparent: true}));
    meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x397d02, transparent: true}));
    meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x77ee00, transparent: true}));
    meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x61b329, transparent: true}));
    meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x83f52c, transparent: true}));
    meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x83f52c, transparent: true}));
    meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x4cbb17, transparent: true}));
    meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x00ee00, transparent: true}));
    meshMaterials.push(new THREE.MeshBasicMaterial({color: 0x00aa11, transparent: true}));

    var oceanMaterial = []
    oceanMaterial.push(new THREE.MeshBasicMaterial({color: 0x0f2342, transparent: true}));
    oceanMaterial.push(new THREE.MeshBasicMaterial({color: 0x0f1e38, transparent: true}));

    var cityMaterial = []
    cityMaterial.push(new THREE.MeshBasicMaterial({color: 0xffbf00, transparent: true}));
    
    var tileMap = new Map();

    fetch('hexasphere.json')
        .then(response => response.json())
        .then(data => {
            var tiles = data.tiles;
            tiles.forEach(tileData => {
                var t = new visual_tile(tileData);

                // var geometry = new THREE.BufferGeometry();
                // t.boundary.forEach(bp => {
                //     geometry.vertices.push(new THREE.Vector3(bp.x, bp.y, bp.z));
                // });

                // // Create Faces from boundary points
                // geometry.faces.push(new THREE.Face3(0, 1, 2));
                // geometry.faces.push(new THREE.Face3(0, 2, 3));
                // geometry.faces.push(new THREE.Face3(0, 3, 4));
                // if (geometry.vertices.length > 5) {
                //     geometry.faces.push(new THREE.Face3(0, 4, 5));
                // }

                var geometry = new THREE.BufferGeometry();

                const vertices = [];
                const indices = [];

                // Collect vertices
                t.boundary.forEach(bp => {
                vertices.push(bp.x, bp.y, bp.z);
                });

                // Create faces (triangles) by defining indices
                indices.push(0, 1, 2);
                indices.push(0, 2, 3);
                indices.push(0, 3, 4);

                if (vertices.length / 3 > 5) {
                indices.push(0, 4, 5);
                }

                // Convert to typed arrays and set attributes
                geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                geometry.setIndex(indices);

                var material;

                if (t.isCity) {
                    material = cityMaterial[0].clone();  // city overrides everything
                } else if (t.isLand) {
                    material = meshMaterials[Math.floor(Math.random() * meshMaterials.length)].clone();
                } else {
                    material = oceanMaterial[Math.floor(Math.random() * oceanMaterial.length)].clone();
                }

                material.opacity = 1;
                material.transparent = true;

                var mesh = new THREE.Mesh(geometry, material);
                scene.add(mesh);
                globeGroup.add(mesh);
                t.mesh = mesh;
                tileMap.set(mesh.uuid, t);
            });

            console.log('Tiles loaded:', globeGroup.children.length);

            camera.position.z = 100;


            renderer.render(scene, camera);


    })
    .catch(err => console.error('Error loading hexasphere.json:', err));


    function onMouseDown(event) {

        // Normalize mouse coordinates (-1 to 1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // Intersect objects inside globeGroup
        var intersects = raycaster.intersectObjects(globeGroup.children);

        if (intersects.length > 0) {
            isDragging = true;
            previousMousePosition.set(event.clientX, event.clientY);
            intersectedPoint = intersects[0].point;
            // Optional: You can store the normal or some vector to track drag direction
        }
    }

    function onMouseMove(event) {
        if (!isDragging) return;

        var deltaX = event.clientX - previousMousePosition.x;
        var deltaY = event.clientY - previousMousePosition.y;

        var rotationSpeed = 0.005;

        // Rotate the globeGroup based on mouse movement
        globeGroup.rotation.y += deltaX * rotationSpeed;
        globeGroup.rotation.x += deltaY * rotationSpeed;

        // Clamp vertical rotation to prevent flipping
        globeGroup.rotation.x = Math.min(Math.max(globeGroup.rotation.x, -Math.PI / 2), Math.PI / 2);


        // // Apply rotation around world axes for full freedom
        // globeGroup.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), deltaX * rotationSpeed);
        // globeGroup.rotateOnAxis(new THREE.Vector3(1, 0, 0), deltaY * rotationSpeed);


        previousMousePosition.set(event.clientX, event.clientY);
    }

    function onMouseUp(event) {
        isDragging = false;
        intersectedPoint = null;
    }

    var animate = function () {
        requestAnimationFrame(animate);
        // globeGroup.rotation.y += 0.005;
        renderer.render(scene, camera);
    };

    window.addEventListener('mousemove', function(event) {
        onMouseMoveHighlight(event);
    });

    animate();

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);


    // resize compatability
    function onWindowResize(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

    };

    window.addEventListener( 'resize', onWindowResize, false );


    function onDoubleClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(globeGroup.children);

        if (intersects.length > 0) {
            var intersectedMesh = intersects[0].object;

            const tile = tileMap.get(intersectedMesh.uuid);

            if (tile) {
                const infoHtml = `
                    <strong>Tile ID:</strong> ${tile.tileId}<br>
                    <strong>Center Point:</strong> ${JSON.stringify(tile.centerPoint)}<br>
                    <strong>Neighbors:</strong> ${tile.neighbors}
                    }
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

    const closeBtn = document.getElementById('closePopupBtn');
    closeBtn.addEventListener('click', () => {
        document.getElementById('tileInfoPopup').style.display = 'none';
    });

    window.addEventListener('dblclick', onDoubleClick);


    let currentlyHoveredMesh = null;
    const originalColors = new Map();  // Map mesh.uuid -> original color

    function onMouseMoveHighlight(event) {
        // Normalize mouse coordinates (-1 to 1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // Intersect objects inside globeGroup
        const intersects = raycaster.intersectObjects(globeGroup.children);

        if (intersects.length > 0) {
            const intersectedMesh = intersects[0].object;

            if (currentlyHoveredMesh !== intersectedMesh) {
                // Restore old hovered mesh color
                if (currentlyHoveredMesh) {
                    let origColor = originalColors.get(currentlyHoveredMesh.uuid);
                    if (origColor) {
                        currentlyHoveredMesh.material.color.set(origColor);
                    }
                }

                // Save original color if not saved
                if (!originalColors.has(intersectedMesh.uuid)) {
                    originalColors.set(intersectedMesh.uuid, intersectedMesh.material.color.getHex());
                }

                // Set new hovered mesh color to white
                intersectedMesh.material.color.set(0xffffff);

                currentlyHoveredMesh = intersectedMesh;
            }
        } else {
            // No intersection - restore old hovered mesh color
            if (currentlyHoveredMesh) {
                let origColor = originalColors.get(currentlyHoveredMesh.uuid);
                if (origColor) {
                    currentlyHoveredMesh.material.color.set(origColor);
                }
                currentlyHoveredMesh = null;
            }
        }
    }

});







