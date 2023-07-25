import React from "react";
import ReactApexChart from "react-apexcharts";

const Piechart = ({ namelist, investmentlist, totalinvestment }) => {
  const series = investmentlist;

  const options = {
    labels: namelist,
    legend: {
      show: false,
    },
    dataLabels: { enabled: false },
    chart: {
      type: "donut",
    },
    plotOptions: {
      pie: {
        customScale: 0.8,
        dataLabels: {
          show: false,
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 0,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div style={{ width: "40%", padding: "0px", margin: "0px" }}>
      <ReactApexChart options={options} series={series} type="donut" />
      <span style={{ marginLeft: "26%", marginTop: "0%" }}>
        Total investment : {totalinvestment}
      </span>
    </div>
  );
};

export default Piechart;
