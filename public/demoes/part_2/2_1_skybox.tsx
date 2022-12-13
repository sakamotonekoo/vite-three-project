import * as three from 'three'

import { scene, renderer, camera, clock, controls as orbitControls } from '../practiceBase/utils/baseRender'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Color, Loader } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { ComponentType, ReactNode, useEffect } from 'react'
import React from 'react'
orbitControls.enabled = false

const C = () => {
    useEffect(() => {
        render()
    }, [])
    return <div>CC</div>
}
export default C

const updateBase = (() => {
    scene.background = new Color(0xa0a0a0)
    const controls = new OrbitControls(camera, renderer.domElement)

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



const initSkyTexture = () => {
    const urls = [
        "textures/cube/pisa/px.png",
        "textures/cube/pisa/nx.png",
        "textures/cube/pisa/py.png",
        "textures/cube/pisa/ny.png",
        "textures/cube/pisa/pz.png",
        "textures/cube/pisa/nz.png",
    ]

    const textureCube = new three.CubeTextureLoader().load(urls)
    scene.background = textureCube

    return { textureCube }
}

const { textureCube } = initSkyTexture()


const initMeshes = () => {
    const geometry = new three.SphereGeometry(0.2, 80, 87)
    const material = new three.MeshBasicMaterial({ color: 0xffffff, envMap: textureCube })

    for (let i = 0; i < 500; i++) {
        const mesh = new three.Mesh(geometry, material)
        mesh.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5)
        scene.add(mesh)
    }
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

    renderer.render(scene, camera)
}
render()


