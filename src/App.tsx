import { Routes, Route } from 'react-router-dom'
import { useStore } from './store'
import Layout from './components/Layout'
import Home from './pages/Home'
import City from './pages/City'
import Compare from './pages/Compare'
import Favorites from './pages/Favorites'

function App() {
  const theme = useStore((s) => s.theme)

  return (
    <div className={theme}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/city/:cityId" element={<City />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </Layout>
    </div>
  )
}

export default App
