import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ManufacturerPage from './components/ManufacturerPage';
import ConsumerPage from './components/ConsumerPage';
import PillInfoPage from './components/PillInfoPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/manufacturer" element={<ManufacturerPage />} />
        <Route path="/consumer" element={<ConsumerPage />} />
        <Route path="/consumer/:secret" element={<PillInfoPage />} />
      </Routes>
    </Router>
  );
}

export default App;
