import { useContext, useState } from "react";
import Menu from "../Menu"
import {Chart, CategoryScale, LinearScale, TimeScale, LineElement, PointElement, BarElement, Title, Tooltip, Legend, TimeSeriesScale} from 'chart.js'; 
import 'chartjs-adapter-moment';
import { Bar } from "react-chartjs-2";
import { AppContext } from "../AppProvider";
import moment from "moment";
import _ from "lodash";
import './StatsPage.scss'

Chart.register(
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    TimeScale,
    TimeSeriesScale
);

    
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
    },
    layout: {
        padding: 50,
        
    },
    scales: {
        x: {
            type: 'timeseries',
            grid: {
                display: false
            },
            time: {
                minUnit: 'month',
                round: 'month'
            },
            ticks: {
                source: 'auto',
                stepSize: 100,
                color: "#999"
            }
        },
        y: {
            grid: {
                color: "#00000011"
            },
            ticks: {
                stepSize: 100,
                color: "#999"
            }
        }
    }
  };
  

const StatsPage = () => {
    const { invaders, syncInvadersFromOfficialApi } = useContext(AppContext)
    
    const score = _.sum(_.map(invaders, "point")) + _.keys(_.groupBy(invaders, "city_id")).length * 100
    const totalFlashedCount = invaders.length


    const buildData = () => {
        const groups = _.groupBy(invaders, i => moment(i.date_flash).format("YYYY-MM"))
        const flash_dates = _.sortBy(_.map(invaders, i => moment(i.date_flash)))
        const max_flash_date = _.max(flash_dates)
        const min_flash_date = _.min(flash_dates)
        if(max_flash_date === undefined || min_flash_date === undefined) {
            throw 'No dates!'
        }
        let labels = [
            min_flash_date.startOf('month')
        ]
        while(labels[labels.length - 1].isBefore(max_flash_date.startOf('month'))) {
            labels.push(labels[labels.length - 1].clone().add(1, 'months'))
        }

        let counts = _.map(labels, (label) => (groups[label.format("YYYY-MM")] || []).length)
        for(let i = 1; i < counts.length; i++) {
            counts[i] = counts[i] + counts[i-1]
        }
        return {
            labels,
            datasets: [
                {
                    data: counts,
                    backgroundColor: "#ffcc00cc"
                }
            ],
            options: chartOptions
        }
    }

    const format = (number: number): string => {
        if(number >= 1000) {
            return `${format(Math.floor(number / 1000))} ${number % 1000}`
        }
        return `${number}`
    }

    const [chartData, setChartData] = useState(buildData())

    
    return <div className="stats-page">
        <Menu>
            <div className="btn" onClick={syncInvadersFromOfficialApi}>
                <div className="icon sync"/>
                <div className="desktop-label">Synchroniser</div>
            </div>
        </Menu>
        
        <div className="graph-container">
            <Bar
                data={chartData}
                options={chartOptions as any}/>
        </div>
        <div className="counts">
            <div>
                <span className="count">{ format(totalFlashedCount) }</span>
                <span className="label">flashés</span>
            </div>
            <div>
                <span className="count">{ format(score) }</span>
                <span className="label">points</span>
            </div>
        </div>
    </div>
}

export default StatsPage