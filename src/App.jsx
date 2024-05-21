import React from 'react';
import Home from './ui/Home';
import ProfileView from './ui/ProfileView';
import LoginView from './ui/LoginView';
import { BrowserRouter as Router, Routes, Route,useParams } from 'react-router-dom';
import ProtectedRoute from './uiLib/ProtectedRoute';
import UserView from './ui/UserView';
import { jwtDecode } from 'jwt-decode';
function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={
            <ProtectedRoute>
              <Home/>
            </ProtectedRoute>
          }/>
          <Route path='/profile' element={
            <ProtectedRoute>
              <ProfileView/>
            </ProtectedRoute>
          }/>
          <Route path='/profile/:idUser' element={
            <ProtectedRoute>
              <UserViewWrapper />
            </ProtectedRoute>
          }/>
          <Route path='/login' element={<LoginView/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App

function UserViewWrapper() {
  let { idUser } = useParams(); 
  let idDecoded = jwtDecode(localStorage.getItem('jwt')).id;

  if (idUser === idDecoded) {
    return <ProfileView />;
  }else{
    return <UserView idUser={idUser} />;
  }
}
