import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
const scene = new THREE.Scene() 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 )//angulo, aspect ratio, minClippingPlane, farClippingPlane
const renderer = new THREE.WebGLRenderer() //basicamente um canvas com webGL

renderer.setSize(window.innerWidth, window.innerHeight) //tamanho do render width, height, nesse caso preenche o elem window 
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

//Geometry = é um objeto para ser renderizado.
//Material = é o q vai nesse objeto para preenche-lo 

const boxGeometry = new THREE.BoxGeometry(1, 1, 1) //(width, lenght, height)
const planeGeometry = new THREE.PlaneGeometry(5, 5, 10, 10)// (width, height, widthSegments, heightSegments)
console.log(planeGeometry)

const material = new THREE.MeshBasicMaterial({color: 0x00FF00})
const planeMaterial = new THREE.MeshPhongMaterial({color: 0xFF0000, side: THREE.DoubleSide })

const mesh = new THREE.Mesh(boxGeometry, material) // (geometry, material)
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)

const light = new THREE.DirectionalLight(0xffffff , 1) //(color, intensidade da luz 0-1)

light.position.set(0, 0, 1) //x,y e z

// scene.add(mesh)
scene.add(planeMesh)
scene.add(light)
camera.position.z = 5 //profundidade 

function animate(){
  window.requestAnimationFrame(animate)
  renderer.render(scene, camera)
  mesh.rotation.x += 0.01
  mesh.rotation.y += 0.01
  // planeMesh.rotation.x +=0.01
}

animate()
