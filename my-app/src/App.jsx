import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import Home from './Home'
import ServiceDetails from './ServiceDetails'

function App() {
  return (
    <Routes>
      {/* Оборачиваем наши маршруты в Layout, чтобы лого было на всех страницах */}
      <Route element={<Layout />}>
        {/* Главная страница со списком сервисов и модальными окнами */}
        <Route path="/" element={<Home />} />

        {/* Детальная страница конкретного сервиса */}
        <Route path="/service/:id" element={<ServiceDetails />} />
      </Route>
    </Routes>
  )
}

export default App