// ServiceDetails.jsx
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
import { authFetch } from './api'

function ServiceDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [service, setService] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  useEffect(() => {
    const fetchServiceById = async () => {
      try {
        const response = await authFetch(`https://argus.appweb.space/api/service/${id}`)
        if (!response.ok) throw new Error('Ошибка загрузки сервиса')
        setService(await response.json())
      } catch (error) {
        console.error(error)
      }
    }
    fetchServiceById()
  }, [id])

  const handleHealthcheck = async () => {
    try {
      const response = await authFetch(`https://argus.appweb.space/api/healthcheck/${id}`, { method: 'POST' })
      if (!response.ok) throw new Error('Ошибка Healthcheck')
    } catch (error) {
      setSnackbarMessage(`Ошибка: ${error.message}`)
      setSnackbarOpen(true)
    }
  }

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [selectedTime, setSelectedTime] = useState('5m')

  const handleScheduleSubmit = async () => {
    try {
      const response = await authFetch(`https://argus.appweb.space/api/scheduled-healthcheck/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: selectedTime })
      })
      if (!response.ok) throw new Error('Ошибка сохранения расписания')
    } catch (error) {
      setSnackbarMessage(`Ошибка: ${error.message}`)
      setSnackbarOpen(true)
    } finally {
      setScheduleModalOpen(false)
    }
  }

  const handleScheduleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить расписание?')) return
    try {
      const response = await authFetch(`https://argus.appweb.space/api/schedule/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Ошибка удаления расписания')
      setSnackbarMessage('Расписание удалено')
      setSnackbarOpen(true)
    } catch (error) {
      setSnackbarMessage(`Ошибка: ${error.message}`)
      setSnackbarOpen(true)
    }
  }

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return
    setSnackbarOpen(false)
  }

  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
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

  const handleUpdateSubmit = async () => {
    if (!updateName || !updatePort || !updateAddress) {
      alert('Заполните все поля')
      return
    }
    try {
      const response = await authFetch('https://argus.appweb.space/api/service', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: service.id,
          name: updateName,
          port: parseInt(updatePort, 10),
          address: updateAddress
        })
      })
      if (!response.ok) throw new Error('Ошибка обновления сервиса')
      setSnackbarMessage('Сервис обновлён')
      setSnackbarOpen(true)
      setShowUpdateModal(false)
    } catch (error) {
      setSnackbarMessage(`Ошибка: ${error.message}`)
      setSnackbarOpen(true)
    }
  }

  const handleDeleteSubmit = async () => {
    if (!window.confirm(`Удалить сервис ${service.name}?`)) return
    try {
      const url = new URL('https://argus.appweb.space/api/service')
      url.searchParams.append('id', service.id)
      const response = await authFetch(url.toString(), { method: 'DELETE' })
      if (!response.ok) throw new Error('Ошибка удаления сервиса')
      setSnackbarMessage('Сервис удалён')
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
        <Typography variant="h4" align="center">Детали сервиса</Typography>
      </Box>

      <Paper sx={{ p: 2, backgroundColor: '#1e1e1e', color: '#fff' }}>
        <Typography><strong>ID:</strong> {service.id}</Typography>
        <Typography><strong>Name:</strong> {service.name}</Typography>
        <Typography><strong>Port:</strong> {service.port}</Typography>
        <Typography><strong>Address:</strong> {service.address}</Typography>
      </Paper>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleHealthcheck}
          sx={{ backgroundColor: '#17a2b8', ':hover': { backgroundColor: '#138496' } }}
        >
          Healthcheck
        </Button>

        <Button
          variant="contained"
          onClick={() => setScheduleModalOpen(true)}
          sx={{ backgroundColor: '#28a745', ':hover': { backgroundColor: '#218838' } }}
        >
          Добавить расписание
        </Button>

        <Button
          variant="contained"
          onClick={handleScheduleDelete}
          sx={{ backgroundColor: '#c82333', ':hover': { backgroundColor: '#b51e2e' } }}
        >
          Удалить расписание
        </Button>

        <Button
          variant="contained"
          onClick={() => setShowUpdateModal(true)}
          sx={{ backgroundColor: '#1e8c7a', ':hover': { backgroundColor: '#17705f' } }}
        >
          Обновить сервис
        </Button>

        <Button
          variant="contained"
          onClick={() => setShowDeleteModal(true)}
          sx={{ backgroundColor: '#c82333', ':hover': { backgroundColor: '#b51e2e' } }}
        >
          Удалить сервис
        </Button>
      </Box>

      {/* Модалка добавления/удаления расписания */}
      <Dialog open={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)}>
        <DialogTitle>Выберите расписание</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="schedule-select-label">Период</InputLabel>
            <Select
              labelId="schedule-select-label"
              value={selectedTime}
              label="Период"
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

      {/* Модалка обновления сервиса */}
      <Dialog open={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <DialogTitle>Обновить сервис</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Название" value={updateName} onChange={e => setUpdateName(e.target.value)} />
          <TextField fullWidth margin="dense" label="Порт" type="number" value={updatePort} onChange={e => setUpdatePort(e.target.value)} />
          <TextField fullWidth margin="dense" label="Адрес" value={updateAddress} onChange={e => setUpdateAddress(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUpdateModal(false)}>Отмена</Button>
          <Button onClick={handleUpdateSubmit}>Обновить</Button>
        </DialogActions>
      </Dialog>

      {/* Модалка удаления сервиса */}
      <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DialogTitle>Удалить сервис</DialogTitle>
        <DialogContent>
          <Typography>Вы уверены?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)}>Отмена</Button>
          <Button onClick={handleDeleteSubmit}>Удалить</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default ServiceDetails
