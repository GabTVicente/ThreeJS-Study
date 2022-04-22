import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const gui = new dat.GUI()
const world = {
  plane: {
    width: 10,
    height: 10,
    widthSegments:10,
    heightSegments:10
  }
}

//Controle da Altura
gui.add(world.plane, 'height', 1, 20).onChange(generatePlane)
gui.add(world.plane, 'height', 1, 20).onChange(generatePlane)
gui.add(world.plane, 'widthSegments', 1, 20).onChange(generatePlane)
gui.add(world.plane, 'heightSegments', 1, 20).onChange(generatePlane)

function generatePlane(){
   planeMesh.geometry.dispose()
  console.log(world.plane.width)
  planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width,world.plane.height,world.plane.widthSegments,world.plane.heightSegments)

  const { array } = planeMesh.geometry.attributes.position
  console.log(array)

  //Altera a profundidade (z) com um valor aletatório assim que o attr width changes
  for (let i = 0; i < array.length; i+=3) 
  {
    // posicao dos pontos dos arrays do vertice
    const x = array[i]
    const y = array[i + 1]
    const z = array[i+2]
    
    // Adicionando profundidade ao PlaneGeometry
    array[i + 2] = z + Math.random()
    /* Faz algo */
  } 
}

const scene = new THREE.Scene() 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 )//angulo, aspect ratio, minClippingPlane, farClippingPlane
camera.position.z = 5 //profundidade
const renderer = new THREE.WebGLRenderer() //basicamente um canvas com webGL

new OrbitControls(camera, renderer.domElement)

renderer.setSize(window.innerWidth, window.innerHeight) //tamanho do render width, height, nesse caso preenche o elem window 
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

//Geometry = é um objeto para ser renderizado.
//Material = é o q vai nesse objeto para preenche-lo 

const boxGeometry = new THREE.BoxGeometry(1, 1, 1) //(width, lenght, height)
const planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10)// (width, height, widthSegments, heightSegments)
console.log(planeGeometry)

const material = new THREE.MeshBasicMaterial({color: 0x00FF00})
const planeMaterial = new THREE.MeshPhongMaterial({color: 0xFF0000, side: THREE.DoubleSide, flatShading: THREE.FlatShading })

const mesh = new THREE.Mesh(boxGeometry, material) // (geometry, material)
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)

const light = new THREE.DirectionalLight(0xffffff , 1) //(color, intensidade da luz 0-1)
const backlight = new THREE.DirectionalLight(0xffffff, 0.6)
backlight.position.set(0,0,-1)
light.position.set(0, 0, 1) //x,y e z
scene.add(light,backlight)

// scene.add(mesh)
scene.add(planeMesh)
console.log(planeMesh.geometry.attributes.position.array)
console.log(planeMesh.geometry.attributes.position)

const { array } = planeMesh.geometry.attributes.position
console.log(array)
for (let i = 0; i < array.length; i+=3) 
{
  // posicao dos pontos dos arrays do vertice
  const x = array[i]
  const y = array[i + 1]
  const z = array[i+2]
  
  // Adicionando profundidade ao PlaneGeometry
  array[i + 2] = z + Math.random()
  /* Faz algo */
}

 

function animate(){
  window.requestAnimationFrame(animate)
  renderer.render(scene, camera)
  mesh.rotation.x += 0.01
  mesh.rotation.y += 0.01
  // planeMesh.rotation.x +=0.01
}
console.log(dat)

animate()
