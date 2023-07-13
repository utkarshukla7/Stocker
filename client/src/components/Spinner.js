import React, { useState, useEffect } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'

const Spinner = () => {
    const [count, setCount] = useState(5);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prev) => --prev);
        }, 1000);
        count === 0 && navigate('/login', {
            state: location.pathname,
        });  ///if count 0 then navigate to login route
        return () => clearInterval(interval)
    }
        , [count, navigate])
    return (
        <>
            <div className="d-flex  flex-column align-items-center justify-content-center" style={{ height: "100vh" }}>
                <h1 className='Text-center'>Redirecting in {count}</h1>
                <div className="spinner-border" role="status">
                </div>
            </div>
        </>

    )
}

export default Spinner
