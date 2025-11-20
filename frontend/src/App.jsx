import { useState } from 'react'
import {Routes, Route} from 'react-router-dom'
import './App.css'
import Hero from './Pages/Hero'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className=''>
      <Routes>
        <Route path="/" element={<Hero />} />
      </Routes>
    </div>
  );
}

export default App
