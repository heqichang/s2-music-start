import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Pitch from '@/pages/Pitch'
import Rhythm from '@/pages/Rhythm'
import Instrument from '@/pages/Instrument'
import Dynamics from '@/pages/Dynamics'
import Piano from '@/pages/Piano'
import Drums from '@/pages/Drums'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/pitch" element={<Pitch />} />
      <Route path="/rhythm" element={<Rhythm />} />
      <Route path="/instrument" element={<Instrument />} />
      <Route path="/dynamics" element={<Dynamics />} />
      <Route path="/piano" element={<Piano />} />
      <Route path="/drums" element={<Drums />} />
    </Routes>
  )
}

export default App
