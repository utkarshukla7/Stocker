import React from 'react'
import Layout from '../components/Layout/Layout'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/auht'
// import { response } from 'express'
const Dashboard = () => {
    const [auth, setAuth] = useAuth()

    useEffect(() => {
        axios.post('api/v1/user/dashboard', { email: auth.user.email }).then((response) => {
            console.log(response.data);
        });

    }, [])
    return (
        <Layout>
            Dashboard
        </Layout>
    )
}

export default Dashboard
