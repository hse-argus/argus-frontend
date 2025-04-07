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
  MenuItem,
  TextField
} from '@mui/material'

function ServiceDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [service, setService] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  // Загрузка сервиса
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

  // Healthcheck: уведомление теперь приходит по WebSocket, но в случае ошибки выводим уведомление вручную
  const handleHealthcheck = async () => {
    try {
      const response = await fetch(`https://argus.appweb.space/api/healthcheck/${id}`, {
        method: 'POST'
      })
      if (!response.ok) throw new Error('Ошибка Healthcheck')
      // Успешный вызов – уведомление придёт через WebSocketNotifier
    } catch (error) {
      console.error('Ошибка при выполнении Healthcheck:', error)
      setSnackbarMessage(`Ошибка: ${error.message}`)
      setSnackbarOpen(true)
    }
  }

  // Модальное окно расписания
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [selectedTime, setSelectedTime] = useState('5m')

  // Настройка расписания: уведомление придёт по WebSocket
  const handleScheduleSubmit = async () => {
    try {
      const response = await fetch(`https://argus.appweb.space/api/scheduled-healthcheck/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: selectedTime })
      })
      if (!response.ok) throw new Error('Ошибка сохранения расписания')
      // Успешное сохранение – уведомление придёт через WebSocketNotifier
    } catch (error) {
      console.error('Ошибка при настройке расписания:', error)
    } finally {
      setScheduleModalOpen(false)
    }
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return
    setSnackbarOpen(false)
  }

  // Модальные окна для обновления и удаления
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Поля формы для обновления
  const [updateName, setUpdateName] = useState('')
  const [updatePort, setUpdatePort] = useState('')
  const [updateAddress, setUpdateAddress] = useState('')

  useEffect(() => {
    if (service) {
      setUpdateName(service.name)
      setUpdatePort(service.port)
      setUpdateAddress(service.address)
    }
  }, [service])

  // Обновление сервиса
  const handleUpdateSubmit = async () => {
    if (!updateName || !updatePort || !updateAddress) {
      alert('Заполните все поля')
      return
    }
    try {
      const port = parseInt(updatePort, 10)
      const response = await fetch('https://argus.appweb.space/api/service', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: service.id,
          name: updateName,
          port,
          address: updateAddress
        })
      })
      if (!response.ok) throw new Error('Ошибка обновления сервиса')
      setSnackbarMessage('Сервис обновлен')
      setSnackbarOpen(true)
      setShowUpdateModal(false)
      fetchServiceById()
    } catch (error) {
      setSnackbarMessage(`Ошибка: ${error.message}`)
      setSnackbarOpen(true)
    }
  }

  // Удаление сервиса (с подтверждением)
  const handleDeleteSubmit = async () => {
    try {
      const url = new URL('https://argus.appweb.space/api/service')
      url.searchParams.append('id', service.id)
      const response = await fetch(url, { method: 'DELETE' })
      if (!response.ok) throw new Error('Ошибка удаления сервиса')
      setSnackbarMessage('Сервис удален')
      setSnackbarOpen(true)
      navigate(-1)
    } catch (error) {
      setSnackbarMessage(`Ошибка: ${error.message}`)
      setSnackbarOpen(true)
    }
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
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center',
          mt: 3,
        }}
      >
        <Button
          variant="contained"
          onClick={handleHealthcheck}
          sx={{
            backgroundColor: '#17a2b8',
            ':hover': { backgroundColor: '#138496' }
          }}
        >
          Healthcheck
        </Button>

        <Button
          variant="contained"
          onClick={() => setScheduleModalOpen(true)}
          sx={{
            backgroundColor: '#28a745',
            ':hover': { backgroundColor: '#218838' }
          }}
        >
          Добавить расписание
        </Button>

        <Button
          variant="contained"
          onClick={() => setShowUpdateModal(true)}
          sx={{
            backgroundColor: '#1e8c7a',
            ':hover': { backgroundColor: '#17705f' }
          }}
        >
          Обновить сервис
        </Button>

        <Button
          variant="contained"
          onClick={() => setShowDeleteModal(true)}
          sx={{
            backgroundColor: '#c82333',
            ':hover': { backgroundColor: '#b51e2e' }
          }}
        >
          Удалить сервис
        </Button>
      </Box>

      <Box sx={{ position: 'absolute', top: 80, left: 260 }}>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{
            backgroundColor: '#6c757d',
            ':hover': { backgroundColor: '#5a6268' },
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
              <MenuItem value="1m">1 минута</MenuItem>
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

      {/* Модальное окно для обновления */}
      <Dialog open={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <DialogTitle>Обновить сервис</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Новое название"
            fullWidth
            value={updateName}
            onChange={(e) => setUpdateName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Новый порт"
            type="number"
            fullWidth
            value={updatePort}
            onChange={(e) => setUpdatePort(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Новый адрес"
            fullWidth
            value={updateAddress}
            onChange={(e) => setUpdateAddress(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpdateModal(false)}>Отмена</Button>
          <Button onClick={handleUpdateSubmit}>Обновить</Button>
        </DialogActions>
      </Dialog>

      {/* Модальное окно для удаления */}
      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DialogTitle>Удалить сервис</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить сервис <strong>{service.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)}>Отмена</Button>
          <Button onClick={handleDeleteSubmit}>Удалить</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar для ручных уведомлений (оставлен для других операций, если необходимо) */}
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
