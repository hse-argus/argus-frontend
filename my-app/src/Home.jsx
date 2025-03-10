import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Paper
} from '@mui/material'
import './App.css'

function Home() {
  const [services, setServices] = useState([])

  // Модалки
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Форма добавления
  const [addName, setAddName] = useState('')
  const [addPort, setAddPort] = useState('')
  const [addAddress, setAddAddress] = useState('')

  // Форма обновления
  const [updateId, setUpdateId] = useState('')
  const [updateName, setUpdateName] = useState('')
  const [updatePort, setUpdatePort] = useState('')
  const [updateAddress, setUpdateAddress] = useState('')

  // Форма удаления
  const [deleteId, setDeleteId] = useState('')

  const navigate = useNavigate()

  // Получаем список сервисов
  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:8080/all-services')
      if (!response.ok) throw new Error('Ошибка загрузки данных')
      const data = await response.json()
      setServices(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  // Добавление
  const handleAddSubmit = async () => {
    if (!addName || !addPort || !addAddress) {
      alert('Заполните все поля')
      return
    }
    try {
      const port = parseInt(addPort, 10)
      const response = await fetch('http://localhost:8080/add-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: addName, port, address: addAddress })
      })
      if (!response.ok) throw new Error('Ошибка при добавлении')
      setShowAddModal(false)
      setAddName('')
      setAddPort('')
      setAddAddress('')
      fetchServices()
    } catch (error) {
      alert(error.message)
    }
  }

  // Обновление
  const handleUpdateSubmit = async () => {
    if (!updateId || !updateName || !updatePort || !updateAddress) {
      alert('Заполните все поля')
      return
    }
    try {
      const id = parseInt(updateId, 10)
      const port = parseInt(updatePort, 10)
      const response = await fetch('http://localhost:8080/update-service', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: updateName, port, address: updateAddress })
      })
      if (!response.ok) throw new Error('Ошибка обновления')
      setShowUpdateModal(false)
      setUpdateId('')
      setUpdateName('')
      setUpdatePort('')
      setUpdateAddress('')
      fetchServices()
    } catch (error) {
      alert(error.message)
    }
  }

  // Удаление
  const handleDeleteSubmit = async () => {
    if (!deleteId) {
      alert('Введите ID')
      return
    }
    try {
      const id = parseInt(deleteId, 10)
      const url = new URL('http://localhost:8080/delete-service')
      url.searchParams.append('id', id)
      const response = await fetch(url, { method: 'DELETE' })
      if (!response.ok) throw new Error('Ошибка удаления')
      setShowDeleteModal(false)
      setDeleteId('')
      fetchServices()
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h3" align="center" gutterBottom>
        Список сервисов
      </Typography>

      {/* Список сервисов */}
      <Box sx={{ mb: 4 }}>
        {services.length ? (
          services.map((service) => (
            <Paper
              key={service.id}
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: '#1e1e1e',
                color: '#fff',
                cursor: 'pointer'
              }}
              // При клике → переходим на страницу "/service/:id"
              onClick={() => navigate(`/service/${service.id}`)}
            >
              <Typography variant="body1">
                <strong>ID:</strong> {service.id}
              </Typography>
              <Typography variant="body1">
                <strong>Name:</strong> {service.name}
              </Typography>
              <Typography variant="body1">
                <strong>Port:</strong> {service.port}
              </Typography>
              <Typography variant="body1">
                <strong>Address:</strong> {service.address}
              </Typography>
            </Paper>
          ))
        ) : (
          <Typography variant="body1" align="center">
            Нет доступных сервисов
          </Typography>
        )}
      </Box>

      {/* Кнопки */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ mx: 1 }}
          onClick={() => setShowAddModal(true)}
        >
          Добавить сервис
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ mx: 1 }}
          onClick={() => setShowUpdateModal(true)}
        >
          Обновить сервис
        </Button>
        <Button
          variant="contained"
          color="error"
          sx={{ mx: 1 }}
          onClick={() => setShowDeleteModal(true)}
        >
          Удалить сервис
        </Button>
      </Box>

      {/* Модальное окно для добавления */}
      <Dialog open={showAddModal} onClose={() => setShowAddModal(false)}>
        <DialogTitle>Добавить сервис</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название"
            fullWidth
            value={addName}
            onChange={(e) => setAddName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Порт"
            type="number"
            fullWidth
            value={addPort}
            onChange={(e) => setAddPort(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Адрес"
            fullWidth
            value={addAddress}
            onChange={(e) => setAddAddress(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddModal(false)}>Отмена</Button>
          <Button onClick={handleAddSubmit}>Добавить</Button>
        </DialogActions>
      </Dialog>

      {/* Модальное окно для обновления */}
      <Dialog open={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
        <DialogTitle>Обновить сервис</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="ID"
            type="number"
            fullWidth
            value={updateId}
            onChange={(e) => setUpdateId(e.target.value)}
          />
          <TextField
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
          <TextField
            autoFocus
            margin="dense"
            label="ID"
            type="number"
            fullWidth
            value={deleteId}
            onChange={(e) => setDeleteId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteModal(false)}>Отмена</Button>
          <Button onClick={handleDeleteSubmit}>Удалить</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Home
