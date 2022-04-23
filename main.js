import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap' 

const gui = new dat.GUI()
const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegments:50,
    heightSegments:50
  }
}

//Controle da Altura
gui.add(world.plane, 'height', 1, 500).onChange(generatePlane)
gui.add(world.plane, 'width', 1, 500).onChange(generatePlane)
gui.add(world.plane, 'widthSegments', 1, 100).onChange(generatePlane)
gui.add(world.plane, 'heightSegments', 1, 100).onChange(generatePlane)

function generatePlane(){
  planeMesh.geometry.dispose()
  planeMesh.geometry = new THREE.PlaneGeometry(world.plane.width,world.plane.height,world.plane.widthSegments,world.plane.heightSegments)
  const colors = []
  for(let i = 0; i < planeMesh.geometry.attributes.position.count; i++){
    colors.push(0,0.19,0.4)
  }

  planeMesh.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))//attr, kind attr
//Randomizing Vertice pos
  const { array } = planeMesh.geometry.attributes.position
  const randomValues = []
  for (let i = 0; i < array.length; i++) 
  {

    if(i % 3 === 0){
      const x = array[i]
      const y = array[i + 1]
      const z = array[i+2]
      
      planeMesh.geometry.attributes.position.randomValues = randomValues
      console.log(planeMesh.geometry.attributes.position)
      planeMesh.geometry.attributes.position.originalPosition = planeMesh.geometry.attributes.position.array
    
      // Adicionando profundidade ao PlaneGeometry
      array[i] = x + (Math.random() - 0.5) * 3
      array[i + 1] = y + (Math.random()-0.5) * 3
      array[i + 2] = z + (Math.random() -.5) * 5
    }
    // posicao dos pontos dos arrays do vertice
    randomValues.push(Math.random() * Math.PI * 2)
    /* Faz algo */
  }

}

const raycaster = new THREE.Raycaster()
const scene = new THREE.Scene() 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 )//angulo, aspect ratio, minClippingPlane, farClippingPlane
camera.position.z = 100 //profundidade
const renderer = new THREE.WebGLRenderer() //basicamente um canvas com webGL

new OrbitControls(camera, renderer.domElement)

renderer.setSize(window.innerWidth, window.innerHeight) //tamanho do render width, height, nesse caso preenche o elem window 
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

//Geometry = é um objeto para ser renderizado.
//Material = é o q vai nesse objeto para preenche-lo 

const boxGeometry = new THREE.BoxGeometry(1, 1, 1) //(width, lenght, height)
const planeGeometry = new THREE.PlaneGeometry(world.plane.width,world.plane.height,world.plane.widthSegments,world.plane.heightSegments)// (width, height, widthSegments, heightSegments)

const material = new THREE.MeshBasicMaterial({color: 0x00FF00})
const planeMaterial = new THREE.MeshPhongMaterial({side: THREE.DoubleSide, flatShading: THREE.FlatShading, vertexColors: true })

const mesh = new THREE.Mesh(boxGeometry, material) // (geometry, material)
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)

const light = new THREE.DirectionalLight(0xffffff , 1) //(color, intensidade da luz 0-1)
const backlight = new THREE.DirectionalLight(0xffffff, 0.6)
backlight.position.set(0,0,-1)
light.position.set(0, 1, 1) //x,y e z
scene.add(light,backlight)

// scene.add(mesh)
scene.add(planeMesh)
generatePlane()
const mouse = {
  x: undefined, 
  y: undefined,
}

console.log(planeMesh.geometry.attributes.position)

let frame = 0 

function animate(){
  window.requestAnimationFrame(animate)
  frame += 0.01
  renderer.render(scene, camera)

  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObject(planeMesh)

  const { array, originalPosition,randomValues } =  planeMesh.geometry.attributes.position
  for( let i = 0; i < array.length; i+=3){
    //X
    array[i] = originalPosition[i] + (Math.cos(frame + randomValues[i]) * 0.02)
  
    //y
    array[i+1] = originalPosition[i+1] + (Math.sin(frame + randomValues[i + 1]) * 0.03)
  }
  planeMesh.geometry.attributes.position.needsUpdate = true

  if(intersects.length > 0) {
    const {color} = intersects[0].object.geometry.attributes
    
    // vert1
    color.setX(intersects[0].face.a, 0.1) 
    color.setY(intersects[0].face.a, 0.5) 
    color.setZ(intersects[0].face.a, 1) 
    // vert2
    color.setX(intersects[0].face.b, 0.1)
    color.setY(intersects[0].face.b, 0.5)
    color.setZ(intersects[0].face.b, 1)
    // vert3
    color.setX(intersects[0].face.c, 0.1)
    color.setY(intersects[0].face.c, 0.5)
    color.setZ(intersects[0].face.c, 1)

    color.needsUpdate = true

    const initialColor = {
      r: 0,
      g: .19,
      b: .4,
    }
    const hoverColor = {
      r: 0.1,
      g: .5,
      b: 1,
    }
    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: ()=>{
            // vert1
        color.setX(intersects[0].face.a, hoverColor.r) 
        color.setY(intersects[0].face.a, hoverColor.g) 
        color.setZ(intersects[0].face.a, hoverColor.b) 
        // vert2
        color.setX(intersects[0].face.b, hoverColor.r)
        color.setY(intersects[0].face.b, hoverColor.g)
        color.setZ(intersects[0].face.b, hoverColor.b)
        // vert3
        color.setX(intersects[0].face.c, hoverColor.r)
        color.setY(intersects[0].face.c, hoverColor.g)
        color.setZ(intersects[0].face.c, hoverColor.b)
      }
    })
    }
  // planeMesh.rotation.x +=0.01
}

animate()


//Mapeando posições do mouse com 'addEventListener' 
addEventListener('mousemove', () =>{
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1
  mouse.y = -( event.clientY / window.innerHeight )  * 2 + 1 
})