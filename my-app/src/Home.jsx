import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box
} from '@mui/material';
import { authFetch } from './api';
 
function Home() {
  const [services, setServices] = useState([]);
 
  // Модальные окна
  const [showAddModal, setShowAddModal] = useState(false);
 
  // Поля формы для добавления
  const [addName, setAddName] = useState('');
  const [addPort, setAddPort] = useState('');
  const [addAddress, setAddAddress] = useState('');
 
  const navigate = useNavigate();
 
  // Загружаем список сервисов
  const fetchServices = async () => {
    try {
      const response = await authFetch('https://argus.appweb.space/api/service');
      if (!response.ok) throw new Error('Ошибка загрузки данных');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error(error);
    }
  };
 
  useEffect(() => {
    fetchServices();
  }, []);
 
  // Добавление сервиса
  const handleAddSubmit = async () => {
    if (!addName || !addPort || !addAddress) {
      alert('Заполните все поля');
      return;
    }
    try {
      const port = parseInt(addPort, 10);
      const response = await authFetch('https://argus.appweb.space/api/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: addName, port, address: addAddress })
      });
      if (!response.ok) throw new Error('Ошибка при добавлении');
      setShowAddModal(false);
      setAddName('');
      setAddPort('');
      setAddAddress('');
      fetchServices();
    } catch (error) {
      alert(error.message);
    }
  };
 
  // Переход к деталям при клике на строку таблицы
  const handleRowClick = (serviceId) => {
    navigate(`/service/${serviceId}`);
  };
 
  return (
    <Box sx={{ minHeight: '100vh', pt: 2 }}>
      <Container disableGutters maxWidth={false}>
        <h1 style={{ textAlign: 'center' }}>Список сервисов</h1>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', width: '100%' }}>
          {/* Слева остаётся только кнопка добавления */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '200px', flexShrink: 0 }}>
            <Button
              variant="contained"
              onClick={() => setShowAddModal(true)}
              sx={{ backgroundColor: '#4a5ea8', padding: '1em 1.5em', fontSize: '1.1em' }}
            >
              Добавить сервис
            </Button>
          </Box>
 
          {/* Таблица сервисов */}
          <Box sx={{ flexGrow: 1, overflowX: 'auto' }}>
            <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e', color: '#fff', width: '100%', minWidth: '750px' }}>
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
                        sx={{ cursor: 'pointer', transition: 'background-color 0.2s, border 0.2s', '&:hover': { backgroundColor: '#2a2a2a', border: '1px solid #646cff' } }}
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
      </Container>
    </Box>
  );
}
 
export default Home;
