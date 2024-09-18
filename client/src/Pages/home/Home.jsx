import React from 'react'
import './Home.css'
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook


const Home = () => {
    const navigate = useNavigate(); 
    const getStart = () => {
        navigate('/login'); 
    };
  return (
    <div className='homeContainer'>
        <h1>Welcome to, </h1>
        <span>invoice management <br/> &<br/> Payment Solution</span>
        <button onClick={getStart}> Get Start</button>
    </div>
  )
}

export default Home