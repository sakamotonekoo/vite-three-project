import * as three from "three"

import { scene, renderer, camera } from "./utils/baseRender"

const white = new three.Color().setHex(0xffffff)
const randColor = new three.Color()
// preparation
const initLight = () => {
    const light = new three.HemisphereLight(0xffffee, 0x005500)
    light.position.set(0, 1, 0)
    scene.add(light)
    return light
}
const light = initLight()

const initMeshes = () => {
    const geometry = new three.IcosahedronGeometry(0.5, 0)
    const material = new three.MeshPhongMaterial({ color: 0xffffff })
    const count = 1000;
    const meshes = new three.InstancedMesh(geometry, material, count)

    const size = 10
    let index = 0
    const offest = (size - 1) / 2

    const matrix = new three.Matrix4()
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            for (let k = 0; k < size; k++) {
                matrix.setPosition(offest - i, offest - j, offest - k)
                meshes.setMatrixAt(index, matrix)
                meshes.setColorAt(index, white)
                index += 1
            }

        }
    }
    scene.add(meshes)
    return meshes
}
const meshes = initMeshes()

// ray and mouse
const mouse = new three.Vector2(1, 1)
const raycaster = new three.Raycaster()

document.addEventListener("mousemove", e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
})



// render
const render = () => {
    requestAnimationFrame(render)

    raycaster.setFromCamera(mouse, camera)
    const tersections = raycaster.intersectObject(meshes)

    if (tersections.length && meshes.instanceColor) {
        const instanceId = tersections[0].instanceId!!
        meshes.getColorAt(instanceId, randColor)

        if (randColor.equals(white)) {
            meshes.setColorAt(instanceId, randColor.setHex(Math.random() * 0xffffff))
            meshes.instanceColor.needsUpdate = true;
        }

    }

    renderer.render(scene, camera)
}
render()