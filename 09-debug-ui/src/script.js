import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import GUI from 'lil-gui'

/**
 * Debug
 */

const gui = new GUI({
    width: 340,
    title: 'Nice Debug UI :)',
    closeFolders: false
})
//gui.close()
//gui.hide()

window.addEventListener('keydown', (event) =>{

    if (event.key == 'h')
        gui.show(gui._hidden)
})

const debugObject = {}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
debugObject.color = "#5a203f"

const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
const material = new THREE.MeshBasicMaterial({ color: debugObject.color, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const cubetweaks = gui.addFolder('cube styling')
//cubetweaks.close()

cubetweaks
    .add(mesh.position, 'y')
    .min(-5)
    .max(5)
    .step(0.01)
    .name('elevation')

cubetweaks
    .add(mesh.position, 'x')
    .min(-5)
    .max(5)
    .step(0.01)

cubetweaks
    .add(mesh.position, 'z')
    .min(-5)
    .max(5)
    .step(0.01)

cubetweaks
    .add(mesh, 'visible')

cubetweaks
    .add(material, 'wireframe')

cubetweaks
    .addColor(debugObject, 'color')
    .onChange(()=>{
        //console.log(value.getHexString())
        material.color.set(debugObject.color)
    })

debugObject.spin = () => {
    gsap.to(mesh.rotation, {duration: 2.5, y: mesh.rotation.y + Math.PI * 2})
}

cubetweaks.add(debugObject, 'spin')

debugObject.flip = () => {
    gsap.to(mesh.rotation, {duration: 2.5, x: mesh.rotation.x + Math.PI * 2})
}

gui.add(debugObject, 'flip')

debugObject.subdivision = 2


cubetweaks
    .add(debugObject, 'subdivision')
    .min(1)
    .max(20)
    .step(1)
    .onFinishChange(()=>{
        const form = debugObject.subdivision
        console.log(form)
        mesh.geometry.dispose()
        mesh.geometry = new THREE.BoxGeometry(
            1,1,1,
            form,form,form
        ) 
    })


//Dummy for Adding a tweak to the debug ui
const myObject = {
    myVariable: 1337
}
gui.add(myObject, 'myVariable')
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()