import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './components/Login';
import ManufacturerPage from './components/ManufacturerPage';
import ConsumerPage from './components/ConsumerPage';
import PillInfoPage from './components/PillInfoPage';
import PrivateRoute from './components/PrivateRoute';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/manufacturer"
          element={
            <PrivateRoute>
              <ManufacturerPage />
            </PrivateRoute>
          }
        />
        <Route path="/consumer" element={<ConsumerPage />} />
        <Route path="/consumer/:secret" element={<PillInfoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
