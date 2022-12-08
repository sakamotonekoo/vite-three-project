import { TRoute } from "../routes"

const prefix = "./src/practiceBase/"
const routes = ["10_clipping"] as const
export const basePracticesRoutes: TRoute[] = routes.map(name => ({
    path: prefix + name,
    name,
}))