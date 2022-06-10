import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Patient from './pages/Patient';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Tickets from './pages/Tickets';
import { MyIndicators } from './pages/Indicators';
import AuthPage from './pages/AuthPage';
// import PatientsProvider from './storeEx/PatientsProvider';

function App() {
  return (
    // <PatientsProvider>
      <Layout>
        <Routes>
          <Route path='/' element={<AuthPage/>} />
          <Route path='/patients' element={<Dashboard/>} />
          <Route path='/patients/:id/*' element={<Patient/>} />
          <Route path='/indicateurs' element={<MyIndicators/>} />
          <Route path='/tickets' element={<Tickets/>} />
 
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Layout>
    // </PatientsProvider>
    
  );
}

export default App;
