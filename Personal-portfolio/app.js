import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

/* ===== CAMERA ===== */
const container = document.getElementById('container3D');
const camera = new THREE.PerspectiveCamera(
    70,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);
camera.position.z = 8;  // move camera back to fit full model

/* ===== SCENE ===== */
const scene = new THREE.Scene();
let bee;
let mixer;

/* ===== LOADER ===== */
const loader = new GLTFLoader();
let beeInitialX = 5; // slightly right
let beeInitialY = 0;
let angle = 0;

loader.load('phoenix.glb',
    function (gltf) {
        bee = gltf.scene;

        // adjust scale to fit container fully
        bee.scale.set(0.006, 0.006, 0.006);
        bee.position.set(beeInitialX, beeInitialY, 0);
        scene.add(bee);

        mixer = new THREE.AnimationMixer(bee);
        if (gltf.animations.length) mixer.clipAction(gltf.animations[0]).play();
    },
    undefined,
    function (error) {
        console.error(error);
    }
);

/* ===== RENDERER ===== */
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
container.appendChild(renderer.domElement);

/* ===== LIGHTS ===== */
scene.add(new THREE.AmbientLight(0xffffff, 1.3));
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

/* ===== FLOATING ===== */
const clock = new THREE.Clock();
const floatingAmplitude = 0.2;
const floatingSpeed = 0.01;

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    if (bee) {
        angle += floatingSpeed;
        bee.position.x = beeInitialX + Math.cos(angle) * floatingAmplitude * 0.3;
        bee.position.y = beeInitialY + Math.sin(angle * 1.2) * floatingAmplitude * 0.3;
        bee.rotation.y += 0.002;
    }

    if (mixer) mixer.update(delta);
    renderer.render(scene, camera);
}
animate();

/* ===== RESIZE ===== */
window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
});
