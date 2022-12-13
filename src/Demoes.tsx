import React, { useCallback, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { demoes } from "../public/demoes"
import { routes, urlFor } from "./routes"

export const Demoes = () => {

    const pathName = useParams()
    const navigator = useNavigate()

    const selectDemo = useCallback((path: string) => {
        // window.location.reload()
        React.lazy(() => import("../public/demoes/part_2/2_1_skybox"))

    }, [navigator])
    const demoList = useMemo(() => {

        return demoes.map((path, index) => {
            return <button key={index} onClick={() => selectDemo(path)}>{path}</button>
        });
    }, [selectDemo])


    return <div className="demoes">
        {demoList}
    </div>
}