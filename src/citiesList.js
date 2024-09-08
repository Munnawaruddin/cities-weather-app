import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CitiesTable />} />
        <Route path="/city/:cityId" element={<WeatherDetails />} />
      </Routes>
    </Router>
  );
}
export default App