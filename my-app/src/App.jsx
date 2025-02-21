import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [services, setServices] = useState([]);

  // Получаем список сервисов с бэкенда
  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:8080/all-services');
      if (!response.ok) throw new Error('Ошибка загрузки данных');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Добавляем сервис
  const handleAddService = async () => {
    const name = prompt('Введите название сервиса:');
    const port = prompt('Введите порт сервиса:');
    if (!name || !port) return alert('Заполните все поля');

    try {
      const response = await fetch('/add-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, port }),
      });
      if (!response.ok) throw new Error('Ошибка при добавлении');
      alert('Сервис добавлен');
      fetchServices();
    } catch (error) {
      alert(error.message);
    }
  };

  // Обновляем сервис
  const handleUpdateService = async () => {
    const id = prompt('Введите ID сервиса:');
    const name = prompt('Введите новое название:');
    const port = prompt('Введите новый порт:');
    if (!id || !name || !port) return alert('Заполните все поля');

    try {
      const response = await fetch('/update-service', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, port }),
      });
      if (!response.ok) throw new Error('Ошибка обновления');
      alert('Сервис обновлён');
      fetchServices();
    } catch (error) {
      alert(error.message);
    }
  };

  // Удаляем сервис
  const handleDeleteService = async () => {
    const id = prompt('Введите ID сервиса:');
    if (!id) return alert('Введите ID');

    try {
      const response = await fetch('/delete-service', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Ошибка удаления');
      alert('Сервис удалён');
      fetchServices();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="App">
      <h1>Список сервисов</h1>

      <div className="services-list">
        {services.length ? (
          services.map((service) => (
            <div className="service-item" key={service.id}>
              <strong>ID:</strong> {service.id} <br />
              <strong>Name:</strong> {service.Name} <br />
              <strong>Port:</strong> {service.Port}
            </div>
          ))
        ) : (
          <p>Нет доступных сервисов</p>
        )}
      </div>

      <div className="buttons">
        <button onClick={handleAddService}>Добавить сервис</button>
        <button onClick={handleUpdateService}>Обновить сервис</button>
        <button onClick={handleDeleteService}>Удалить сервис</button>
      </div>
    </div>
  );
}

export default App;
