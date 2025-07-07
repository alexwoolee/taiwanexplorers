import { BrowserRouter as Router, 
         Routes, 
         Route 
} from 'react-router-dom';
import { APIProvider } from '@vis.gl/react-google-maps';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Interests from './pages/Interests';

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  return (
    <>
      <APIProvider 
        apiKey={apiKey} 
        onLoad={() => {
          console.log("Message: Maps API has loaded. Happy Developing!");
        }}
      >
        <Router>
          <NavBar></NavBar>
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/destinations' element={<Destinations />}></Route>
            <Route path='/interests' element={<Interests />}></Route>
          </Routes>
        </Router> 
      </APIProvider>
    </>
    
  )
}

export default App
