// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Layout from './Layout';
// import Home from './Home';
// import ServiceDetails from './ServiceDetails';

// function App() {
//   return (
//     <>
//       <Routes>
//         {/* Оборачиваем наши маршруты в Layout */}
//         <Route element={<Layout />}>
//           <Route path="/" element={<Home />} />
//           <Route path="/service/:id" element={<ServiceDetails />} />
//         </Route>
//       </Routes>
//     </>
//   );
// }

// export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './Home';
import ServiceDetails from './ServiceDetails';
import Auth from './Auth';
import ProtectedRoute from './ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Маршрут для авторизации */}
      <Route path="/auth" element={<Auth />} />
      {/* Защищённые маршруты */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<Home />} />
        <Route path="/service/:id" element={<ServiceDetails />} />
      </Route>
    </Routes>
  );
}

export default App;