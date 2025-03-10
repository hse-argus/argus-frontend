import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import ServiceDetails from './ServiceDetails'

function App() {
  return (
    <Routes>
      {/* Главная страница со списком сервисов (и вашими модалками) */}
      <Route path="/" element={<Home />} />

      {/* Страница детального просмотра сервиса */}
      <Route path="/service/:id" element={<ServiceDetails />} />
    </Routes>
  )
}

export default App
