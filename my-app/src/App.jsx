import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import ServiceDetails from './ServiceDetails';
import WebSocketNotifier from './WebSocketNotifier'; // Импорт нового компонента

function App() {
  return (
    <>
      <Routes>
        {/* Оборачиваем наши маршруты в Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
        </Route>
      </Routes>
      {/* Компонент для уведомлений */}
      <WebSocketNotifier />
    </>
  );
}

export default App;
