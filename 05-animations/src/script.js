import * as THREE from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Time
let time = Date.now()

// Using the Clock Method instead
const clock = new THREE.Clock()

gsap.to(mesh.position, {duration: 1, delay:1, x:2})
gsap.to(mesh.position, {duration: 1, delay:2, x:0})

// Animatons
const tick = () => 
{

    // time 
    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime

    //Clock method 
    const elapsedTime = clock.getElapsedTime()
    //console.log(deltaTime)

    // Update objects
    //mesh.position.x += 0.01
    // Time Method -> mesh.rotation.x += 0.001 * deltaTime
    // Time Method -> mesh.rotation.y += 0.001 * deltaTime
    //mesh.scale.x += 0.01

    // Using th e clock method then making 1 revolution per second
    mesh.rotation.x = elapsedTime * Math.PI * 2
    mesh.position.y = Math.sin(elapsedTime)
    mesh.scale.y = Math.sin(elapsedTime)


    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()