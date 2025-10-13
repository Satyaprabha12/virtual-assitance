import { Route, Routes, Navigate } from 'react-router-dom'
import SignUp from './pages/signup'
import SingIn from './pages/singin'
import Customize from './pages/customize'
import Customize2 from './pages/customize2'
import { useContext } from 'react'
import { userDataContext } from './context/usercontext'
import Home from './pages/home'


function App() {
  const {userData} = useContext(userDataContext)
  return (
   <Routes>
    <Route path='/' element={(userData?.assistantImage && userData?.assistantName) ? <Home /> : <Navigate to={"/customize"} />} />
    <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={"/"} />} />
    <Route path='/signin' element={!userData ? <SingIn /> : <Navigate to={"/"} />} />
    <Route path='/customize' element={userData ? <Customize /> : <Navigate to={"/signup"} />} />
    <Route path='/customize2' element={userData ? <Customize2 /> : <Navigate to={"/signup"} />} />
   </Routes>
  )
}

export default App
