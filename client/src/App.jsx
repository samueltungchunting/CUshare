import './App.css'
import {Routes, Route} from "react-router-dom"
import HomePage from './pages/HomePage'
import Layout from './Layout'
import Login from './pages/LoginPage'
import Register from './pages/RegisterPage'
import axios from 'axios'
import {UserContextProvider} from './UserContext'
import AccountPage from './pages/account/AccountPage'
import MyItemsPage from './pages/account/item/MyItemsPage'
import MyReservationsPage from './pages/account/reservation/MyReservationsPage'
import Item from './pages/place/Item'
import MyItemFormPage from './pages/account/item/MyItemFormPage'

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
          <Route path='/account/my-items' element={<MyItemsPage />} />
          <Route path='/account/my-items/new' element={<MyItemFormPage />} />
          <Route path='/account/my-items/:itemId' element={<MyItemFormPage />} />
          <Route path='/item/:itemId' element={<Item />} />
          <Route path='/account/my-reservations' element={<MyReservationsPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
