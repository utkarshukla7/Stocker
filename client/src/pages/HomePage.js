import React, { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { useAuth } from "../context/auht";
import NewsComponent from "../components/NewsComponent";
import "./Homepage.css";
import axios from "axios";
import Graph from "../components/Graph";

const HomePage = () => {
  const [auth, setAuth] = useAuth();
  const [data, setData] = useState([]);
  const [ind, setInd] = useState(0);
  useEffect(() => {
    axios.get("http://localhost:8000/index").then((response) => {
      console.log(response.data.full_data);
      setData(response.data.full_data);
    });
  }, []);

  const handleNif = () => {
    setInd(0);
  };
  const handleSen = () => {
    setInd(1);
  };
  const handleNas = () => {
    setInd(2);
  };
  if (data.length != 0) {
    console.log(data);
    const nif =
      ((data[0][499].value - data[0][498].value) / data[0][499].value) * 100;
    const sen =
      ((data[1][499].value - data[1][498].value) / data[1][499].value) * 100;
    const nas =
      ((data[2][499].value - data[2][498].value) / data[2][499].value) * 100;
    return (
      <Layout>
        <div className="content">
          <div className="left container">
            <div className="top-button">
              <div
                className="index-btn"
                onClick={handleNif}
                role="button"
                style={{
                  backgroundColor:
                    ind == 0 ? "rgb(238, 238, 238)" : "gainsboro",
                }}
              >
                <span>NIFTY</span>
                <span
                  style={{
                    color: parseFloat(nif) < 0 ? "red" : "green",
                  }}
                >
                  {data[0][499].value}&nbsp;&nbsp;&nbsp;{nif.toFixed(2)}%
                </span>
              </div>
              <div
                className="index-btn"
                onClick={handleSen}
                role="button"
                style={{
                  backgroundColor:
                    ind == 1 ? "rgb(238, 238, 238)" : "gainsboro",
                }}
              >
                <span>SENSEX</span>
                <span
                  style={{
                    color: parseFloat(sen) < 0 ? "red" : "green",
                  }}
                >
                  {data[1][499].value}&nbsp;&nbsp;&nbsp;{sen.toFixed(2)}%
                </span>
              </div>
              <div
                className="index-btn"
                onClick={handleNas}
                role="button"
                style={{
                  backgroundColor:
                    ind == 2 ? "rgb(246, 242, 242)" : "gainsboro",
                }}
              >
                <span>NASDAQ</span>
                <span
                  style={{
                    color: parseFloat(nas) < 0 ? "red" : "green",
                  }}
                >
                  {data[2][499].value}&nbsp;&nbsp;&nbsp;{nas.toFixed(2)}%
                </span>
              </div>
            </div>
            {data.length >= 3 && ind == 0 && (
              <div className="home-graph">
                <Graph data={data[0]} width={900} height={350} />
              </div>
            )}
            {data.length >= 3 && ind == 1 && (
              <div className="home-graph">
                <Graph data={data[1]} width={900} height={350} />
              </div>
            )}
            {data.length >= 3 && ind == 2 && (
              <div className="home-graph">
                <Graph data={data[2]} width={900} height={350} />
              </div>
            )}
          </div>
          <div className="right-container">
            <NewsComponent />
          </div>
        </div>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <div
          hello
          className="spinner-border"
          role="status"
          style={{ position: "absolute", top: "50vh", left: "50vw" }}
        ></div>
      </Layout>
    );
  }
};

export default HomePage;
