import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
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
      const response = await fetch(`https://argus.appweb.space/api/healthcheck/${id}`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Ошибка Healthcheck')
      const text = await response.text()
      setSnackbarMessage(`Healthcheck сервиса ${id}: ${text}`)
      setSnackbarOpen(true)
    } catch (error) {
      setSnackbarMessage(`Ошибка: ${error.message}`)
      setSnackbarOpen(true)
    }
  }

  // Состояния для модального окна расписания
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [selectedTime, setSelectedTime] = useState('5m')

  // Отправка запроса для сохранения расписания
  const handleScheduleSubmit = async () => {
    try {
      const response = await fetch(`https://argus.appweb.space/api/scheduled-healthcheck/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: selectedTime })
      })
      if (!response.ok) throw new Error('Ошибка сохранения расписания')
      setSnackbarMessage('Расписание сохранено')
      setSnackbarOpen(true)
    } catch (error) {
      setSnackbarMessage(`Ошибка: ${error.message}`)
      setSnackbarOpen(true)
    } finally {
      setScheduleModalOpen(false)
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

      {/* Кнопки действий */}
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
        <Button
          variant="contained"
          onClick={() => setScheduleModalOpen(true)}
          sx={{
            backgroundColor: '#28a745',
            ':hover': {
              backgroundColor: '#218838'
            },
            ml: 2
          }}
        >
          Добавить расписание
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

      {/* Модальное окно для выбора расписания */}
      <Dialog open={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)}>
        <DialogTitle>Выберите расписание</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="schedule-select-label">Время</InputLabel>
            <Select
              labelId="schedule-select-label"
              value={selectedTime}
              label="Время"
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              <MenuItem value="5m">5 минут</MenuItem>
              <MenuItem value="15m">15 минут</MenuItem>
              <MenuItem value="1h">1 час</MenuItem>
              <MenuItem value="4h">4 часа</MenuItem>
              <MenuItem value="8h">8 часов</MenuItem>
              <MenuItem value="12h">12 часов</MenuItem>
              <MenuItem value="24h">24 часа</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScheduleModalOpen(false)}>Отмена</Button>
          <Button onClick={handleScheduleSubmit}>Сохранить</Button>
        </DialogActions>
      </Dialog>

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
