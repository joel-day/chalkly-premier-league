$(window).load(function(){

    var width = $(window).innerWidth();
    var height = $(window).innerHeight()-10;

    var renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( width, height);

    var cameraDistance = 65;
    var camera = new THREE.PerspectiveCamera( cameraDistance, width / height, 1, 200);
    camera.position.z = -cameraDistance;

    var scene = new THREE.Scene();
    // scene.fog = new THREE.Fog( 0x000000, cameraDistance*.4, cameraDistance * 1.2);


    
    // Land Island from custom drawn png
    var img = document.getElementById("projection");
    var projectionCanvas = document.createElement('canvas');
    var projectionContext = projectionCanvas.getContext('2d');

    projectionCanvas.width = img.width;
    projectionCanvas.height = img.height;
    projectionContext.drawImage(img, 0, 0, img.width, img.height);
    
    var pixelData = null;

    var isLand = function(lat, lon){
        var x = parseInt(img.width * (lon + 180) / 360);
        var y = parseInt(img.height * (lat + 90) / 180);
    
        if(pixelData == null){
            pixelData = projectionContext.getImageData(0, 0, img.width, img.height);
        }
    
        var index = (y * pixelData.width + x) * 4;
        var alpha = pixelData.data[index + 3];  // Alpha channel
    
        // Check if pixel is not transparent (alpha > 0)
        return alpha > 0;
    };


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


    // Function to create scene objects from hexasphere data
    var introTick = 0;
    var seenTiles = {};
    var currentTiles = [];

    var createScene = function(radius, divisions, tileSize){

        // Scene Cleanup
        introTick = -1;
        while(scene.children.length > 0){ 
            scene.remove(scene.children[0]); 
        }

        // Generate Globe
        var hexasphere = new Hexasphere(radius, divisions, tileSize);
        for(var i = 0; i< hexasphere.tiles.length; i++){

            // Loop through tiles
            var t = hexasphere.tiles[i];
            var latLon = t.getLatLon(hexasphere.radius);

            // Constructs a 3D shape (geometry) from the boundary points of the tile
            // Each point is converted into a 3D vector (x, y, z) on the sphere.
            var geometry = new THREE.Geometry();
            for(var j = 0; j< t.boundary.length; j++){
                var bp = t.boundary[j];
                geometry.vertices.push(new THREE.Vector3(bp.x, bp.y, bp.z));
            }

            // Create Faces
            geometry.faces.push(new THREE.Face3(0,1,2));
            geometry.faces.push(new THREE.Face3(0,2,3));
            geometry.faces.push(new THREE.Face3(0,3,4));
            if(geometry.vertices.length > 5){
                geometry.faces.push(new THREE.Face3(0,4,5));
            }

            if(isLand(latLon.lat, latLon.lon)){
                t.isLand = true;
                material = meshMaterials[Math.floor(Math.random() * meshMaterials.length)]
            } else {
                t.isLand = false;
                material = oceanMaterial[Math.floor(Math.random() * oceanMaterial.length)]
            }


            

            // Creates a THREE.Mesh object and adds to scene
            material.opacity = 1;
            var mesh = new THREE.Mesh(geometry, material.clone());
            scene.add(mesh);
            hexasphere.tiles[i].mesh = mesh;

        }

        // seenTiles = {};
        
        // currentTiles = hexasphere.tiles.slice().splice(0,12);
        // currentTiles.forEach(function(item){
        //     seenTiles[item.toString()] = 1;
        //     item.mesh.material.opacity = 1;
        // });

        window.hexasphere = hexasphere;
        introTick = 0;
    };

    createScene(30, 25, .95);


    // Create rotating globe
    var startTime = Date.now();
    var lastTime = Date.now();
    var cameraAngle = -Math.PI/1.5;

    var tick = function(){

        // Rotate the camera
        var dt = Date.now() - lastTime;
        var rotateCameraBy = (10 * Math.PI)/(200000/dt);
        cameraAngle += rotateCameraBy;
        lastTime = Date.now();

        camera.position.x = cameraDistance * Math.cos(cameraAngle);
        camera.position.y = Math.sin(cameraAngle)* 10;
        camera.position.z = cameraDistance * Math.sin(cameraAngle);
        camera.lookAt( scene.position );

        // render the scene
        renderer.render( scene, camera );

        // var nextTiles = [];

        // currentTiles.forEach(function(item){
        //     item.neighbors.forEach(function(neighbor){
        //         if(!seenTiles[neighbor.toString()]){
        //             neighbor.mesh.material.opacity = 1;
        //             nextTiles.push(neighbor);
        //             seenTiles[neighbor] = 1;
        //         }
        //     });
        // });

        // currentTiles = nextTiles;

        requestAnimationFrame(tick);

    }

    // resize compatability
    function onWindowResize(){
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

    }


    window.addEventListener( 'resize', onWindowResize, false );
    $("#container").append(renderer.domElement);
       requestAnimationFrame(tick);
    window.scene = scene;
    window.createScene = createScene;

});

function downloadJson(data, filename = 'hexasphere.json') {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', function() {
    const downloadBtn = document.getElementById('downloadBtn');

    downloadBtn.addEventListener('click', function() {
        const json = hexasphere.toJson();
        downloadJson(json);
    });
});
