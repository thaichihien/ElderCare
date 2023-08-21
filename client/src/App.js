import Button from './components/Button'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calender from './pages/Calender';
import AIP from './pages/AIP';
import HomePage from './pages/Home';
import { publicRoutes } from './routes';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {
            publicRoutes.map((route, index) => {
              const Page = route.component
              return <Route key={index} path={route.path} element={<Page/>}></Route>
            })
          }
        </Routes>
      </div>
    </Router>
  );
}

export default App;
