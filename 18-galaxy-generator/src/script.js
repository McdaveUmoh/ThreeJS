import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI({width: 360})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const parameters = {}
parameters.count = 1000
parameters.size = 0.02
parameters.branch = 5
parameters.radius = 3
parameters.spin = 1
parameters.randomness = 0.2
parameters.randomnessPow = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

/**
 * Geometry
 */
let galaxyGeometry = null
let galaxyMaterial = null
let galaxyPoints = null

const galaxyGenerator = () => {
    /**
     * Check for empty galaxy
    */
   if(galaxyPoints != null){
        galaxyGeometry.dispose()
        galaxyMaterial.dispose()
        scene.remove(galaxyPoints)
   }

    galaxyGeometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const insideColor = new THREE.Color(parameters.insideColor)
    const outsideColor = new THREE.Color(parameters.outsideColor)

    for(let i = 0; i < parameters.count; i++){

        const i3 = i * 3

        //Positions
        const radius = Math.random() * parameters.radius
        const spinAngle = radius * parameters.spin
        const branchAngle = (i % parameters.branch) / parameters.branch * Math.PI *  2
        const randomX = Math.pow(Math.random(), parameters.randomnessPow) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), parameters.randomnessPow) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), parameters.randomnessPow) * (Math.random() < 0.5 ? 1 : -1)

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        //Colors
        const mixedcolors = insideColor.clone()
        mixedcolors.lerp(outsideColor, radius / parameters.radius)
        colors[i3] = mixedcolors.r
        colors[i3 + 1] = mixedcolors.g
        colors[i3 + 2] = mixedcolors.b

    }

    galaxyGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    )

    galaxyGeometry.setAttribute(
        'color', 
        new THREE.BufferAttribute(colors, 3)
    )


    /**
     * Material
     */
    galaxyMaterial = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
        
    })

    /**
     * Points
     */
    galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial)
    scene.add(galaxyPoints)

}
galaxyGenerator()

gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(galaxyGenerator)
gui.add(parameters, 'size').min(0.01).max(1).step(0.01).onFinishChange(galaxyGenerator)
gui.add(parameters, 'radius').min(1).max(100).step(1).onFinishChange(galaxyGenerator)
gui.add(parameters, 'branch').min(1).max(1000).step(1).onFinishChange(galaxyGenerator)
gui.add(parameters, 'spin').min(-5).max(5).step(0.001).onFinishChange(galaxyGenerator)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(galaxyGenerator)
gui.add(parameters, 'randomnessPow').min(1).max(10).step(0.001).onFinishChange(galaxyGenerator)
gui.addColor(parameters, 'insideColor').onFinishChange(galaxyGenerator)
gui.addColor(parameters, 'outsideColor').onFinishChange(galaxyGenerator)

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
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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