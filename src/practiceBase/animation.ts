import * as three from "three"

import { scene, renderer, camera, clock } from "./utils/baseRender"


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


const initMeshes = () => {
    const geometry = new three.TorusKnotGeometry(25, 5, 75, 20)
    let material = new three.MeshPhongMaterial({
        color: 0xff00000,
        shininess: 80,
        specular: 0x222222
    })

    const torusKnot = new three.Mesh(geometry, material)
    torusKnot.scale.multiplyScalar(1 / 18)
    torusKnot.position.y = 3
    scene.add(torusKnot)

    material = new three.MeshPhongMaterial({
        color: 0xff00000,
        shininess: 80,
        specular: 0x222222
    })
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

const moveMeshes = () => {
    const delta = clock.getDelta()
    torusKnot.rotation.x += delta * 0.2
    torusKnot.rotation.y += delta * 0.2
    torusKnot.rotation.z += delta * 0.2

    cube.rotation.x += delta * 0.2
    cube.rotation.y += delta * 0.2
    cube.rotation.z += delta * 0.2
}

const initAnimation = () => {
    const positionKF = new three.VectorKeyframeTrack(
        ".position",
        [0, 1, 2, 3],
        [
            0, 0, 0,
            10, 0, 0,
            0, 10, 0,
            10, 10, 5]
    )
    const scaleKF = new three.VectorKeyframeTrack(
        ".scale",
        [0, 1, 2, 3],
        [1, 2, 1,
            0.5, 1, 1,
            0.5, 0.5, 1,
            0.5, 0.5, 0.5]
    )

    const xAxis = new three.Vector3(1, 0, 0)
    const qInital = new three.Quaternion().setFromAxisAngle(xAxis, 0)
    const qFinal = new three.Quaternion().setFromAxisAngle(xAxis, 150)
    const quaternionKF = new three.QuaternionKeyframeTrack(".quaternion", [0, 1, 2, 3],
        [
            qInital.x, qInital.y, qInital.z, qInital.w,
            qFinal.x, qFinal.y, qFinal.z, qFinal.w,
            qInital.x, qInital.y, qInital.z, qInital.w,
            qFinal.x, qFinal.y, qFinal.z, qFinal.w,
        ])

    const colorKF = new three.ColorKeyframeTrack(".material.color", [0, 1, 2, 3],
        [
            1, 0, 0,
            0.23, 0.55, 0.78,
            0.88, 0.33, 0.11,
            0.234, 0.423, 0.12
        ])

    const opacityKF = new three.NumberKeyframeTrack(".material.opacity", [0, 1, 2, 3], [
        0.5, 0, 0.5, 1
    ])
    const clip = new three.AnimationClip("Action", 4, [positionKF, scaleKF, quaternionKF, colorKF, opacityKF])
    return { positionKF, clip }
}
const { positionKF, clip } = initAnimation()
const enableAnimation = () => {
    const mixer = new three.AnimationMixer(cube)
    const action = mixer.clipAction(clip)
    action.play()
    return { mixer }
}
const { mixer } = enableAnimation()
// render
const render = () => {
    requestAnimationFrame(render)
    const delta = clock.getDelta()
    mixer.update(delta)
    // moveMeshes() 

    renderer.render(scene, camera)
}
render()


