import React from "react";
import _ from "underscore";
import moment from "moment";

import { TimeSeries } from "pondjs";


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

class InteractiveCharts extends React.Component {

    console.log('ddd');

    state = {
        max: 6000,
        active: {
            requests: true,
            connections: true
        },
        timerange: this.props.connectionsSeries.range()
    };

    constructor(props) {
        super(props);
        this.handleRescale = _.debounce(this.rescale, 300);
        console.log('props: ', props)
    }

    rescale(timerange, active = this.state.active) {
        let max = 100;
        const maxConnections = this.props.connectionsSeries.crop(this.state.timerange).max("connections");
        if (maxConnections > max && active.connections) max = maxConnections;
        this.setState({ max });
    }

    handleTimeRangeChange = timerange => {
        this.setState({ timerange });
        this.handleRescale(timerange);
    };

    handleActiveChange = key => {
        const active = this.state.active;
        active[key] = !active[key];
        this.setState({ active });
        this.handleRescale(this.state.timerange, active);
    };

    renderChart = () => {
        let charts = [];
        let max = 1000;

        if (this.state.active.connections) {
            const maxConnections = this.props.connectionsSeries.crop(this.state.timerange).max("connections");
            if (maxConnections > max) max = maxConnections;
            charts.push(
                <LineChart
                    key="connections"
                    axis="axis2"
                    series={this.props.connectionsSeries}
                    columns={["connections"]}
                    style={style}
                    interpolation="curveBasis"
                />
            );
        }

        /* const axisStyle = {
            values: {
                labelColor: "grey",
                labelWeight: 100,
                labelSize: 11
            },
            axis: {
                axisColor: "grey",
                axisWidth: 1
            }
        }; */

        const darkAxis = {
            label: {
                stroke: "none",
                fill: "#AAA", // Default label color
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
                title="TSLA SHARE PRICE on 2022-12-23"
                style={{
                    background: "#201d1e",
                    borderRadius: 8,
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderColor: "#232122"
                }}
                timeAxisStyle={darkAxis}
                titleStyle={{
                    color: "#EEE",
                    fontWeight: 500
                }}
                padding={20}
                paddingTop={5}
                paddingBottom={0}
                enableDragZoom
                onTimeRangeChanged={this.handleTimeRangeChange}
                timeRange={this.state.timerange}
                maxTime={this.props.connectionsSeries.range().end()}
                minTime={this.props.connectionsSeries.range().begin()}
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
                        max={this.state.max}
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
                        max={this.state.max}
                        width="80"
                        type="linear"
                    />
                </ChartRow>
            </ChartContainer>
        );
    };

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <Resizable>{this.renderChart()}</Resizable>
                </div>
            </div >
        );
    }
}

// Export example
export default InteractiveCharts;
