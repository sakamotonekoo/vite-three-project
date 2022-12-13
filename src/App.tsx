import React from "react"
import { Route, Routes } from "react-router-dom"
import { Demoes } from "./Demoes"
import { Index } from "./Index"
import { routes } from "./routes"

export const App = () => {
    return <Routes>
        <Route path={routes.index} element={<Index />} />
        <Route path={routes.demo} element={<Demoes />} />
    </Routes>
}