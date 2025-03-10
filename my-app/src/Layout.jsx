import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Box } from '@mui/material'
import logo from './assets/logo.jpg'

function Layout() {
  return (
    <>
      {/* Шапка с логотипом, фиксированная в левом верхнем углу */}
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          p: 2
        }}
      >
        {/* При клике на логотип → переход на главную страницу */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <img
            src={logo}
            alt="App Logo"
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%', // Делаем логотип круглым
              cursor: 'pointer'
            }}
          />
        </Link>
      </Box>

      {/* Основной контент. Отступ сверху (pt: 10), чтобы лого не перекрывало текст */}
      <Box component="main" sx={{ pt: 10 }}>
        <Outlet />
      </Box>
    </>
  )
}

export default Layout
