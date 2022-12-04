import * as three from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const clock = new three.Clock();

const initRenderer = () => {
    const renderer = new three.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio * 2)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.outputEncoding = three.sRGBEncoding
    document.body.append(renderer.domElement)
    return renderer
}

const initCamera = () => {
    const camera = new three.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.set(18, 10, 10)
    return camera
}


// set up render and camera
const renderer = initRenderer()
const camera = initCamera()
const scene = new three.Scene()




const initAxesHelper = () => {
    const axesHelper = new three.AxesHelper(5)
    scene.add(axesHelper)
    return axesHelper
}
const axesHelper = initAxesHelper()


const initControls = () => {
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.target.y = 5
    controls.update()
    return controls
}
const controls = initControls()

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

export {
    camera,
    renderer,
    scene,
    axesHelper,
    clock,
    controls,
}