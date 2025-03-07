import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [services, setServices] = useState([]);

  // Состояния для управления модальными окнами
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Состояния для формы добавления сервиса
  const [addName, setAddName] = useState('');
  const [addPort, setAddPort] = useState('');
  const [addAddress, setAddAddress] = useState('');

  // Состояния для формы обновления сервиса
  const [updateId, setUpdateId] = useState('');
  const [updateName, setUpdateName] = useState('');
  const [updatePort, setUpdatePort] = useState('');
  const [updateAddress, setUpdateAddress] = useState('');

  // Состояние для формы удаления сервиса
  const [deleteId, setDeleteId] = useState('');

  // Получаем список сервисов с бэкенда
  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:8080/all-services');
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

  // Обработка отправки формы добавления сервиса
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addName || !addPort || !addAddress) {
      alert('Заполните все поля');
      return;
    }
    try {
      const port = parseInt(addPort, 10);
      const response = await fetch('http://localhost:8080/add-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: addName, port, address: addAddress }),
      });
      if (!response.ok) throw new Error('Ошибка при добавлении');
      // Без подтверждения, просто обновляем список и закрываем модальное окно
      setShowAddModal(false);
      setAddName('');
      setAddPort('');
      setAddAddress('');
      fetchServices();
    } catch (error) {
      alert(error.message);
    }
  };

  // Обработка отправки формы обновления сервиса
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!updateId || !updateName || !updatePort || !updateAddress) {
      alert('Заполните все поля');
      return;
    }
    try {
      const id = parseInt(updateId, 10);
      const port = parseInt(updatePort, 10);
      const response = await fetch('http://localhost:8080/update-service', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: updateName, port, address: updateAddress }),
      });
      if (!response.ok) throw new Error('Ошибка обновления');
      // Без всплывающих окон подтверждения
      setShowUpdateModal(false);
      setUpdateId('');
      setUpdateName('');
      setUpdatePort('');
      setUpdateAddress('');
      fetchServices();
    } catch (error) {
      alert(error.message);
    }
  };

  // Обработка отправки формы удаления сервиса
  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    if (!deleteId) {
      alert('Введите ID');
      return;
    }
    try {
      const id = parseInt(deleteId, 10);
      const url = new URL("http://localhost:8080/delete-service");
      url.searchParams.append("id", id);
      const response = await fetch(url, { method: 'DELETE' });
      if (!response.ok) throw new Error('Ошибка удаления');
      // Без всплывающих окон подтверждения
      setShowDeleteModal(false);
      setDeleteId('');
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
        <button onClick={() => setShowAddModal(true)}>Добавить сервис</button>
        <button onClick={() => setShowUpdateModal(true)}>Обновить сервис</button>
        <button onClick={() => setShowDeleteModal(true)}>Удалить сервис</button>
      </div>

      {/* Модальное окно для добавления сервиса */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Добавить сервис</h2>
            <form onSubmit={handleAddSubmit}>
              <div>
                <label>Название:</label>
                <input type="text" value={addName} onChange={(e) => setAddName(e.target.value)} />
              </div>
              <div>
                <label>Порт:</label>
                <input type="number" value={addPort} onChange={(e) => setAddPort(e.target.value)} />
              </div>
              <div>
                <label>Адрес:</label>
                <input type="text" value={addAddress} onChange={(e) => setAddAddress(e.target.value)} />
              </div>
              <div className="modal-buttons">
                <button type="submit">Добавить</button>
                <button type="button" onClick={() => setShowAddModal(false)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно для обновления сервиса */}
      {showUpdateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Обновить сервис</h2>
            <form onSubmit={handleUpdateSubmit}>
              <div>
                <label>ID:</label>
                <input type="number" value={updateId} onChange={(e) => setUpdateId(e.target.value)} />
              </div>
              <div>
                <label>Новое название:</label>
                <input type="text" value={updateName} onChange={(e) => setUpdateName(e.target.value)} />
              </div>
              <div>
                <label>Новый порт:</label>
                <input type="number" value={updatePort} onChange={(e) => setUpdatePort(e.target.value)} />
              </div>
              <div>
                <label>Новый адрес:</label>
                <input type="text" value={updateAddress} onChange={(e) => setUpdateAddress(e.target.value)} />
              </div>
              <div className="modal-buttons">
                <button type="submit">Обновить</button>
                <button type="button" onClick={() => setShowUpdateModal(false)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно для удаления сервиса */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Удалить сервис</h2>
            <form onSubmit={handleDeleteSubmit}>
              <div>
                <label>ID:</label>
                <input type="number" value={deleteId} onChange={(e) => setDeleteId(e.target.value)} />
              </div>
              <div className="modal-buttons">
                <button type="submit">Удалить</button>
                <button type="button" onClick={() => setShowDeleteModal(false)}>Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
