import React from "react"
import { Route, Routes } from "react-router-dom"
import { Demoes } from "./Demoes"

export const App = () => {
    return <Routes>
        <Route path="/" element={<Demoes />} />
    </Routes>
}