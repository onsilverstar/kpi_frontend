import './App.css';
import Dashboard from './components/Dashboard';
import Login from './components/Login'
import Register from './components/SignUp'
import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import './components/components.css'

function App() {
  return (
    <div className='wrapper'>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/" element={<Dashboard/>}/>
      </Routes>
    </div>
  );
}

export default App;
