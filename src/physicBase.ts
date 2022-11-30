import * as three from "three"

import { scene, renderer, camera } from "./utils/baseRender"
import { OimoPhysics } from "three/examples/jsm/physics/OimoPhysics"
import { AmmoPhysics } from "three/examples/jsm/physics/AmmoPhysics"

const initLight = () => {
    const hesLight = new three.HemisphereLight(new three.Color(0xff11ff))
    hesLight.intensity = 0.3
    scene.add(hesLight)

    // const ambLight = new three.AmbientLight(new three.Color(0xff11ff))
    // scene.add(ambLight)

    const dirLight = new three.DirectionalLight()
    dirLight.position.set(222, 120, 100)
    scene.add(dirLight)

    return {
        hesLight, dirLight
    }
}
const {
    hesLight, dirLight
} = initLight()


const initMeshes = () => {
    const floor = new three.Mesh(
        new three.BoxGeometry(100, 1, 100),
        new three.ShadowMaterial({ color: 0x002200 })
    )
    floor.position.set(0, -1, 0)
    scene.add(floor)

    // boxes mesh
    const boxes = new three.InstancedMesh(
        new three.BoxGeometry(1, 1, 1),
        new three.MeshLambertMaterial(),
        200
    )
    boxes.instanceMatrix.setUsage(three.DynamicDrawUsage)
    const matrix = new three.Matrix4()
    const color = new three.Color()
    for (let i = 0; i < boxes.count; i++) {
        matrix.setPosition(Math.random() * 10, Math.random() * 100, Math.random() * 10)
        boxes.setMatrixAt(i, matrix)
        boxes.setColorAt(i, color.setHex(Math.random() * 0xffffff))

    }
    scene.add(boxes)

    // spheres mesh
    const spheres = new three.InstancedMesh(
        new three.IcosahedronGeometry(0.5, 1),
        new three.MeshLambertMaterial(),
        200
    )
    spheres.instanceMatrix.setUsage(three.DynamicDrawUsage)

    for (let i = 0; i < spheres.count; i++) {
        matrix.setPosition(Math.random() * 10, Math.random() * 100, Math.random() * 10)
        spheres.setMatrixAt(i, matrix)
        spheres.setColorAt(i, color.setHex(Math.random() * 0xffffff))

    }
    scene.add(spheres)

    return { floor, boxes, spheres }
}
const { floor, boxes, spheres } = initMeshes()

const enableShadow = () => {
    renderer.shadowMap.enabled = true
    dirLight.castShadow = true
    floor.receiveShadow = true
    boxes.castShadow = true
    boxes.receiveShadow = true
    spheres.castShadow = true
    spheres.receiveShadow = true

}
enableShadow()

const enablePhysics = async () => {
    const physics: AmmoPhysics = await OimoPhysics();
    physics.addMesh(boxes, 1)
    physics.addMesh(spheres, 1)
    physics.addMesh(floor, 0)

    return physics
}
const physics = await enablePhysics()

const position = new three.Vector3()
const resetMeshPosition = () => {
    let index = Math.floor(Math.random() * boxes.count)
    position.set(0, Math.random() * 100, 0)
    physics.setMeshPosition(boxes, position, index)

    index = Math.floor(Math.random() * spheres.count)
    position.set(0, Math.random() * 100, 0)
    physics.setMeshPosition(spheres, position, index)
}
// render
const render = () => {
    requestAnimationFrame(render)
    resetMeshPosition()
    renderer.render(scene, camera)
}

scene.background = new three.Color(0x897878)
render()