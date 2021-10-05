import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {Reflector} from 'three/examples/jsm/objects/Reflector.js';
import * as dat from 'dat.gui'
import {RectAreaLightHelper} from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import {RectAreaLightUniformsLib} from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'

RectAreaLightUniformsLib.init();

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
let fogColor = new THREE.Color(0x000000);

scene.background = fogColor;
scene.fog = new THREE.Fog(fogColor, 3, 8);
// scene.fog = new THREE.FogExp2(fogColor, 0.2);


// Loading

const textureLoader = new THREE.TextureLoader()
const basicTexture = textureLoader.load('/textures/texture.jpeg')

// Objects
const geometry = new THREE.SphereBufferGeometry(.7, 52, 52);
const planeGeometry = new THREE.PlaneGeometry(100, 100)


// Materials

const material = new THREE.MeshStandardMaterial()
material.color = new THREE.Color(0x63B8FF)
material.metalness = 1
material.roughness = 0.2;
material.normalMap = basicTexture;
// material.normalScale = new THREE.Vector2(-10,-15)
const groundMaterial = new THREE.ShadowMaterial()
groundMaterial.opacity = 0.2


// Mesh

// const sphere = new THREE.Mesh(geometry,material)
// sphere.castShadow = true;
// scene.add(sphere)

let mirror = new Reflector(planeGeometry, {
    clipBias: 0.003,
    textureWidth: window.innerWidth * window.devicePixelRatio,
    textureHeight: window.innerHeight * window.devicePixelRatio,
    color: 0xffffff
})
// mirror.position.z = -2.5
mirror.position.y = -1.9
mirror.rotateX(-Math.PI / 2);
scene.add(mirror)
const ground = new THREE.Mesh(planeGeometry, groundMaterial)
ground.position.y = -1.5;
ground.receiveShadow = true;
scene.add(ground)


const sphereGroup = new THREE.Group();

let x = -1.5

for (let i = 0; i < 3; i++) {
    let z = -1.5
    for (let f = 0; f < 3; f++) {
        let sphere = new THREE.Mesh(geometry, material)
        sphere.MatrixAutoUpdate = true
        sphere.position.z = z;
        // sphere.castShadow = true;

        sphere.position.x = x;
        sphereGroup.add(sphere)

        z += 1.5
    }
    x += 1.5
}
scene.add(sphereGroup)
const centralEl = sphereGroup.children[5]
const center = new THREE.Vector3(centralEl.x, centralEl.y, centralEl.z)
// myGroup.applyMatrix( new THREE.Matrix4().makeTranslation(-centralEl.x, -centralEl.y, -centralEl.z));
// Lights

const pointLight = new THREE.PointLight(0xffffff, 20, 10)
pointLight.position.set(4, 2, 10);

// pointLight.castShadow = true;
// pointLight.shadow.radius = 3
// pointLight.shadow.bias = 0.001
// pointLight.shadow.mapSize = new THREE.Vector2(2048, 2048)
scene.add(pointLight)

const cursorLightTarget = new THREE.Object3D()
cursorLightTarget.position.set(1, 0 , 0)
scene.add(cursorLightTarget)

const cursorLight = new THREE.SpotLight(0xff0000, 200)
cursorLight.angle = Math.PI / 150;
cursorLight.penumbra = 0.1;
cursorLight.decay = 5;
cursorLight.distance = 200;

cursorLight.position.set(0, 0, 30)
cursorLight.target= cursorLightTarget


scene.add(cursorLight)
scene.add(cursorLight.target)

const rectLight1 = new THREE.RectAreaLight(0xfffff, 1, 10, 10);
rectLight1.position.set(0, -1, 0);
rectLight1.lookAt(0, 0, 0);
// scene.add( rectLight1 );

const rectLight2 = new THREE.RectAreaLight(0xffffff, 10, 10, 10);
rectLight2.position.set(0, -15, 0);
rectLight2.lookAt(0, 0, 0);
scene.add( rectLight2 );

const rectLight3 = new THREE.RectAreaLight(0xff0000, 1.5, 10, 10);
rectLight3.position.set(5, 10, -2);
rectLight3.lookAt(0, 0, 0);
scene.add(rectLight3);
//
// scene.add( new RectAreaLightHelper( rectLight1 ) );
// scene.add( new RectAreaLightHelper( rectLight2 ) );
// scene.add( new RectAreaLightHelper( rectLight3 ) );
// const ambientLight = new THREE.AmbientLight(0xffffff, 100)
// scene.add(ambientLight)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = -1.8
camera.position.z = 7
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true
// controls.autoRotate = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
document.addEventListener( 'mousemove',onDocumentMouseMove)

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

function onDocumentMouseMove(event){
    mouseX = (event.clientX - windowHalfX)
    mouseY = (event.clientY - windowHalfY)
}

const clock = new THREE.Clock()

const updateSphere = (event) =>{
    sphereGroup.position.y = window.scrollY * .01
}
window.addEventListener('scroll', updateSphere)

const tick = () => {

    const elapsedTime = clock.getElapsedTime()

    targetX = mouseX * .001;
    targetY = mouseY * .001;

    camera.position.z =7- targetY*2
    cursorLightTarget.position.x = targetX*2
    cursorLightTarget.position.y = -targetY*4
    // Update objects

        sphereGroup.rotation.y = .7 * -elapsedTime
        // sphereGroup.rotation.x = .5 * -elapsedTime
    sphereGroup.children.forEach((el,index) => {
        el.rotation.y = .7 * elapsedTime
        // el.rotation.x = .5 * elapsedTime
        el.position.y = Math.sin(elapsedTime/2-el.position.x-index)*0.9
        // console.log(el.key)
    })

        // sphereGroup.rotateOnWorldAxis(axis,  elapsedTime/100)

    // sphere.rotation.y = .5 * elapsedTime
    // sphere.position.y =0.5+ Math.sin(elapsedTime*5)*0.6
    // sphere.scale.y = 1+ Math.sin(elapsedTime*5-1)*0.2
    // sphere.scale.x = 1- Math.sin(elapsedTime*5-1)*0.2

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()