import * as three from 'three'

import { scene, renderer, camera, clock, controls } from './utils/baseRender'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { AnimationMixer, Color, Loader } from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment'
const updateBase = (() => {
    scene.background = new Color(0xf0fff0)
    controls.target.set(0, 20, 0)
    // scene.fog = new three.Fog(0x111111, 1, 1000)
})()

const initLight = () => {
    scene.add(new three.AmbientLight(0x404040))

    const spotLight = new three.SpotLight(0xffffff)
    spotLight.name = 'spot light'
    spotLight.angle = Math.PI / 5
    spotLight.penumbra = 0.2
    spotLight.position.set(10, 10, 5)
    scene.add(spotLight)


    const dirLight = new three.DirectionalLight(0xffffff, 1)
    dirLight.name = 'direct light'
    // dirLight.intensity = 0.5
    dirLight.position.set(0, 20, 0)
    scene.add(dirLight)

    return { spotLight, dirLight }
}
const { spotLight, dirLight } = initLight()

let mixer: three.AnimationMixer;

const initEnv = (() => {
    const pmremGenerator = new three.PMREMGenerator(renderer)
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.001)
})()

const initMeshes = () => {
    const plane = new three.Mesh(new three.BoxGeometry(100, 4, 100), new three.MeshPhongMaterial({
        color: 0x919191
    }))
    plane.position.set(0, 0, 0)
    // scene.add(plane)

    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/three/js/libs/draco/');

    // Optional: Pre-fetch Draco WASM/JS module.
    dracoLoader.preload();

    const glbLoader = new GLTFLoader()
    glbLoader.setDRACOLoader(dracoLoader)
    glbLoader.load('models/LittlestTokyo.glb', (gltf) => {
        console.log('gltf', gltf)
        const model = gltf.scene
        model.scale.set(0.1, 0.1, 0.1)
        model.position.set(0, 24, 0)

        // animation
        mixer = new AnimationMixer(model)
        mixer.clipAction(gltf.animations[0]).play()

        model.traverse(child => {
            if (child.isObject3D) {

            }
        })
        scene.add(model)
    })
    return { plane }
}
const { plane } = initMeshes()



// render
const render = () => {
    requestAnimationFrame(render)
    const delta = clock.getDelta()
    mixer?.update(delta)
    controls.update()
    // moveMeshes()

    renderer.render(scene, camera)
}
render()


