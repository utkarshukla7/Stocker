import React from 'react'
import Header from './Header'
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';

const Layout = (props) => {
    return (
        <div>
            <Header />
            <main style={{ minHeight: '80vh' }}>
                {props.children}
                <Toaster />
                {/* <h1>layout</h1> */}

            </main>
            {/* <Footer /> */}
        </div>
    );
};

export default Layout;
