import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  Tooltip
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ListIcon from '@mui/icons-material/List'
import SettingsIcon from '@mui/icons-material/Settings'
import logo from './assets/logo.jpg'
import WebSocketNotifier from './WebSocketNotifier'

const drawerWidth = 240

function Layout() {
  const location = useLocation()

  // Определяем элементы меню
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/', inProgress: false },
    { text: 'Services', icon: <ListIcon />, path: '/services', inProgress: true },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings', inProgress: true }
  ]

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* Верхняя панель */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Link
            to="/"
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 16 }}
            />
            {/* Переименовали текст */}
            <Typography variant="h6" noWrap component="div">
              Argus
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>

      {/* Боковая панель */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => {
              const listItem = (
                <ListItem
                  button
                  key={item.text}
                  component={item.inProgress ? 'div' : Link}
                  to={item.inProgress ? undefined : item.path}
                  disabled={item.inProgress}
                  selected={location.pathname === item.path}
                  sx={{
                    transition: 'background-color 0.2s, color 0.2s',
                    // Если inProgress, делаем элемент более блеклым
                    opacity: item.inProgress ? 0.5 : 1,
                    '&:hover': {
                      backgroundColor: item.inProgress ? 'inherit' : '#333'
                    },
                    ...(location.pathname === item.path && {
                      backgroundColor: '#555',
                      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                        color: '#9c27b0'
                      }
                    })
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              )

              // Если элемент inProgress, оборачиваем его в Tooltip с placement="right"
              return item.inProgress ? (
                <Tooltip title="фича в разработке" key={item.text} placement="right">
                  <span>{listItem}</span>
                </Tooltip>
              ) : (
                listItem
              )
            })}
          </List>
        </Box>
      </Drawer>

      {/* Основной контент */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
        <Toolbar />
        <Outlet />
        <WebSocketNotifier />
      </Box>
    </Box>
  )
}

export default Layout
