import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import './newsComponent.css'
import { NavLink } from 'react-router-dom';


const NewsComponent = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8000/').then((response) => {
            setData(response.data);
        });

    }, []);
    if (data != null) {
        const info = data.final;
        const imgUrl = "https://guwahatiplus.com/public/web/images/default-news.png"
        return (
            <div className=" list-group news-list">
                <div className=" list-group-item list-group-item-action news-item" >
                    <div className="news-info">
                        <NavLink to={info[0].link} className="news-link hover-link">
                            {info[0].title}
                        </NavLink>
                    </div>
                    <div className="image-div">
                        <img src={info[0].image ? (info[0].image) : (imgUrl)} alt="img" className="news-image" />
                    </div>

                </div>
                <div className=" list-group-item list-group-item-action news-item" >
                    <div className="news-info">
                        <NavLink to={info[1].link} className="news-link hover-link">
                            {info[1].title}
                        </NavLink>
                    </div>
                    <div className="image-div">
                        <img src={info[1].image ? (info[1].image) : (imgUrl)} alt="img" className="news-image" />

                    </div>

                </div>
                <div className=" list-group-item list-group-item-action news-item" >
                    <div className="news-info">
                        <NavLink to={info[2].link} className="news-link hover-link">
                            {info[2].title}
                        </NavLink>
                    </div>
                    <div className="image-div">
                        <img src={info[2].image ? (info[2].image) : (imgUrl)} alt="img" className="news-image" />
                    </div>

                </div>
                <div className=" list-group-item list-group-item-action news-item" >
                    <div className="news-info">
                        <NavLink to={info[3].link} className="news-link hover-link">
                            {info[3].title}
                        </NavLink>
                    </div>
                    <div className="image-div">
                        <img src={info[3].image ? (info[3].image) : (imgUrl)} alt="img" className="news-image" />
                    </div>

                </div>
                <div className=" list-group-item list-group-item-action news-item" >
                    <div className="news-info">
                        <NavLink to={info[4].link} className="news-link hover-link">
                            {info[4].title}
                        </NavLink>
                    </div>
                    <div className="image-div">
                        <img src={info[4].image ? (info[4].image) : (imgUrl)} alt="img" className="news-image" />
                    </div>

                </div>
            </div>
        )
    }
}

export default NewsComponent;
