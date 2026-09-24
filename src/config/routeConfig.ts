import type { ComponentType } from 'react'
import HomePage from '../pages/HomePage'
import PlaygroundPage from '../pages/PlaygroundPage'
import NotFoundPage from '../pages/NotFoundPage'

export const AppRoutes = {
  HOME: 'home',
  PLAYGROUND: 'playground',
  NOT_FOUND: 'not_found',
} as const

export type AppRouteKey = (typeof AppRoutes)[keyof typeof AppRoutes]

export const RoutePath: Record<AppRouteKey, string> = {
  [AppRoutes.HOME]: '/',
  [AppRoutes.PLAYGROUND]: '/playground',
  [AppRoutes.NOT_FOUND]: '/404',
}

type RouteConfigItem = {
  path: string
  Component: ComponentType
}

export const routerConfig: Record<AppRouteKey, RouteConfigItem> = {
  [AppRoutes.HOME]: {
    path: RoutePath[AppRoutes.HOME],
    Component: HomePage,
  },
  [AppRoutes.PLAYGROUND]: {
    path: RoutePath[AppRoutes.PLAYGROUND],
    Component: PlaygroundPage,
  },
  [AppRoutes.NOT_FOUND]: {
    path: RoutePath[AppRoutes.NOT_FOUND],
    Component: NotFoundPage,
  },
}