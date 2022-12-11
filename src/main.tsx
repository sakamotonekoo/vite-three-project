import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { App } from "./App"
import './style.css'
// import './rayToChangeColor'
// import "./physicBase"
// import "./shadowmap"
// import "./practiceBase/animation"

// import "./practiceBase/Soldier"
// import './practiceBase/littlestTokyo'
// import "./practiceBase/10_clipping"

// import "./part_2/skybox"
import "./part_2/2_3_pathStripe"
ReactDOM.createRoot(document.getElementById("app")!).render(
    <React.StrictMode>
        <BrowserRouter >
            <App />
        </BrowserRouter>
    </React.StrictMode>
)

