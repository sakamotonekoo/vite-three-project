import * as three from 'three'

import { scene, renderer, camera, clock, controls as orbitControls, controls } from '../practiceBase/utils/baseRender'
import { Color, } from 'three'
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"

const updateBase = (() => {
    scene.background = new Color(0x202020)
    camera.position.set(0, 250, 50)
    scene.fog = new three.Fog(0x303030, 256, 1000)
})()


const initLight = () => {
    scene.add(new three.AmbientLight(0x404040))

    const spotLight = new three.SpotLight(0x2222ff)
    spotLight.name = 'spot light'
    spotLight.angle = Math.PI / 5
    spotLight.penumbra = 0.2
    spotLight.position.set(10, 10, 5)
    scene.add(spotLight)


    const dirLight = new three.DirectionalLight(0x0022ff, 1)
    dirLight.name = 'direct light'
    // dirLight.intensity = 0.5
    dirLight.position.set(0, 20, 0)
    scene.add(dirLight)

    return { spotLight, dirLight }
}
const { spotLight, dirLight } = initLight()

let mixer: three.AnimationMixer;



const initMeshes = () => {

    const closedStripeCurve: three.Curve<three.Vector3> = new three.CatmullRomCurve3([
        new three.Vector3(-60, -100, 60),
        new three.Vector3(-60, 20, 60),
        new three.Vector3(-60, 120, 60),
        new three.Vector3(60, 20, -60),
        new three.Vector3(60, -100, -60),
    ])

    // closedStripeCurve.curveType = "catmullrom"
    closedStripeCurve.closed = true // 
    const extrudeSettings: three.ExtrudeGeometryOptions = {
        steps: 100,
        bevelEnabled: false,
        extrudePath: closedStripeCurve
    }

    const r = 10
    const pts1 = [], edgeCount = 4
    for (let i = 0; i < edgeCount; i++) {
        const a = i / edgeCount * Math.PI * 2
        pts1.push(new three.Vector2(r * Math.cos(a), r * Math.sin(a)))
    }
    const shape1 = new three.Shape(pts1)
    const geometry1 = new three.ExtrudeGeometry(shape1, extrudeSettings)
    const material1 = new three.MeshPhongMaterial({ color: 0xa00000 })
    const mesh1 = new three.Mesh(geometry1, material1)
    scene.add(mesh1)


    const materials = [
        new three.MeshPhongMaterial({
            color: 0xffffff, flatShading: true,
        }),
        new three.MeshPhongMaterial({
            color: 0xffffff,
        })
    ]
    const loader = new FontLoader()
    loader.load("/three/fonts/helvetiker_bold.typeface.json", font => {

        const geometry = new TextGeometry("XL   test", {
            font,
            size: 40,
            height: 30,
            curveSegments: 2,
            bevelThickness: 2,
            bevelSize: 1,
            bevelEnabled: true
        })
        geometry.computeBoundingBox()
        const offset = (geometry.boundingBox?.max.x || 0 - (geometry.boundingBox?.min.x || 0)) / 2
        const mesh1 = new three.Mesh(geometry, materials[0])
        mesh1.position.set(-offset, 10, 0)
        scene.add(mesh1)

        const mesh2 = new three.Mesh(geometry, materials[1])
        mesh2.position.set(-offset, -10, 41)
        mesh2.rotation.x = Math.PI
        scene.add(mesh2)
    })

    const plane = new three.Mesh(new three.PlaneGeometry(10000, 10000, 1, 1),
        new three.MeshBasicMaterial({
            color: 0xffffff,
            opacity: 0.5, transparent: true,
        }))

    plane.position.y = 0
    plane.rotation.x = - Math.PI / 2
    scene.add(plane)
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
    controls.update()
    renderer.render(scene, camera)
}
render()



