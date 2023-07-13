import React from 'react'
import Layout from '../components/Layout/Layout'
import { useAuth } from '../context/auht';
import NewsComponent from '../components/NewsComponent';


const HomePage = () => {
    const [auth, setAuth] = useAuth();

    return (
        <Layout>
            <div className='content'>
                <div className='left container'>
                    home sweet home
                </div>
                <div className='right-container'>
                    <NewsComponent />
                </div>
            </div>
        </Layout>
    )
}


export default HomePage
