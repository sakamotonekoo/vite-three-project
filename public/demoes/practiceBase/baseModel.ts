import * as three from 'three'

import { scene, renderer, camera, clock, controls } from './utils/baseRender'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Color, Loader } from 'three'

const updateBase = (() => {
    scene.background = new Color(0xa0a0a0)
    controls.target.set(0, 1, 0)
    scene.fog = new three.Fog(0x50b060, 1, 1000)
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

const initMeshes = () => {
    const plane = new three.Mesh(new three.BoxGeometry(100, 4, 100), new three.MeshPhongMaterial({
        color: 0x919191
    }))
    plane.position.set(0, -2, 0)
    scene.add(plane)

    const glbLoader = new GLTFLoader()
    glbLoader.load('models/Soldier.glb', (gltf) => {
        console.log('gltf', gltf)
        const model = gltf.scene
        model.traverse((obj) => {
            if (obj.isObject3D) {
                obj.castShadow = true
            }
        })
        const clip = gltf.animations[0]
        mixer = new three.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(clip)
        action.play()

        scene.add(model)
    })
    return { plane }
}
const { plane } = initMeshes()

const enableShadow = (() => {
    renderer.shadowMap.enabled = true
    dirLight.castShadow = true
    spotLight.castShadow = true
    plane.receiveShadow = true
})()

// render
const render = () => {
    requestAnimationFrame(render)
    const delta = clock.getDelta()
    mixer?.update(delta)
    // moveMeshes()

    renderer.render(scene, camera)
}
render()


