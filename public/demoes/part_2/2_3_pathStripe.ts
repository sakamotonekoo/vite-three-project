import * as three from 'three'

import { scene, renderer, camera, clock, controls as orbitControls, controls } from '../practiceBase/utils/baseRender'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Color, Loader, Matrix3 } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const updateBase = (() => {
    scene.background = new Color(0x202020)

    scene.fog = new three.Fog(0xa0a0a0, 1, 10000)
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



    const randomPoints = []
    for (let i = 0; i < 10; i++) {
        randomPoints.push(new three.Vector3((i - 4.5) * 50, three.MathUtils.randFloat(-50, 50), three.MathUtils.randFloat(-50, 50)))
    }
    const randomStripe = new three.CatmullRomCurve3(randomPoints)
    const extrudeSettings2: three.ExtrudeGeometryOptions = {
        steps: 200,
        bevelEnabled: true,
        extrudePath: randomStripe
    }
    const pts2 = [], numPts = 5
    for (let i = 0; i < numPts * 2; i++) {
        const l = i % 2 == 1 ? 10 : 20
        const a = i / numPts * Math.PI
        pts2.push(new three.Vector2(Math.cos(a) * l, Math.sin(a) * l))
    }
    const shape2 = new three.Shape(pts2)
    const geometry2 = new three.ExtrudeGeometry(shape2, extrudeSettings2)
    const material2 = new three.MeshPhongMaterial({ color: 0xa0a000 })
    const mesh2 = new three.Mesh(geometry2, material2)
    scene.add(mesh2)


    const material3 = [material1, material2]
    const extrudeSettings3: three.ExtrudeGeometryOptions = {
        depth: 120,
        steps: 1,
        bevelEnabled: true,
        bevelThickness: 8,
        bevelSize: 7,
        bevelSegments: 4,
    }
    const geometry3 = new three.ExtrudeGeometry(shape2, extrudeSettings3)
    const mesh3 = new three.Mesh(geometry3, material3)
    scene.add(mesh3)
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



