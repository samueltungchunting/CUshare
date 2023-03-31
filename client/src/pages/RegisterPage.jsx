import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'

const Register = () => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [redirectToLogin, setRedirectToLogin] = useState(false)

  function clearRegisterForm() {
    setName("")
    setEmail("")
    setPassword("")
  }

  async function submitRegister(e) {
      e.preventDefault()
      try {
        await axios.post('/register', {
            name,
            email,
            password
        })
        alert("Registered Successfully!")
        clearRegisterForm()
        setRedirectToLogin(true)
      } catch (error) {
        alert("Error occurs")
      }
  }

  if(redirectToLogin) {
    return <Navigate to={'/login'} />
  }

  return (
    <div>
      <form action=""  className="flex flex-col" onSubmit={submitRegister}>
        <input 
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)} />
        <input 
          type="email" 
          placeholder='abc123@email.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)} />
        <input 
          type="password" 
          placeholder='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)} />
        <button className='rounded-xl py-1 px-2'>Register </button>
        <div className="">Already a member? <Link to={'/login'} className='underline'>Login</Link> </div>
      </form>
    </div>
  )
}

export default Register