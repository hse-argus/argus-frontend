import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import App from './App'
import './App.css'

// Создаём (или дорабатываем) тёмную тему
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5c6bc0',    // Приглушённый фиолетово-синий
      contrastText: '#fff' // Белый текст на кнопках
    },
    secondary: {
      main: '#26a69a',     // Приглушённый розовый
      contrastText: '#fff'
    },
    error: {
      main: '#ef5350',     // Нежно-красный
      contrastText: '#fff'
    },
    background: {
      default: '#121212',  // Общий фон
      paper: '#1e1e1e'     // Фон карточек / бумажных компонентов
    },
    text: {
      primary: '#ffffff',  // Основной текст
      secondary: '#aaaaaa' // Второстепенный текст
    }
  },
  components: {
    // Переопределяем стили кнопок глобально
    MuiButton: {
      styleOverrides: {
        root: {
          // Делает текст кнопок белым (на всякий случай, 
          // хотя контрастText уже это обеспечивает)
          color: '#fff'
        }
      }
    },
    // Чтобы иконки и текст в Drawer были белыми (или почти белыми)
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#ffffff'
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: '#ffffff'
        }
      }
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={darkTheme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
)
