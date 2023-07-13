import React from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Chart from '../components/Chart';
import './StockInfo.css'
import './StockInfoPopup.css'
import NewsComponent from '../components/NewsComponent';
import toast from 'react-hot-toast';
import { useAuth } from '../context/auht';
import { useLocation } from 'react-router-dom';
const StockInfo = () => {
    const { compId } = useParams();
    const [graphdata, setGraphdata] = useState(null);
    const [generalinfo, setGeneralinfo] = useState(null);
    const [quotedata, setQuotedata] = useState(null);
    const [crosshairinfo, setCrosshairinfo] = useState({
        open: 0,
        close: 0,
        high: 0,
        low: 0,
    })
    const [auth, setAuth] = useAuth();
    const [showPopup, setShowPopup] = useState(false);
    const [stocknumber, setNumberOfStocks] = useState('');
    const [stockprice, setPrice] = useState('');
    const [datebought, setDateBought] = useState('');
    const location = useLocation();


    // console.log("hello")
    const handleAddClick = async () => {
        if (auth.user) {
            setShowPopup(true);
        }
        else {
            toast.error("Please login first!")
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitted:', stocknumber, stockprice, typeof datebought);
        setNumberOfStocks('');
        setPrice('');
        setDateBought('');
        setShowPopup(false);
        try {
            const res = await axios.post('http://localhost:8000/api/v1/companydata', { companyID: generalinfo._id, email: auth.user.email, saveType: 2, stocknumber, stockprice, datebought });
            // console.log(res.data)
            if (res.data.success) {
                toast.success("Stock added successfuly!");
            }
            else {
                toast.error(res.data.message)
            }

        }
        catch (error) {
            console.log(error)
            toast.error("something went wrong")
        }
    };
    const handleFollowClick = async () => {
        if (auth.user) {
            try {
                const res = await axios.post('http://localhost:8000/api/v1/companydata', { companyID: generalinfo._id, email: auth.user.email, saveType: 1 });
                // console.log(res.data)
                if (res.data.success) {
                    toast.success("Company added successfuly!");
                }
                else {
                    toast.error(res.data.message)
                }

            }
            catch (error) {
                console.log(error)
                toast.error("something went wrong")
            }
        }
        else {
            toast.error("Please login first!")
        }
    }

    const handleChartUpdate = (chartData) => {
        try {
            if (chartData) {
                setCrosshairinfo({
                    ...crosshairinfo,
                    open: chartData.open,
                    close: chartData.close,
                    high: chartData.high,
                    low: chartData.low,
                })
            }
        }
        catch (error) {
            console.log(error)
        }
    };

    const ar = compId.split('.');
    const symbol = ar[0];


    useEffect(() => {
        axios.post('http://localhost:8000/api/v1/info', { compId }).then((response) => {
            setGraphdata(response.data.data);
            setQuotedata(response.data.quoteData);
        });
        if (ar.length === 1) {
            const query = { symbol: symbol }
            axios.post('http://localhost:8000/api/v1/symbol', { query, querytype: 2 }).then((response) => {
                setGeneralinfo(response.data.data);
            });
        }
        else {
            const query = { symbol: symbol, exchange: ar[1] };
            axios.post('http://localhost:8000/api/v1/symbol', { query, querytype: 2 }).then((response) => {
                setGeneralinfo(response.data.data);
            });
        }
    }, []);
    // console.log(graphdata);
    // console.log(generalinfo);
    // console.log(auth.user.email);
    // console.log(quotedata)
    if (graphdata != null) {
        return (
            <Layout>
                {showPopup && (
                    <div className="popup">
                        <div className="popup-content">
                            <h2>Add stocks</h2>
                            <form onSubmit={handleSubmit}>
                                <label>
                                    Number of Stocks:
                                    <input
                                        type="number"
                                        value={stocknumber}
                                        onChange={(e) => setNumberOfStocks(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Price:
                                    <input
                                        type="number"
                                        value={stockprice}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                </label>
                                <label>
                                    Date Bought:
                                    <input
                                        type="date"
                                        value={datebought}
                                        onChange={(e) => setDateBought(e.target.value)}
                                    />
                                </label>
                                <button type="submit">Submit</button>
                                <button type="button" onClick={() => { setShowPopup(false); }}>Close</button>
                            </form>
                        </div>
                    </div>
                )}
                <div className='content'>

                    <div className='left container'>
                        <div className='top-most'>
                            <div className='upper-sec'>
                                <div className="section1">
                                    <h1 className='company-name'>
                                        {generalinfo.name}
                                    </h1>
                                </div>
                                <div className="section2">
                                    {generalinfo.exchange === 'BSE' || generalinfo.exchange === 'NSE' ? '\u20B9' : '$'}&nbsp;
                                    {parseFloat(quotedata.price).toFixed(2)}
                                </div>
                                <div className="section3" style={{ color: parseFloat(quotedata.change) < 0 ? 'red' : 'green' }}>
                                    {parseFloat(quotedata.change).toFixed(2)}%
                                </div>

                            </div>
                            <div className='bottom-sec'>
                                <div className='bottom-sec-1'>
                                    <button className="button" onClick={handleFollowClick}>follow</button>
                                    <button className="button" onClick={handleAddClick}>add stock</button>
                                </div>
                                <div className='bottom-sec-2'>
                                    <p className='crosshair-info'>
                                        <span style={{ color: 'black' }}>o:</span> <span style={{ color: 'rgb(253, 112, 20)' }}>{crosshairinfo.open.toFixed(2)}</span>&nbsp;&nbsp;&nbsp;
                                        <span style={{ color: 'black' }}>c:</span> <span style={{ color: 'rgb(253, 112, 20)' }}>{crosshairinfo.close.toFixed(2)}</span>&nbsp;&nbsp;&nbsp;
                                        <span style={{ color: 'black' }}>h:</span> <span style={{ color: 'rgb(253, 112, 20)' }}>{crosshairinfo.high.toFixed(2)}</span>&nbsp;&nbsp;&nbsp;
                                        <span style={{ color: 'black' }}>l:</span> <span style={{ color: 'rgb(253, 112, 20)' }}>{crosshairinfo.low.toFixed(2)}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='candle-graph'>
                            <Chart data={graphdata} onUpdate={handleChartUpdate} />
                        </div>
                    </div>
                    <div className='right-container'>
                        <NewsComponent />
                    </div>
                </div>
            </Layout>
        )
    }
}

export default StockInfo
