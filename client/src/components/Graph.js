import {
  createChart,
  ColorType,
  CrosshairMode,
  LineStyle,
} from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";

const Graph = (props) => {
  const [final, setFinal] = useState([]);
  const data = props.data;
  const backgroundColor = props.colors?.backgroundColor || "black";
  const lineColor = props.colors?.lineColor || "rgb(84, 180, 53)";
  const textColor = props.colors?.textColor || "white";
  const areaTopColor = props.colors?.areaTopColor || "rgb(84, 180, 53)";
  const areaBottomColor =
    props.colors?.areaBottomColor || "rgba(84, 180, 53, 0.28)";
  const [counter, setCounter] = useState(0);
  const chartContainerRef = useRef();
  console.log(data);

  const createChartInstance = () => {
    const chart = createChart(chartContainerRef?.current, {
      layout: {
        background: { color: "white" },
        textColor: "rgb(57, 62, 70)",
      },
      grid: {
        vertLines: { color: "transparent" }, // Remove vertical grid lines
        horzLines: { color: "#C3BCDB44" }, // Remove horizontal grid lines
      },
      width: props.width ? props.width : 550,
      height: props.height ? props.height : 300,
    });
    chart.timeScale().fitContent();
    chart.timeScale().applyOptions({
      borderColor: "grey",
    });
    chart.applyOptions({
      crosshair: {
        vertLine: {
          width: 1,
          color: "rgb(57, 62, 70)",
          style: LineStyle.Solid,
          labelBackgroundColor: "rgb(57, 62, 70)",
        },
        horzLine: {
          color: "rgb(57, 62, 70)",
          labelBackgroundColor: "rgb(57, 62, 70)",
        },
      },
    });
    const newSeries = chart.addAreaSeries({
      lineColor,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
    });
    newSeries.priceScale().applyOptions({
      position: "left",
      autoScale: false, // disables auto scaling based on visible content
      scaleMargins: {
        top: 0.1,
        bottom: 0.2,
      },
      borderColor: "white",
    });
    newSeries.setData(data);

    const handleResize = () => {
      chart.applyOptions({
        width: props.width ? props.width : 550,
        height: props.height ? props.height : 300,
      });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  };
  useEffect(() => {
    console.log();
    createChartInstance();
  }, []);

  return <div ref={chartContainerRef} />;
};

export default Graph;
