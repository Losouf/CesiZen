import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Placeholder for a protected Home page
const Home = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>Welcome to CesiZen</h1>
    <p>You are successfully logged in!</p>
    <button 
      onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}
      style={{ marginTop: '1rem', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer' }}
    >
      Logout
    </button>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
