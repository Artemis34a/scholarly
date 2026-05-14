import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '../layouts/AppLayout'
import Dashboard from '../pages/Dashboard'
import Home from '../pages/Home'
import Login from '../pages/Login'
import { appPaths } from './paths'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path={appPaths.home} element={<Home />} />
        <Route path={appPaths.login} element={<Login />} />
        <Route path={appPaths.dashboard} element={<Dashboard />} />
        <Route path="*" element={<Navigate to={appPaths.home} replace />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
