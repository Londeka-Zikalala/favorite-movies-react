import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const localToken = localStorage.getItem('token')
        const userID = localStorage.getItem('userId')
        
        const authenticatedToken = localStorage.getItem('authenticatedToken')

        if (localToken) {
            setToken(localToken);
        }
        if (userID) {
            setUserId(userID)
        }

        if (authenticatedToken === 'true') {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
    }, [])

    const login = (token, userID)=>{

        localStorage.setItem("token", token )
        localStorage.setItem("userId", userID)
        localStorage.setItem("authenticatedToken", true)

        setToken(token)
        setUserId(userID)
        setIsAuthenticated(true)

    }

    const logout = ()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("userId")
        localStorage.removeItem("authenticatedToken")

        setToken(null)
        setUserId(null)
        setIsAuthenticated(false)
    }
    return (
        <AuthContext.Provider value={{ login, logout, setIsAuthenticated, isAuthenticated, token, setToken, userId, setUserId }}>

            {children}
        </AuthContext.Provider>
    )

}