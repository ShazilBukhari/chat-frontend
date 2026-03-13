import React from 'react'
import { Route,Routes} from 'react-router-dom'
import Home from './Components/Home'
import Signup from './Components/Signup'
import Login from './Components/Login'
import Chat from './Components/Chat'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/chat" element={<Chat/>}/>
      </Routes>
    </div>
  )
}

export default App