import React from 'react'
import Layout from '../components/Layout/Layout'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/auht'
import './dashboard.css'
import Graph from '../components/Graph'
import { useNavigate } from 'react-router-dom'
import Accordion from 'react-bootstrap/Accordion';
const Dashboard = () => {
    const [auth, setAuth] = useAuth()
    const [selectedButton, setSelectedButton] = useState('left');
    const [watchlist, setWatchlist] = useState([])
    const [portfoliolist, setPortfoliolist] = useState([]);
    const navigate = useNavigate();

    const handleButtonClick = (button) => {
        setSelectedButton(button);
    };
    const handleFollowItemClick = async (sym, exch) => {
        if (exch == 'BSE' || exch == 'NSE') {
            sym = sym + '.' + exch
        }
        // console.log(sym)
        const url = `/info/${sym}`;
        navigate(url);
    }
    // console.log(auth.user.email)
    useEffect(() => {
        (async () => {
            const response = await axios.post('api/v1/user/dashboard', { email: auth.user.email })
            console.log(response)
            setWatchlist(response.data.followList);
            setPortfoliolist(response.data.Portfoliolist)
            console.log(response.data)
            console.log('0')
        })();

        return () => {
            // this now gets called when the component unmounts
        };
    }, []);


    console.log('1', portfoliolist)
    return (
        <Layout>
            <div className='container-dash'>
                <div className='left-container-dash'>
                    <div className='selection-buttons'>
                        <button
                            className={`btn-1 ${selectedButton === 'left' ? 'selected' : ''}`}
                            onClick={() => handleButtonClick('left')}
                        >
                            Watchlist
                        </button>
                        <button
                            className={`btn-1 ${selectedButton === 'right' ? 'selected' : ''}` + " btn-2"}
                            onClick={() => handleButtonClick('right')}
                        >
                            Portfolio
                        </button>

                    </div>
                    {selectedButton == 'left' &&
                        <div className='data-container'>
                            {watchlist.length &&
                                <div>
                                    <ul className='follow-list'>
                                        {watchlist.map((item) => (
                                            <li key={item.name} className='item'>
                                                <div className='item-div' onClick={() => handleFollowItemClick(item.symbol, item.exchange)}>

                                                    <div className="section1-dash">
                                                        {item.name}
                                                    </div>
                                                    <div className="section2-dash">
                                                        {item.exchange === 'BSE' || item.exchange === 'NSE' ? '\u20B9' : '$'}&nbsp;
                                                        {parseFloat(item.price).toFixed(2)}
                                                    </div>
                                                    <div className="section3-dash" style={{ color: parseFloat(item.change) < 0 ? 'red' : 'green' }}>
                                                        {item.exchange === 'BSE' || item.exchange === 'NSE' ? '\u20B9' : '$'}&nbsp;
                                                        {parseFloat(item.change).toFixed(2)}
                                                    </div>
                                                    <div className="section4-dash" style={{ color: parseFloat(item.change) < 0 ? 'red' : 'green' }}>
                                                        {parseFloat(item.changePercent).toFixed(2)}%
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            }
                            {watchlist.length == 0 &&
                                <div className='empty-container'>
                                    <h1 className='empty-declaration'>
                                        Your watchlist is empty

                                    </h1>
                                </div>
                            }

                        </div>
                    }
                    {selectedButton == 'right' &&
                        <div className='data-container'>
                            {portfoliolist.length &&
                                <div>
                                    <Accordion className='portfolio-list'>

                                        {portfoliolist.map((item) => (
                                            <Accordion.Item eventKey={item.name} className='portfolio-item'>
                                                <Accordion.Header className='portfolio-item-header'>{item.name}</Accordion.Header>
                                                <Accordion.Body>
                                                    {/* {console.log(item.compData)} */}
                                                    <Graph data={item.compData} />
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))}

                                    </Accordion>
                                </div>
                            }
                            {portfoliolist.length == 0 &&
                                <div className='empty-container'>
                                    <h1 className='empty-declaration'>
                                        Your Portfolio is empty

                                    </h1>
                                </div>
                            }

                        </div>
                    }
                </div>
                <div className='right-container-dash'>
                    bye
                </div>
            </div>
        </Layout>
    )
}
// }


export default Dashboard


