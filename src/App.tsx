import React, { Fragment, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
//import Patient from './pages/Patient';
//import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

//import { MyIndicators } from './pages/Indicators';

//import AuthPage from './pages/AuthPage';
import AuthContext from './store/auth-context';
import { useContext } from 'react';
import RequireAuth from './components/auth/RequireAuth';
//import HomePage from './pages/HomePage';
// import Treatment from './components/treatment/Treatment';
//import Tickets from './pages/Tickets';


const HomePage = React.lazy(() => import('./pages/HomePage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Patient = React.lazy(() => import('./pages/Patient'));
const MyIndicators = React.lazy(() => import('./pages/Indicators'));
const Tickets = React.lazy(() => import('./pages/Tickets'));


// const ProtectedRoute = (children: any) => {
//   const { token } = useContext(AuthContext); 
//   const location = useLocation();

//   if (!token) {
//     return <Navigate to="/home" replace state={{ from: location }} />;
//   }

//   return children;
// };


function App() {
  const authCtx = useContext(AuthContext); 

  return (
      <Layout>
        <Suspense fallback={<p>Chargement...</p>}>
          <Routes>
            <Route path='/auth' element={<HomePage/>} />
            <Route path='/' element={<RequireAuth><Dashboard/></RequireAuth>} />   
            <Route path='/patients/:id/*' element={<RequireAuth><Patient/></RequireAuth>} />
            <Route path='/indicateurs' element={<RequireAuth><MyIndicators/></RequireAuth>} />
            <Route path='/tickets' element={<RequireAuth><Tickets/></RequireAuth>} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>    
  );
}

export default App;

  // {/* {authCtx.isLoggedIn && ( */}
  // <Route path='/patients' element={<Dashboard/>} />   
  // {/* )}
  // {authCtx.isLoggedIn && ( */}
  //   <Route path='/patients/:id/*' element={<Patient/>} />
  // {/* )} */}
  // {/* {authCtx.isLoggedIn && ( */}
  //   <Route path='/indicateurs' element={<MyIndicators/>} />
  // {/* )} */}
  // {/* {authCtx.isLoggedIn && ( */}
  //   <Route path='/tickets' element={<Tickets/>} />
  // {/* )} */}
  // <Route path='/' element={<AuthPage/>} />

  
  //           <Route path='*' element={<NotFound />} />