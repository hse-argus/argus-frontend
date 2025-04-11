import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { login, password } : { email, login, password };

    try {
      const response = await fetch(`https://argus.appweb.space${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!response.ok) throw new Error('Ошибка авторизации');
      const data = await response.json();
      // Сохраняем полученный JWT токен
      localStorage.setItem('token', data.token);
      // Перенаправляем пользователя на главную страницу
      navigate('/');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        {isLogin ? 'Вход в систему' : 'Регистрация'}
      </Typography>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        <TextField
          label="Логин"
          fullWidth
          margin="normal"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <TextField
          label="Пароль"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          {isLogin ? 'Войти' : 'Создать аккаунт'}
        </Button>
      </form>
      <Button onClick={() => setIsLogin(!isLogin)} fullWidth sx={{ mt: 2 }}>
        {isLogin ? 'Создать аккаунт' : 'Уже есть аккаунт? Войти'}
      </Button>
    </Container>
  );
}

export default Auth;