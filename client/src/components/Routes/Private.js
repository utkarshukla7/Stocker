import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/auht'
import { Outlet } from 'react-router-dom'; //outlet is used in parent component in  order to render there child component when the route matches the route of child component
import axios from 'axios';
import Spinner from '../Spinner';

export const PrivateRoute = () => {
    const [ok, setOk] = useState(false);
    const [auth, setAuth] = useAuth();

    useEffect(() => {
        const authCheck = async () => {
            const res = await axios.post('api/v1/user/dashboard');
            if (res.data.ok) {
                setOk(true);
            }
            else {
                setOk(false);
            }
        }
        if (auth?.token) {
            authCheck();
        }
    }
        , [auth?.token])
    return ok ? <Outlet /> : <Spinner />                        //outlet basically enables nested routing
}
