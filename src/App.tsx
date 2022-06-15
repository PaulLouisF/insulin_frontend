import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
//import Patient from './pages/Patient';
//import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
//import Tickets from './pages/Tickets';
import { MyIndicators } from './pages/Indicators';

import AuthPage from './pages/AuthPage';
import AuthContext from './store/auth-context';
import { useContext } from 'react';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Patient = React.lazy(() => import('./pages/Patient'));
//const  MyIndicators = React.lazy(() => import('./pages/Indicators'));
const Tickets = React.lazy(() => import('./pages/Tickets'));

function App() {
  const authCtx = useContext(AuthContext); 
  return (
      <Layout>
        <Suspense fallback={<p>Chargement...</p>}>
          <Routes>
            <Route path='/' element={<AuthPage/>} />
            {authCtx.isLoggedIn && (
              <Route path='/patients' element={<Dashboard/>} />   
            )}
            {authCtx.isLoggedIn && (
              <Route path='/patients/:id/*' element={<Patient/>} />
            )}
            {authCtx.isLoggedIn && (
              <Route path='/indicateurs' element={<MyIndicators/>} />
            )}
            {authCtx.isLoggedIn && (
              <Route path='/tickets' element={<Tickets/>} />
            )}
        
  
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>    
  );
}

export default App;
