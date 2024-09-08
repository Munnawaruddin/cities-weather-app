import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CitiesTable from './CitiesTable';
import WeatherDetails from './WeatherDetails';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CitiesTable />} />
        <Route path="/city/:cityName" element={<WeatherDetails />} />
        <Route path="/weather/:cityName" element={<WeatherDetails />} />
      
      </Routes>
    </Router>
  );
}

export default App;
