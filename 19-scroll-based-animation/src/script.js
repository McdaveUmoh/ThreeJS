import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}
const objectsDistance = 4

gui
    .addColor(parameters, 'materialColor')
    .onChange(() =>
    {
        material.color.set(parameters.materialColor)
    }).name('Shapes Color')


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// Material
const TextureLoader = new THREE.TextureLoader()
const gradientTexture = TextureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

const particlesTexture = TextureLoader.load('/textures/gradients/8.png')

const material = new THREE.MeshToonMaterial({ 
    color: parameters.materialColor,
    gradientMap: gradientTexture 
})

// Meshes
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)
const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)
const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)


scene.add(mesh1, mesh2, mesh3)

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2


const sectionMeshes = [ mesh1, mesh2, mesh3 ]

/**
 * Particles
 */
//Geometery
const count = 200
const positions = new Float32Array(count * 3)

for(let i=0; i < count; i++){
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometery = new THREE.BufferGeometry()
particlesGeometery.setAttribute('position', new THREE.BufferAttribute(positions, 3))

//Material
const particleMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    alphaMap: particlesTexture,
    transparent: true,
    depthWrite: false,
    sizeAttenuation: true,
    size: 0.50,
    blending : THREE.AdditiveBlending
})

//Points
const particles = new THREE.Points(particlesGeometery, particleMaterial)
scene.add(particles)

gui
    .addColor(particleMaterial, 'color')
    .onChange(() =>
    {
        material.color.set(parameters.materialColor)
    }).name('Star Color')


/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

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
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () =>
 {
    scrollY = window.scrollY
    const newSection =  Math.round(scrollY / sizes.height)

    if (newSection != currentSection ){
        currentSection = newSection
        console.log(currentSection)

        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z: '+=1.5'
            }
        )
    }
})

/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

/**
 * Camera
 */
// Base camera
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    //console.log(deltaTime)
    previousTime = elapsedTime

    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance

    //Parallax
    //can multiply your result by 0.5 to slow the camera movement
    const parallaxX = cursor.x
    const parallaxY = - cursor.y 
    cameraGroup.position.y = (parallaxY - cameraGroup.position.y) * 12 * deltaTime
    cameraGroup.position.x = (parallaxX - cameraGroup.position.x) * 12 * deltaTime

    // Animate meshes
    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    //Animate particles
    particles.rotation.y = - elapsedTime * 0.1
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()