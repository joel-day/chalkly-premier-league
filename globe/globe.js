console.log("Hexasphere is:", Hexasphere);

// Create a scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

// Create Hexasphere
const radius = 5;
const hexOptions = {
  radius: radius,
  hexSize: 0.25,
  color: 0x00aaff,
  wireframe: false,
};

const hexasphere = new Hexasphere(radius, hexOptions);
scene.add(hexasphere.group);

// Position the camera
camera.position.z = 10;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  hexasphere.group.rotation.y += 0.01; // Rotate the globe
  renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
