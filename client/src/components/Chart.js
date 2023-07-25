import {
  createChart,
  ColorType,
  CrosshairMode,
  LineStyle,
} from "lightweight-charts";
import React, { useRef, useEffect } from "react";

const Chart = (props) => {
  console.log(props.data);
  const {
    data,
    colors: {
      backgroundColor = "black",
      lineColor = "#2962FF",
      textColor = "white",
      areaTopColor = "#2962FF",
      areaBottomColor = "rgba(41, 98, 255, 0.28)",
    } = {},
    onUpdate,
  } = props;

  const chartContainerRef = useRef();

  const handleCrosshairMove = (event) => {
    if (event) {
      const data = event.seriesData;
      var fin;
      data.forEach((value, key) => {
        fin = value;
      });
      // console.log(fin);
      onUpdate(fin);
    }
  };
  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "white" },
        textColor: "rgb(57, 62, 70)",
      },
      grid: {
        vertLines: { color: "transparent" }, // Remove vertical grid lines
        horzLines: { color: "#C3BCDB44" }, // Remove horizontal grid lines
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    chart.subscribeCrosshairMove(handleCrosshairMove);
    chart.timeScale().applyOptions({
      borderColor: "grey",
    });
    chart.applyOptions({
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          width: 8,
          color: "#C3BCDB44",
          style: LineStyle.Solid,
          labelBackgroundColor: "rgb(57, 62, 70)",
        },
        horzLine: {
          color: "rgb(57, 62, 70)",
          labelBackgroundColor: "rgb(57, 62, 70)",
        },
      },
    });

    chart.timeScale().fitContent();

    const newSeries = chart.addCandlestickSeries({
      wickUpColor: "rgb(54, 116, 217)",
      upColor: "rgb(54, 116, 217)",
      wickDownColor: "rgb(225, 50, 85)",
      downColor: "rgb(225, 50, 85)",
      borderVisible: false,
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
    // areaSeries.setData(data);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, []);

  return <div ref={chartContainerRef} />;
};

export default Chart;
