import React, { useEffect, useState } from "react";
import _ from "underscore";
import moment from "moment";

import { TimeRange } from "pondjs";

import ChartContainer from "../../components/ChartContainer";
import ChartRow from "../../components/ChartRow";
import Charts from "../../components/Charts";
import YAxis from "../../components/YAxis";
import LineChart from "../../components/LineChart";
import Resizable from "../../components/Resizable";

import styler from "../../js/styler";

const style = styler([
    { key: "connections", color: "#2ca02c", width: 1 },
    { key: "requests", color: "#9467bd", width: 1 }
]);

const InteractiveCharts = (props) => {
    const [max, setMax] = useState(100);
    const [active, setActive] = useState({
        requests: true,
        connections: true
    })
    const [timerange, setTimerange] = useState(props.connectionsSeries.range());
    const [title, setTitle] = useState("TSLA SHARE PRICE on");
    useEffect(() => {
        const startTime = props.dateInfo[0][0];
        const endTime = props.dateInfo[props.dateInfo.length - 1][0];
        const timestamp = new Date(endTime);
        const todate = new Date(timestamp).getDate();
        const tomonth = new Date(timestamp).getMonth() + 1;
        const toyear = new Date(timestamp).getFullYear();
        const today_date = toyear + '-' + tomonth + '-' + todate;
        setTitle(`TSLA SHARE PRICE on ${today_date}`);
        let beginTime;
        const timeWindow = 1000 * 60;
        if (endTime - startTime < timeWindow) {
            beginTime = startTime;
        } else {
            beginTime = startTime + 1000 * (endTime - startTime - timeWindow) / 1000;
        }
        const _timeRange = new TimeRange(beginTime, endTime);
        setTimerange(_timeRange);
    }, [props])

    const handleRescale = _.debounce(rescale, 300);

    const rescale = (_timerange, active = active) => {
        let _max = 100;
        const maxConnections = props.connectionsSeries.crop(_timerange).max("connections");
        if (maxConnections > _max && active.connections) _max = maxConnections;
        setMax(_max);
    }

    const handleTimeRangeChange = _timerange => {
        setTimerange(_timerange);
        handleRescale(_timerange);
    };

    const renderChart = () => {
        let charts = [];
        let _max = 1000;
        if (active.connections) {
            const maxConnections = props.connectionsSeries.crop(timerange).max("connections");
            if (maxConnections > _max) _max = maxConnections;
            charts.push(
                <LineChart
                    key="connections"
                    axis="axis2"
                    series={props.connectionsSeries}
                    columns={["connections"]}
                    style={style}
                    interpolation="curveBasis"
                />
            );
        }
        const darkAxis = {
            label: {
                stroke: "none",
                fill: "#AAA",
                fontWeight: 200,
                fontSize: 14,
                font: '"Goudy Bookletter 1911", sans-serif"'
            },
            values: {
                stroke: "none",
                fill: "#888",
                fontWeight: 100,
                fontSize: 11,
                font: '"Goudy Bookletter 1911", sans-serif"'
            },
            ticks: {
                fill: "none",
                stroke: "#AAA",
                opacity: 0.2
            },
            axis: {
                fill: "none",
                stroke: "#AAA",
                opacity: 1
            }
        };
        return (
            <ChartContainer
                title={title}
                style={{
                    background: "#201d1e",
                    borderRadius: 8,
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderColor: "#232122"
                }
                }
                timeAxisStyle={darkAxis}
                titleStyle={{
                    color: "#EEE",
                    fontWeight: 500
                }
                }
                padding={20}
                paddingTop={5}
                paddingBottom={0}
                // enableDragZoom
                // onTimeRangeChanged={handleTimeRangeChange}
                timeRange={timerange}
                maxTime={props.connectionsSeries.range().end()}
                minTime={props.connectionsSeries.range().begin()}
            >
                <ChartRow height="300">
                    <YAxis
                        id="axis1"
                        label=""
                        showGrid
                        hideAxisLine
                        transition={300}
                        style={darkAxis}
                        labelOffset={-10}
                        min={0}
                        max={max}
                        format=",.0f"
                        width="60"
                        type="linear"
                    />
                    <Charts>{charts}</Charts>
                    <YAxis
                        id="axis2"
                        label=""
                        hideAxisLine
                        transition={300}
                        style={darkAxis}
                        labelOffset={12}
                        min={0}
                        format=",.0f"
                        max={max}
                        width="80"
                        type="linear"
                    />
                </ChartRow>
            </ChartContainer >
        );
    };

    return (
        <div className="row">
            <div className="col-md-12">
                <Resizable>{renderChart()}</Resizable>
            </div>
        </div >
    );
}
export default InteractiveCharts;
