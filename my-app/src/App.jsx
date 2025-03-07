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
    const portInput = prompt('Введите порт сервиса:');
    const address = prompt('Ввведите адрес:')
    if (!name || !portInput || !address) return alert('Заполните все поля');

    try {
      const port = parseInt(portInput, 10)
      const response = await fetch('http://localhost:8080/add-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, port, address }),
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
    const idInput = prompt('Введите id:')
    const name = prompt('Введите новое название:');
    const portInput = prompt('Введите новый порт:');
    const address = prompt("Введите новый адрес")
    if (!name || !portInput || !address) return alert('Заполните все поля');

    try {
      const id = parseInt(idInput, 10)
      const port = parseInt(portInput, 10)
      const response = await fetch('http://localhost:8080/update-service', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, port, address }),
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
    const idInput = prompt('Введите ID сервиса:');
    if (!idInput) return alert('Введите ID');

    const id = parseInt(idInput, 10)

    try {
      const url = new URL("http://localhost:8080/delete-service")
      url.searchParams.append("id", id)

      const response = await fetch(url, {
        method: 'DELETE',
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
              <strong>Name:</strong> {service.name} <br />
              <strong>Port:</strong> {service.port} <br />
              <strong>Address:</strong> {service.address} <br />
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
