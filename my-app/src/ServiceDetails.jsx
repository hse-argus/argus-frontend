import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Snackbar,
  Alert
} from '@mui/material'

function ServiceDetails() {
  const { id } = useParams()
  const [service, setService] = useState(null)
  // Состояния для уведомления Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const navigate = useNavigate()

  const fetchServiceById = async () => {
    try {
      const response = await fetch(`https://argus.appweb.space/api/service/${id}`)
      if (!response.ok) throw new Error('Ошибка загрузки сервиса')
      const data = await response.json()
      setService(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchServiceById()
  }, [id])

  // Обработка Healthcheck, ответ ожидается как строка
  const handleHealthcheck = async () => {
    try {
      const response = await fetch(`https://argus.appweb.space/api/healthcheck/${id}`)
      if (!response.ok) throw new Error('Ошибка Healthcheck')
      const text = await response.text()
      setSnackbarMessage(`Healthcheck сервиса ${id}: ${text}`)
      setSnackbarOpen(true)
    } catch (error) {
      setSnackbarMessage(`Ошибка: ${error.message}`)
      setSnackbarOpen(true)
    }
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return
    setSnackbarOpen(false)
  }

  if (!service) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" sx={{ mt: 5 }}>
          Загрузка...
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" align="center">
          Детальная информация
        </Typography>
      </Box>

      <Paper sx={{ p: 2, backgroundColor: '#1e1e1e', color: '#fff' }}>
        <Typography variant="body1"><strong>ID:</strong> {service.id}</Typography>
        <Typography variant="body1"><strong>Name:</strong> {service.name}</Typography>
        <Typography variant="body1"><strong>Port:</strong> {service.port}</Typography>
        <Typography variant="body1"><strong>Address:</strong> {service.address}</Typography>
      </Paper>

      {/* Кнопка Healthcheck */}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleHealthcheck}
          sx={{
            backgroundColor: '#17a2b8',
            ':hover': {
              backgroundColor: '#138496'
            }
          }}
        >
          Healthcheck
        </Button>
      </Box>

      {/* Кнопка "Назад" */}
      <Box sx={{ position: 'absolute', top: 80, left: 260 }}>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: '#6c757d',
            ':hover': {
              backgroundColor: '#5a6268'
            },
            color: '#fff'
          }}
        >
          Назад
        </Button>
      </Box>

      {/* Уведомление Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default ServiceDetails
