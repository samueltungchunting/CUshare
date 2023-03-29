import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'

export const UserContext = createContext({})

export function UserContextProvider({children}) { // using this function to wrap all the pages
    const [user, setUser] = useState(null)
    const [ready, setReady] = useState(false)

    useEffect(() => {
      // console.log("idk why user is null...", user);
      if(!user) {
        axios.get('/profile').then(({data}) => {
          const { name } = data
          setUser(data)
          setReady(true)
        })
      }
    }, [])

  return (
    <UserContext.Provider value={{user, setUser, ready}}>
        {children}
    </UserContext.Provider>
  )
}