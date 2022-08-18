import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


//Scene - Container holds objects, cameras, lights
const scene = new THREE.Scene();

//Camera (acts as human eyes) : (FOV, aspect ratio, view frustrum : controls what objects are visable relative to the camera)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Renderer : makes the magic happen (renders out graphics to scene.  needs to know which DOM element to use, in this case canvas with ID bg)
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),

});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );

camera.position.setZ(0.1);






renderer.render( scene, camera );

const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
const material = new THREE.MeshStandardMaterial( {color: 0xFF6347});

//Create mesh by combining geometry and material = torus, then add it to the scene,
const torus = new THREE.Mesh( geometry, material );
torus.position.x = 3;
torus.position.z = -5;
scene.add(torus);

//Add light source(s)
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(5,5,5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

//LightHelpers :)
//const lightHelper = new THREE.PointLightHelper(pointLight)
//const gridHelper = new THREE.GridHelper(200, 50);
//scene.add(lightHelper, gridHelper)

//Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement); //listens to dom events on the mouse and update the camera position accordingly

//Star Generator
function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const star = new THREE.Mesh( geometry, material);
//Generators random xyz position for stars (spheres)
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread( 100 ) ); 

  star.position.set(x, y, z);
  scene.add(star)
}

Array(200).fill().forEach(addStar)

//Load Textures/Images using THREE js texture loader.  you can pass a callback function for when image is done loading if you want a loading bar
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

//Avatar
const sethTexture = new THREE.TextureLoader().load('seth.png');

const seth = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial( { map: sethTexture } )
);

seth.position.z = -6;
seth.position.x = 3.5;
scene.add(seth);

//Other Object moon?
//texture map and displacement map texture
//PLANET TEXTURE MAP AND DISPLACEMENT MAP : https://www.solarsystemscope.com/ (jupiter) , https://texturesphere.com/ (dirt) 
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial( {
    map: moonTexture,
    normalMap: normalTexture
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

//Scrolling to move
function moveCamera(){
  const t = document.body.getBoundingClientRect().top;

  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  seth.rotation.y += 0.01;
  seth.rotation.z += 0.01;

  camera.position.z = (t * -0.015);
  if(camera.position.z < 0.1){
    camera.position.z = 0.1;
    
  }
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;

}

document.body.onscroll = moveCamera

//Render it by calling render function using infinite loop (animation)



function animate(){
  requestAnimationFrame( animate );

  const currentTime = Date.now();

  torus.rotation.x += .01;
  torus.rotation.y += .001;
  torus.rotation.z += .01;

  controls.update(); //This is here so the changes via dom events are updated consistently 

  renderer.render( scene, camera);
}

animate();
