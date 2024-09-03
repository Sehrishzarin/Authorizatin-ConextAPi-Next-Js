// context/AuthContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NEXT_URL } from '../config';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error,setError]=useState(null);
  const [message,setMessage]=useState(null);

////////////////////////check if the user is logged in or not/////////////////
useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await fetch(`${NEXT_URL}/api/user`);

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking user login status:', error);
      setUser(null);
    }
  };

  fetchUser();
}, []);

//////////////////////////////////////////////
  const router = useRouter();
  //Registration + login-----functionality--------------------//
  const login = async (identifier, password) => {
   // console.log("this is ",identifier);
 //   return false;
    try {
    const res = await fetch(`${NEXT_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    //console.log("this is the data",data)
    if (data.jwt && data.user) {
        setUser(data.user);
        router.push('/products');
      } else {
        console.log(data.error)
        setError(data.error);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred');
    }
  };

 
const logout = async () => {
    const res = await fetch(`${NEXT_URL}/api/logout`, {
      method: 'POST',
    })

    if (res.ok) {
      setUser(null)
      router.push('/login')
    }
  }

const signup = async (username, email, password) => {
    try {
      const res = await fetch(`${NEXT_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
  
    
      const data = await res.json();
  
      if (data.jwt && data.user) {
        setUser(data.user);
        setMessage("Registration complete! You can now log in")
        logout();
        router.push('/login');
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('An unexpected error occurred');
    }
  };

  return (
    <AuthContext.Provider value={{ user,error,message,login,logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);