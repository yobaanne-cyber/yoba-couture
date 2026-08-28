import { Route, Routes } from 'react-router-dom'
import AnimatedBackground from '@/components/AnimatedBackground'
import Home from '@/pages/Home'

export default function App() {
  return (
    <>
      <AnimatedBackground />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}
