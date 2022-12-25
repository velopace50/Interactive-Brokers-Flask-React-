import React, { useEffect, useState } from "react"
import { io } from "socket.io-client"

import Header from "./pages/header/Header"
import InteractiveCharts from "./pages/chart/InteractiveCharts"
import _ from "underscore";
import moment from "moment";
import { TimeSeries } from "pondjs";

const ddosData = require("./pages/chart/data.json");
const connections1 = [];
_.each(ddosData, val => {
    const timestamp = moment(new Date(`2022-12-23T${val["time PST"]}`));
    const numConnection = val["price"];
    connections1.push([timestamp.toDate().getTime(), numConnection]);
});

const connectionsSeries1 = new TimeSeries({
    name: "connections",
    columns: ["time", "connections"],
    points: connections1
});

const App = () => {
    const [data, setData] = useState([]);
    const [connectionsSeries, setConnectionSeries] = useState(null);
    const [dateInfo, setDetaInfo] = useState([])
    const getData = (_data) => {
        setData((prev) => ([...prev, _data]));
    }
    useEffect(() => {
        const connections = [];
        _.each(data, val => {

            const timestamp = moment(new Date(val['date']));
            const numConnection = val["value"];
            connections.push([timestamp.toDate().getTime(), numConnection]);

        });
        setDetaInfo(connections);

        setConnectionSeries(new TimeSeries({
            name: "connections",
            columns: ["time", "connections"],
            points: connections
        }))
    }, [data]);
    useEffect(() => {
        const socket = io("localhost:5000/", {
            cors: {
                origin: "http://localhost:3000/",
            },
        });

        socket.on("updateSensorData", getData);
    }, []);
    return (<div>
        <Header />
        <div className="chart-content">
            {data.length > 1 && <InteractiveCharts connectionsSeries={connectionsSeries} dateInfo={dateInfo} />}
        </div>
    </div>)
}
export default App;