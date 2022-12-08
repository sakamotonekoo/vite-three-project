import { basePracticesRoutes } from "./practiceBase/routes";

export type TRoute = {
    path: string, name: string
}
export const routes: Array<TRoute> = [
    ...basePracticesRoutes
]