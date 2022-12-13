import React, { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { routes } from "./routes"

export const Index = () => {
    const nav = useNavigate()

    const goDemo = useCallback(() => {
        nav({
            pathname: routes.demo,
            search: ""
        })

    }, [nav, routes])
    return <div className="index" onClick={goDemo}>Index...
    </div>
}