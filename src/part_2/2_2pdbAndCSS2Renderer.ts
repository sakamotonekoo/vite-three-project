import * as three from 'three'

import { scene, renderer, camera, clock, controls } from '../practiceBase/utils/baseRender'
import { Color, Loader } from 'three'
import { PDBLoader } from "three/examples/jsm/loaders/PDBLoader"
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer"


const updateBase = (() => {
    scene.background = new Color(0xa0a0a0)
    controls.target.set(0, 1, 0)
    scene.fog = new three.Fog(0x50b060, 1, 1000)
})()

const initCSS2DRender = () => {
    const css2DRenderer = new CSS2DRenderer()
    css2DRenderer.setSize(window.innerWidth, window.innerHeight)
    css2DRenderer.domElement.style.position = "absolute"
    css2DRenderer.domElement.style.pointerEvents = "none"

    document.body.append(css2DRenderer.domElement)
    return { css2DRenderer }
}
const { css2DRenderer } = initCSS2DRender()

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
    const url = "/models/pdb/caffeine.pdb"
    const pdbLoader = new PDBLoader()
    pdbLoader.load(url, (pdb) => {
        console.log('pdb', pdb)

        {
            const positions = pdb.geometryAtoms.getAttribute("position")
            const colors = pdb.geometryAtoms.getAttribute("color")

            const position = new three.Vector3()
            const color = new three.Color()
            for (let i = 0; i < positions.count; i++) {
                position.set(positions.getX(i), positions.getY(i), positions.getZ(i))
                color.setRGB(colors.getX(i), colors.getY(i), colors.getZ(i))
                const geometry = new three.IcosahedronGeometry(0.2, 5)
                const material = new three.MeshPhongMaterial({ color })
                const mesh = new three.Mesh(geometry, material)
                mesh.position.copy(position)

                scene.add(mesh)

            }
        }

        {
            const positions = pdb.geometryBonds.getAttribute("position")
            const start = new three.Vector3()
            const end = new three.Vector3()
            const color = new three.Color(0xffffff)
            for (let i = 0; i < positions.count; i += 2) {
                start.set(positions.getX(i), positions.getY(i), positions.getZ(i))
                end.set(positions.getX(i + 1), positions.getY(i + 1), positions.getZ(i + 1))

                const geometry = new three.BoxGeometry(0.1, 0.1, 0.1)
                const material = new three.MeshPhongMaterial({ color })
                const mesh = new three.Mesh(geometry, material)
                mesh.position.copy(start)
                mesh.position.lerp(end, 0.5)
                mesh.scale.z = start.distanceTo(end) * 5
                mesh.lookAt(end)
                scene.add(mesh)
            }
        }

        {
            const json = pdb.json
            for (let i = 0; i < json.atoms.length; i++) {
                const atom = json.atoms[i]
                const text = document.createElement("div")
                text.style.color = `rgb(${atom[3][0] / 2},${atom[3][1] / 2},${atom[3][2] / 2})`
                text.textContent = atom[4]

                const label = new CSS2DObject(text)
                const position = new three.Vector3()
                position.set(atom[0], atom[1], atom[2])
                label.position.copy(position)
                scene.add(label)
            }
        }
    })
    return {}
}
const { } = initMeshes()

const enableShadow = (() => {
    renderer.shadowMap.enabled = true
    dirLight.castShadow = true
    spotLight.castShadow = true
})()


// render
const render = () => {
    requestAnimationFrame(render)
    const delta = clock.getDelta()
    mixer?.update(delta)
    // moveMeshes()
    controls.update() // track ball needs
    renderer.render(scene, camera)
    css2DRenderer.render(scene, camera)
}
render()


