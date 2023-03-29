import React, { useContext, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../UserContext'

const Login = () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [redirect, setRedirect] = useState(false)

  const { setUser } = useContext(UserContext)

  async function handleLogin(e) {

    e.preventDefault()

    try {
      const response = await axios.post('/login', {
        email,
        password
      })

      setUser(response.data)
      console.log(response.data);
      alert("Login successfully")
      setRedirect(true)
      // <Navigate to={'/'} /> // unable to do this, red underline
    } catch (e) {
      console.log(e)
      alert("FAILED to login")
    }
  }

  if(redirect) return <Navigate to={'/'} />

  return (
    <div>
      <form action=""  className="flex flex-col" onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder='abc123@email.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <input 
          type="text" 
          placeholder='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <button className='rounded-xl py-1 px-2'>Login</button>
        <div className="">Do not have account? <Link to={'/register'} className='underline'>Register</Link> </div>
      </form>
    </div>
  )
}

export default Login