import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Create a renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loader = new GLTFLoader();

let controls; // Declare controls variable

loader.load(
  "./first_model.glb",
  function (gltf) {
    // Scale the model
    gltf.scene.scale.set(0.2, 0.2, 0.2); // Adjust scaling factor as desired

    // Position and add the model to the scene
    gltf.scene.position.set(0, 0, 0); // Position the model at the center of the scene
    scene.add(gltf.scene);

    // Update camera position and target based on model's bounding box
    const box = new THREE.Box3().setFromObject(gltf.scene);
    const center = box.getCenter(new THREE.Vector3());

    const modelSize = box.getSize(new THREE.Vector3()).length();
    camera.position.copy(center);
    camera.position.x += modelSize * 1.5; // Adjust camera distance from the model
    camera.position.y += modelSize * 0.5; // Adjust camera height
    camera.lookAt(center);

    // Add controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Enable smooth camera movement
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Add lighting if necessary
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// Adjust camera frustum values
camera.near = 0.1; // Adjust near clipping plane value as desired
camera.far = 10000; // Adjust far clipping plane value as desired
camera.updateProjectionMatrix();

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Update controls in the animation loop
  renderer.render(scene, camera);
}
animate();
