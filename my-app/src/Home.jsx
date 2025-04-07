// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import {
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   Paper, Button, Container, Dialog, DialogTitle, DialogContent,
//   DialogActions, TextField, Box
// } from '@mui/material'

// function Home() {
//   const [services, setServices] = useState([])

//   // Модальные окна
//   const [showAddModal, setShowAddModal] = useState(false)
//   const [showUpdateModal, setShowUpdateModal] = useState(false)
//   const [showDeleteModal, setShowDeleteModal] = useState(false)

//   // Поля формы для добавления
//   const [addName, setAddName] = useState('')
//   const [addPort, setAddPort] = useState('')
//   const [addAddress, setAddAddress] = useState('')
//   // Поля формы для обновления
//   const [updateId, setUpdateId] = useState('')
//   const [updateName, setUpdateName] = useState('')
//   const [updatePort, setUpdatePort] = useState('')
//   const [updateAddress, setUpdateAddress] = useState('')
//   // Поле для удаления
//   const [deleteId, setDeleteId] = useState('')

//   const navigate = useNavigate()

//   // Загружаем список сервисов
//   const fetchServices = async () => {
//     try {
//       const response = await fetch('https://argus.appweb.space/api/service')
//       if (!response.ok) throw new Error('Ошибка загрузки данных')
//       const data = await response.json()
//       setServices(data)
//     } catch (error) {
//       console.error(error)
//     }
//   }

//   useEffect(() => {
//     fetchServices()
//   }, [])

//   // Добавление сервиса
//   const handleAddSubmit = async () => {
//     if (!addName || !addPort || !addAddress) {
//       alert('Заполните все поля')
//       return
//     }
//     try {
//       const port = parseInt(addPort, 10)
//       const response = await fetch('https://argus.appweb.space/api/service', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name: addName, port, address: addAddress })
//       })
//       if (!response.ok) throw new Error('Ошибка при добавлении')
//       setShowAddModal(false)
//       setAddName('')
//       setAddPort('')
//       setAddAddress('')
//       fetchServices()
//     } catch (error) {
//       alert(error.message)
//     }
//   }

//   // Обновление сервиса
//   const handleUpdateSubmit = async () => {
//     if (!updateId || !updateName || !updatePort || !updateAddress) {
//       alert('Заполните все поля')
//       return
//     }
//     try {
//       const id = parseInt(updateId, 10)
//       const port = parseInt(updatePort, 10)
//       const response = await fetch('https://argus.appweb.space/api/service', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ id, name: updateName, port, address: updateAddress })
//       })
//       if (!response.ok) throw new Error('Ошибка обновления')
//       setShowUpdateModal(false)
//       setUpdateId('')
//       setUpdateName('')
//       setUpdatePort('')
//       setUpdateAddress('')
//       fetchServices()
//     } catch (error) {
//       alert(error.message)
//     }
//   }

//   // Удаление сервиса
//   const handleDeleteSubmit = async () => {
//     if (!deleteId) {
//       alert('Введите ID')
//       return
//     }
//     try {
//       const id = parseInt(deleteId, 10)
//       const url = new URL('https://argus.appweb.space/api/service')
//       url.searchParams.append('id', id)
//       const response = await fetch(url, { method: 'DELETE' })
//       if (!response.ok) throw new Error('Ошибка удаления')
//       setShowDeleteModal(false)
//       setDeleteId('')
//       fetchServices()
//     } catch (error) {
//       alert(error.message)
//     }
//   }

//   // Переход к деталям при клике
//   const handleRowClick = (serviceId) => {
//     navigate(`/service/${serviceId}`)
//   }

//   return (
//     <Box sx={{ minHeight: '100vh', pt: 2 }}>
//       {/*
//         disableGutters + maxWidth={false} → убираем любые отступы и ограничения
//         по ширине контейнера, чтобы занять всю доступную ширину контентной области.
//       */}
//       <Container disableGutters maxWidth={false}>
//         <h1 style={{ textAlign: 'center' }}>Список сервисов</h1>

//         <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', width: '100%' }}>
//           {/* Колонка кнопок слева (фикс. ширина) */}
//           <Box
//             sx={{
//               display: 'flex',
//               flexDirection: 'column',
//               gap: 2,
//               width: '200px',
//               flexShrink: 0
//             }}
//           >
//             <Button
//               variant="contained"
//               onClick={() => setShowAddModal(true)}
//               sx={{
//                 backgroundColor: '#4a5ea8',
//                 padding: '1em 1.5em',
//                 fontSize: '1.1em'
//               }}
//             >
//               Добавить сервис
//             </Button>
//             <Button
//               variant="contained"
//               onClick={() => setShowUpdateModal(true)}
//               sx={{
//                 backgroundColor: '#1e8c7a',
//                 padding: '1em 1.5em',
//                 fontSize: '1.1em'
//               }}
//             >
//               Обновить сервис
//             </Button>
//             <Button
//               variant="contained"
//               onClick={() => setShowDeleteModal(true)}
//               sx={{
//                 backgroundColor: '#c82333',
//                 padding: '1em 1.5em',
//                 fontSize: '1.1em'
//               }}
//             >
//               Удалить сервис
//             </Button>
//           </Box>

//           {/* 
//             Блок с таблицей, занимающий оставшуюся ширину.
//             overflowX: 'auto' → если экран слишком узкий, появляется горизонтальная прокрутка.
//           */}
//           <Box sx={{ flexGrow: 1, overflowX: 'auto' }}>
//             <TableContainer
//               component={Paper}
//               sx={{
//                 backgroundColor: '#1e1e1e',
//                 color: '#fff',
//                 width: '100%',
//                 minWidth: '750px' // <-- МИНИМАЛЬНАЯ ШИРИНА ТАБЛИЦЫ, подгонять нужное значение
//               }}
//             >
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell sx={{ color: '#fff' }}>ID</TableCell>
//                     <TableCell sx={{ color: '#fff' }}>Name</TableCell>
//                     <TableCell sx={{ color: '#fff' }}>Port</TableCell>
//                     <TableCell sx={{ color: '#fff' }}>Address</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {services.length ? (
//                     services.map((service) => (
//                       <TableRow
//                         key={service.id}
//                         hover
//                         sx={{
//                           cursor: 'pointer',
//                           transition: 'background-color 0.2s, border 0.2s',
//                           '&:hover': {
//                             backgroundColor: '#2a2a2a',
//                             border: '1px solid #646cff'
//                           }
//                         }}
//                         onClick={() => handleRowClick(service.id)}
//                       >
//                         <TableCell sx={{ color: '#fff' }}>{service.id}</TableCell>
//                         <TableCell sx={{ color: '#fff' }}>{service.name}</TableCell>
//                         <TableCell sx={{ color: '#fff' }}>{service.port}</TableCell>
//                         <TableCell sx={{ color: '#fff' }}>{service.address}</TableCell>
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell colSpan={4} sx={{ color: '#fff', textAlign: 'center' }}>
//                         Нет доступных сервисов
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Box>
//         </Box>

//         {/* Модальные окна */}
//         <Dialog open={showAddModal} onClose={() => setShowAddModal(false)}>
//           <DialogTitle>Добавить сервис</DialogTitle>
//           <DialogContent>
//             <TextField
//               autoFocus
//               margin="dense"
//               label="Название"
//               fullWidth
//               value={addName}
//               onChange={(e) => setAddName(e.target.value)}
//             />
//             <TextField
//               margin="dense"
//               label="Порт"
//               type="number"
//               fullWidth
//               value={addPort}
//               onChange={(e) => setAddPort(e.target.value)}
//             />
//             <TextField
//               margin="dense"
//               label="Адрес"
//               fullWidth
//               value={addAddress}
//               onChange={(e) => setAddAddress(e.target.value)}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setShowAddModal(false)}>Отмена</Button>
//             <Button onClick={handleAddSubmit}>Добавить</Button>
//           </DialogActions>
//         </Dialog>

//         <Dialog open={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
//           <DialogTitle>Обновить сервис</DialogTitle>
//           <DialogContent>
//             <TextField
//               autoFocus
//               margin="dense"
//               label="ID"
//               type="number"
//               fullWidth
//               value={updateId}
//               onChange={(e) => setUpdateId(e.target.value)}
//             />
//             <TextField
//               margin="dense"
//               label="Новое название"
//               fullWidth
//               value={updateName}
//               onChange={(e) => setUpdateName(e.target.value)}
//             />
//             <TextField
//               margin="dense"
//               label="Новый порт"
//               type="number"
//               fullWidth
//               value={updatePort}
//               onChange={(e) => setUpdatePort(e.target.value)}
//             />
//             <TextField
//               margin="dense"
//               label="Новый адрес"
//               fullWidth
//               value={updateAddress}
//               onChange={(e) => setUpdateAddress(e.target.value)}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setShowUpdateModal(false)}>Отмена</Button>
//             <Button onClick={handleUpdateSubmit}>Обновить</Button>
//           </DialogActions>
//         </Dialog>

//         <Dialog open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
//           <DialogTitle>Удалить сервис</DialogTitle>
//           <DialogContent>
//             <TextField
//               autoFocus
//               margin="dense"
//               label="ID"
//               type="number"
//               fullWidth
//               value={deleteId}
//               onChange={(e) => setDeleteId(e.target.value)}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setShowDeleteModal(false)}>Отмена</Button>
//             <Button onClick={handleDeleteSubmit}>Удалить</Button>
//           </DialogActions>
//         </Dialog>
//       </Container>
//     </Box>
//   )
// }

// export default Home

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Container, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Box
} from '@mui/material'

function Home() {
  const [services, setServices] = useState([])

  // Модальные окна
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Поля формы для добавления
  const [addName, setAddName] = useState('')
  const [addPort, setAddPort] = useState('')
  const [addAddress, setAddAddress] = useState('')
  // Поля формы для обновления
  const [updateId, setUpdateId] = useState('')
  const [updateName, setUpdateName] = useState('')
  const [updatePort, setUpdatePort] = useState('')
  const [updateAddress, setUpdateAddress] = useState('')
  // Поле для удаления
  const [deleteId, setDeleteId] = useState('')

  const navigate = useNavigate()

  // Загружаем список сервисов
  const fetchServices = async () => {
    try {
      const response = await fetch('https://argus.appweb.space/api/service')
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
      const response = await fetch('https://argus.appweb.space/api/service', {
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
      const response = await fetch('https://argus.appweb.space/api/service', {
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

  // Удаление сервиса с подтверждением
  const handleDeleteSubmit = async () => {
    if (!deleteId) {
      alert('Введите ID')
      return
    }
    // Запрашиваем подтверждение удаления
    if (!window.confirm(`Вы уверены, что хотите удалить сервис с ID: ${deleteId}?`)) return

    try {
      const id = parseInt(deleteId, 10)
      const url = new URL('https://argus.appweb.space/api/service')
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

  // Переход к деталям при клике на строку таблицы
  const handleRowClick = (serviceId) => {
    navigate(`/service/${serviceId}`)
  }

  return (
    <Box sx={{ minHeight: '100vh', pt: 2 }}>
      {/* Используем Container без ограничений и внутренних отступов */}
      <Container disableGutters maxWidth={false}>
        <h1 style={{ textAlign: 'center' }}>Список сервисов</h1>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', width: '100%' }}>
          {/* Колонка кнопок слева (фиксированная ширина) */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '200px',
              flexShrink: 0
            }}
          >
            <Button
              variant="contained"
              onClick={() => setShowAddModal(true)}
              sx={{
                backgroundColor: '#4a5ea8',
                padding: '1em 1.5em',
                fontSize: '1.1em'
              }}
            >
              Добавить сервис
            </Button>
            <Button
              variant="contained"
              onClick={() => setShowUpdateModal(true)}
              sx={{
                backgroundColor: '#1e8c7a',
                padding: '1em 1.5em',
                fontSize: '1.1em'
              }}
            >
              Обновить сервис
            </Button>
            <Button
              variant="contained"
              onClick={() => setShowDeleteModal(true)}
              sx={{
                backgroundColor: '#c82333',
                padding: '1em 1.5em',
                fontSize: '1.1em'
              }}
            >
              Удалить сервис
            </Button>
          </Box>

          {/* Блок с таблицей, занимающий оставшуюся ширину */}
          <Box sx={{ flexGrow: 1, overflowX: 'auto' }}>
            <TableContainer
              component={Paper}
              sx={{
                backgroundColor: '#1e1e1e',
                color: '#fff',
                width: '100%',
                minWidth: '750px'
              }}
            >
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
                        sx={{
                          cursor: 'pointer',
                          transition: 'background-color 0.2s, border 0.2s',
                          '&:hover': {
                            backgroundColor: '#2a2a2a',
                            border: '1px solid #646cff'
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
          </Box>
        </Box>

        {/* Модальное окно для добавления сервиса */}
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

        {/* Модальное окно для обновления сервиса */}
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

        {/* Модальное окно для удаления сервиса (с подтверждением) */}
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
