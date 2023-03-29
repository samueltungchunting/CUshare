import './App.css'
import {Routes, Route} from "react-router-dom"
import HomePage from './pages/HomePage'
import Layout from './Layout'
import Login from './pages/LoginPage'
import Register from './pages/RegisterPage'
import axios from 'axios'
import {UserContextProvider} from './UserContext'
import AccountPage from './pages/account/AccountPage'
import AccommodationsPage from './pages/account/accommodation/AccommodationsPage'
import AccommodationsFormPage from './pages/account/accommodation/AccommodationsFormPage'
import BookingsPage from './pages/account/booking/BookingsPage'
import Place from './pages/place/Place'

// axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.baseURL = 'http://127.0.0.1:4000'
axios.defaults.withCredentials = true

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/account' element={<AccountPage />} />
          <Route path='/account/accommodations' element={<AccommodationsPage />} />
          <Route path='/account/accommodations/new' element={<AccommodationsFormPage />} />
          <Route path='/account/accommodations/:placeId' element={<AccommodationsFormPage />} />
          <Route path='/place/:placeId' element={<Place />} />
          <Route path='/account/bookings' element={<BookingsPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
