import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';

const WebSocketNotifier = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const socket = new WebSocket('wss://argus.appweb.space/api/ws');

    socket.onopen = () => {
      console.log('Подключение к WebSocket установлено');
    };

    socket.onmessage = (event) => {
      console.log('Получено сообщение:', event.data);
      setMessage(event.data);
      setOpen(true);
    };

    socket.onerror = (error) => {
      console.error('Ошибка WebSocket:', error);
    };

    socket.onclose = () => {
      console.log('Соединение WebSocket закрыто');
    };

    // Очистка соединения при размонтировании компонента
    return () => {
      socket.close();
    };
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}  // ← Вывод в правом верхнем углу
    >
      <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default WebSocketNotifier;
