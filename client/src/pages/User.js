import React from 'react'
import Layout from '../components/Layout/Layout'
import { useAuth } from '../context/auht'

const User = () => {
    const [auth, setAuth] = useAuth();
    return (
        <Layout>
            <h1>
                hello {auth.user.name}
            </h1>
        </Layout>
    )
}

export default User
