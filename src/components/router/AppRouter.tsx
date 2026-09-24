import { Navigate, Route, Routes, type Location } from 'react-router-dom'
import { routerConfig } from '../../config/routeConfig'

type AppRouterProps = {
  location?: Location
}

function AppRouter({ location }: AppRouterProps) {
  return (
    <Routes location={location}>
      {Object.values(routerConfig).map(({ path, Component }) => (
        <Route key={path} element={<Component />} path={path} />
      ))}

      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}

export default AppRouter