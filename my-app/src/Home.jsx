import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Container, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Box, Tooltip
} from '@mui/material'

function Home() {
  const [services, setServices] = useState([])

  // Модальные окна
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Поля формы
  const [addName, setAddName] = useState('')
  const [addPort, setAddPort] = useState('')
  const [addAddress, setAddAddress] = useState('')
  const [updateId, setUpdateId] = useState('')
  const [updateName, setUpdateName] = useState('')
  const [updatePort, setUpdatePort] = useState('')
  const [updateAddress, setUpdateAddress] = useState('')
  const [deleteId, setDeleteId] = useState('')

  const navigate = useNavigate()

  // Загружаем список сервисов
  const fetchServices = async () => {
    try {
      const response = await fetch('https://argus.appweb.space/api/all-services')
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

  // Добавление сервиса
  const handleAddSubmit = async () => {
    if (!addName || !addPort || !addAddress) {
      alert('Заполните все поля')
      return
    }
    try {
      const port = parseInt(addPort, 10)
      const response = await fetch('https://argus.appweb.space/api/add-service', {
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

  // Обновление сервиса
  const handleUpdateSubmit = async () => {
    if (!updateId || !updateName || !updatePort || !updateAddress) {
      alert('Заполните все поля')
      return
    }
    try {
      const id = parseInt(updateId, 10)
      const port = parseInt(updatePort, 10)
      const response = await fetch('https://argus.appweb.space/api/update-service', {
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

  // Удаление сервиса
  const handleDeleteSubmit = async () => {
    if (!deleteId) {
      alert('Введите ID')
      return
    }
    try {
      const id = parseInt(deleteId, 10)
      const url = new URL('https://argus.appweb.space/api/delete-service')
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

  // При клике на строку таблицы → переход к деталям
  const handleRowClick = (serviceId) => {
    navigate(`/service/${serviceId}`)
  }

  return (
    <Box sx={{ minHeight: '100vh', pt: 2 }}>
      <Container>
        <h1 style={{ textAlign: 'center' }}>Список сервисов</h1>

        {/* Таблица */}
        <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e', color: '#fff' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#fff' }}>ID</TableCell>
                <TableCell sx={{ color: '#fff' }}>Name</TableCell>
                <TableCell sx={{ color: '#fff' }}>Port</TableCell>
                <TableCell sx={{ color: '#fff' }}>Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.length ? (
                services.map((service) => (
                  <TableRow
                    key={service.id}
                    hover
                    // При наведении будет эффект подсветки (hover включен по default в MUI, но можно усилить стилями)
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#2a2a2a' // немного светлее при hover
                      }
                    }}
                    onClick={() => handleRowClick(service.id)}
                  >
                    <TableCell sx={{ color: '#fff' }}>{service.id}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{service.name}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{service.port}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{service.address}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} sx={{ color: '#fff', textAlign: 'center' }}>
                    Нет доступных сервисов
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Кнопки CRUD, центрируем */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button variant="contained" color="primary" sx={{ mx: 1 }} onClick={() => setShowAddModal(true)}>
            Добавить сервис
          </Button>
          <Button variant="contained" color="secondary" sx={{ mx: 1 }} onClick={() => setShowUpdateModal(true)}>
            Обновить сервис
          </Button>
          <Button variant="contained" color="error" sx={{ mx: 1 }} onClick={() => setShowDeleteModal(true)}>
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
    </Box>
  )
}

export default Home
