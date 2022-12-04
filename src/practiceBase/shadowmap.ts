import * as three from "three"

import { scene, renderer, camera, clock } from "./utils/baseRender"
import { ShadowMapViewer } from "three/examples/jsm/utils/ShadowMapViewer"
const initLight = () => {
    scene.add(new three.AmbientLight(0x404040))

    const spotLight = new three.SpotLight(0xffffff)
    spotLight.name = "spot light"
    spotLight.angle = Math.PI / 5
    spotLight.penumbra = 0.2
    spotLight.position.set(10, 10, 5)
    scene.add(spotLight)


    const dirLight = new three.DirectionalLight(0xffffff, 1)
    dirLight.name = "direct light"
    // dirLight.intensity = 0.5
    dirLight.position.set(0, 20, 0)
    scene.add(dirLight)

    return { spotLight, dirLight }
}
const { spotLight, dirLight } = initLight()

const initLightHelper = () => {

    spotLight.shadow.camera.near = 4
    spotLight.shadow.camera.far = 25
    spotLight.shadow.mapSize.height = 1024
    spotLight.shadow.mapSize.width = 1024

    dirLight.shadow.camera.near = 1
    dirLight.shadow.camera.far = 25
    dirLight.shadow.camera.right = 15
    dirLight.shadow.camera.left = -15
    dirLight.shadow.camera.top = -15
    dirLight.shadow.camera.bottom = 15


    const helperSpot = new three.CameraHelper(spotLight.shadow.camera)
    const helperDir = new three.CameraHelper(dirLight.shadow.camera)

    scene.add(helperSpot, helperDir)
}
initLightHelper()

const initMeshes = () => {
    const geometry = new three.TorusKnotGeometry(25, 5, 75, 20)
    const material = new three.MeshPhongMaterial({
        color: 0xff00000,
        shininess: 80,
        specular: 0x222222
    })

    const torusKnot = new three.Mesh(geometry, material)
    torusKnot.scale.multiplyScalar(1 / 18)
    torusKnot.position.y = 3
    scene.add(torusKnot)

    const geometryCube = new three.BoxGeometry(3, 3, 3)
    const cube = new three.Mesh(geometryCube, material)
    cube.position.set(8, 3, 8)
    scene.add(cube)


    const geometryGround = new three.BoxGeometry(20, 0.15, 20)
    const materialGround = new three.MeshPhongMaterial({
        color: 0xe1adad,
        shininess: 100,
        specular: 0x111111,
    })
    const ground = new three.Mesh(geometryGround, materialGround)
    scene.add(ground)
    return { torusKnot, cube, ground }
}
const { torusKnot, cube, ground } = initMeshes()


const enableShadow = (() => {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = three.BasicShadowMap

    spotLight.castShadow = true
    dirLight.castShadow = true

    torusKnot.castShadow = true
    torusKnot.receiveShadow = true

    cube.castShadow = true
    cube.receiveShadow = true
    ground.castShadow = true
    ground.receiveShadow = true

})()

const initShadowMapViewer = () => {
    const viewerDir = new ShadowMapViewer(dirLight)
    const viewerSpot = new ShadowMapViewer(spotLight)

    const size = window.innerWidth * 0.15
    viewerDir.position.x = 10
    viewerDir.position.y = 10
    viewerDir.size.set(size, size)
    viewerDir.update()

    viewerSpot.position.x = viewerDir.size.width
    viewerSpot.position.y = 20
    viewerSpot.size.set(size, size)
    viewerSpot.update()
    return { viewerDir, viewerSpot }
}
const { viewerDir, viewerSpot } = initShadowMapViewer()

const moveMeshes = () => {
    const delta = clock.getDelta()
    torusKnot.rotation.x += delta * 0.2
    torusKnot.rotation.y += delta * 0.2
    torusKnot.rotation.z += delta * 0.2

    cube.rotation.x += delta * 0.2
    cube.rotation.y += delta * 0.2
    cube.rotation.z += delta * 0.2
}

// render
const render = () => {
    requestAnimationFrame(render)
    moveMeshes()
    renderer.render(scene, camera)
    viewerDir.render(renderer)
    viewerSpot.render(renderer)
}
render()


