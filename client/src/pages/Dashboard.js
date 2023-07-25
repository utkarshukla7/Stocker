import React from "react";
import Layout from "../components/Layout/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auht";
import "./dashboard.css";
import Graph from "../components/Graph";
import { useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import ApexCharts from "apexcharts";
import Piechart from "../components/Piechart";
import NewsComponent from "../components/NewsComponent";
import { toast } from "react-hot-toast";
const Dashboard = () => {
  const [auth, setAuth] = useAuth();
  const [selectedButton, setSelectedButton] = useState("left");
  const [watchlist, setWatchlist] = useState([
    // {
    //   name: "demo",
    //   symbol: "demo",
    //   exchange: "demo",
    //   change: 5,
    //   changePercent: 5,
    //   price: 10,
    // },
    // {
    //   name: "demo",
    //   symbol: "demo",
    //   exchange: "demo",
    //   change: 5,
    //   changePercent: 5,
    //   price: 10,
    // },
  ]);
  const [portfoliolist, setPortfoliolist] = useState([
    // {
    //   name: "demo",
    //   symbol: "demo",
    //   exchange: "demo",
    //   compTotalProfit: 69,
    //   compTotalInvestment: 69,
    //   compTotalStocks: 69,
    //   compData: [{ time: "2022-02-02", value: 69 }],
    // },
  ]);
  const [userCompleteGraphData, setUserCompleteGraphData] = useState([
    // { time: "2022-02-02", value: 69 },
  ]);
  const [gainer, setGainer] = useState([
    // [5000, "apurva"],
    // [50, "Utkarsh"],
  ]);
  const [looser, setLooser] = useState([
    // [50, "Utkarsh"],
    // [5000, "apurva"],
  ]);
  const [userTotalInvestment, setUserTotalInvestment] = useState(0);
  const [namelist, setNamelist] = useState([]);
  const [investmentlist, setInvestmentlist] = useState([]);
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();

  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };

  const handleFollowItemClick = async (sym, exch) => {
    if (exch == "BSE" || exch == "NSE") {
      sym = sym + "." + exch;
    }
    // console.log(sym)
    const url = `/info/${sym}`;
    navigate(url);
  };

  const handleDel = async (name, exchange) => {
    try {
      const res = await axios.post("http://localhost:8000/api/v1/companydata", {
        companyName: name,
        companyExchange: exchange,
        email: auth.user.email,
        saveType: 3,
      });
      // console.log(res.data)
      if (res.data.success) {
        toast.success("Stock removed successfuly!");
      } else {
        toast.error(res.data.message);
      }

      setReload(true);
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  useEffect(() => {
    console.log("email", auth.user.email);
    (async () => {
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/dashboard",
        {
          email: auth.user.email,
        }
      );
      setWatchlist(response.data.followList);
      setPortfoliolist(response.data.Portfoliolist);
      setUserCompleteGraphData(response.data.userCompleteGraphData);
      setGainer(response.data.gainer);
      setLooser(response.data.looser);
      setNamelist(response.data.namelist);
      setInvestmentlist(response.data.investmentlist);
      setUserTotalInvestment(response.data.userTotalInvestment);
    })();

    return () => {
      // this now gets called when the component unmounts
    };
  }, [reload]);
  //   console.log(auth.user.email);
  console.log("1", portfoliolist);
  return (
    <Layout>
      <div className="container-dash">
        <div className="left-container-dash">
          <div className="selection-buttons">
            <button
              className={`btn-1 ${selectedButton === "left" ? "selected" : ""}`}
              onClick={() => handleButtonClick("left")}
            >
              Watchlist
            </button>
            <button
              className={
                `btn-1 ${selectedButton === "right" ? "selected" : ""}` +
                " btn-2"
              }
              onClick={() => handleButtonClick("right")}
            >
              Portfolio
            </button>
          </div>
          {selectedButton === "left" ? (
            <div className="data-container">
              {watchlist.length ? (
                <div>
                  <ul className="follow-list">
                    {watchlist.map((item) => (
                      <li key={item.name} className="item">
                        <div className="item-div">
                          <div
                            className="section1-dash"
                            onClick={() =>
                              handleFollowItemClick(item.symbol, item.exchange)
                            }
                          >
                            {item.name}
                          </div>
                          <div
                            className="section2-dash"
                            onClick={() =>
                              handleFollowItemClick(item.symbol, item.exchange)
                            }
                          >
                            {item.exchange === "BSE" || item.exchange === "NSE"
                              ? "\u20B9"
                              : "$"}
                            &nbsp;
                            {parseFloat(item.price).toFixed(2)}
                          </div>
                          <div
                            className="section3-dash"
                            onClick={() =>
                              handleFollowItemClick(item.symbol, item.exchange)
                            }
                            style={{
                              color:
                                parseFloat(item.change) < 0 ? "red" : "green",
                            }}
                          >
                            {item.exchange === "BSE" || item.exchange === "NSE"
                              ? "\u20B9"
                              : "$"}
                            &nbsp;
                            {parseFloat(item.change).toFixed(2)}
                          </div>
                          <div
                            className="section4-dash"
                            onClick={() =>
                              handleFollowItemClick(item.symbol, item.exchange)
                            }
                            style={{
                              color:
                                parseFloat(item.change) < 0 ? "red" : "green",
                            }}
                          >
                            {parseFloat(item.changePercent).toFixed(2)}%
                          </div>
                          <div className="setion5-dash">
                            <button
                              className="btn del-btn"
                              onClick={() => {
                                handleDel(item.name, item.exchange);
                              }}
                            >
                              <svg
                                viewBox="0 0 15 17.5"
                                height="17.5"
                                width={15}
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon"
                              >
                                <path
                                  transform="translate(-2.5 -1.25)"
                                  d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z"
                                  id="Fill"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="empty-container">
                  <h1 className="empty-declaration">Your watchlist is empty</h1>
                </div>
              )}
            </div>
          ) : (
            <div className="data-container">
              {/* {console.log("3", portfoliolist)} */}
              {portfoliolist.length ? (
                <>
                  <div>
                    <Accordion className="portfolio-list">
                      {portfoliolist.map((item) => (
                        <Accordion.Item
                          eventKey={item.name}
                          className="portfolio-item"
                        >
                          <Accordion.Header className="portfolio-item-header">
                            {item.name}
                          </Accordion.Header>
                          <Accordion.Body>
                            <div className="portfolio-item-body">
                              <div className="dash-graph-data">
                                <Graph
                                  data={item.compData}
                                  w={
                                    document.getElementsByClassName(
                                      "dash-graph-data"
                                    )?.style?.width
                                  }
                                />
                              </div>
                              <div className="dash-raw-data">
                                <span className="primary-span">
                                  <span style={{ marginRight: "62px" }}>
                                    Exchange :
                                  </span>
                                  <span>{item.exchange}</span>
                                </span>

                                <span className="secondary-span">
                                  <span style={{ marginRight: "50px" }}>
                                    Total stocks :
                                  </span>
                                  <span>{item.compTotalStocks}</span>
                                </span>
                                <span className="secondary-span">
                                  <span style={{ marginRight: "46px" }}>
                                    Buying Price :
                                  </span>
                                  <span>
                                    {item.exchange === "BSE" ||
                                    item.exchange === "NSE"
                                      ? "\u20B9"
                                      : "$"}
                                    &nbsp;
                                    {item.compTotalInvestment.toFixed(2)}
                                  </span>
                                </span>
                                <span className="secondary-span">
                                  <span style={{ marginRight: "42px" }}>
                                    Current price :
                                  </span>
                                  <span>
                                    {item.exchange === "BSE" ||
                                    item.exchange === "NSE"
                                      ? "\u20B9"
                                      : "$"}
                                    &nbsp;
                                    {(
                                      item.price * item.compTotalStocks
                                    ).toFixed(2)}
                                  </span>
                                </span>
                                <span className="secondary-span">
                                  <span style={{ marginRight: "96px" }}>
                                    Profit :
                                  </span>
                                  <span
                                    style={{
                                      color:
                                        parseFloat(item.compTotalProfit) < 0
                                          ? "red"
                                          : "green",
                                    }}
                                  >
                                    {item.exchange === "BSE" ||
                                    item.exchange === "NSE"
                                      ? "\u20B9"
                                      : "$"}
                                    &nbsp;
                                    {item.compTotalProfit.toFixed(2)}
                                  </span>
                                </span>
                                <span className="secondary-span">
                                  <span>Profit Percentage :</span>
                                  &nbsp;&nbsp;&nbsp;
                                  <span
                                    style={{
                                      color:
                                        parseFloat(item.compTotalProfit) < 0
                                          ? "red"
                                          : "green",
                                    }}
                                  >
                                    {(
                                      (item.compTotalProfit /
                                        item.compTotalInvestment) *
                                      100
                                    ).toFixed(2)}
                                    %
                                  </span>
                                </span>
                                <span
                                  className="secondary-span"
                                  style={{ marginTop: "20px" }}
                                >
                                  <span>
                                    This stock is{" "}
                                    {(
                                      (item.compTotalInvestment /
                                        userTotalInvestment) *
                                      100
                                    ).toFixed(2)}
                                    % of your total investment (by value).
                                  </span>
                                </span>
                              </div>
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </div>
                  <div className="userInvestmentGraph">
                    <Graph
                      data={userCompleteGraphData}
                      colors={{
                        lineColor: "rgb(70, 130, 169)",
                        areaTopColor: "rgb(70, 130, 169)",
                        areaBottomColor: "rgba(70, 130, 169,0.28)",
                      }}
                    />
                    <Piechart
                      namelist={namelist}
                      investmentlist={investmentlist}
                      totalinvestment={userTotalInvestment}
                    />
                  </div>
                  {/* <div className="pie-container">
                    <Piechart />
                  </div> */}
                </>
              ) : (
                <div className="empty-container">
                  <h1 className="empty-declaration">Your Portfolio is empty</h1>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="right-container-dash">
          <div className="user-gainer-looser">
            <span
              className="gainer"
              style={{ textDecoration: "underline", letterSpacing: "0.1em" }}
            >
              Top gainers
            </span>
            {gainer.length ? (
              <div>
                <ul className="gainer-looser-list">
                  {gainer.map((item) => (
                    <li key={item[1]} className="gainer-looser-item">
                      <div className="gainer-looser-div">
                        <span className="gainer-looser-content">{item[1]}</span>
                      </div>
                      <span
                        className="gainer-looser-info"
                        style={{ color: "green" }}
                      >
                        {": "}
                        {"\u20B9"}
                        {item[0].toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <span className="nothing-to-say">Nothing to show!</span>
            )}
            <span
              className="gainer"
              style={{ textDecoration: "underline", letterSpacing: "0.1em" }}
            >
              Top loosers
            </span>
            {looser.length ? (
              <div>
                <ul className="gainer-looser-list">
                  {looser.map((item) => (
                    <li key={item[1]} className="gainer-looser-item">
                      <div className="gainer-looser-div">
                        <span className="gainer-looser-content">{item[1]}</span>
                      </div>
                      <span
                        className="gainer-looser-info"
                        style={{ color: "red" }}
                      >
                        {": "}
                        {"\u20B9"}
                        {item[0].toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <span className="nothing-to-say">Nothing to show!</span>
            )}
          </div>
          {/* <NewsComponent /> */}
        </div>
      </div>
    </Layout>
  );
};
// }

export default Dashboard;
