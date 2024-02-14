import { useState } from 'react'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import Menu from './components/Menu'

function App() {


  return (
    <div>
        <Menu />
        <Routes>
          <Route path = "/" element={<Home />} />
        </Routes>
    </div>
  )
}

export default App
