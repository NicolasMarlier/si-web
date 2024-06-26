import { useContext, useEffect, useState } from "react";
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
            position: 'right',
            grid: {
                color: "#00000011"
            },
            ticks: {
                color: "#999"
            }
        }
    }
  };
  

const StatsPage = () => {
    const { invaders, cities, syncInvadersFromOfficialApi } = useContext(AppContext)

    const [cumulative, setCumulative] = useState(false)
    const [tab, setTab] = useState('count' as 'count' | 'score')
    
    const score = _.sum(_.map(invaders, "point")) + _.keys(_.groupBy(invaders, "city_id")).length * 100
    const totalFlashedCount = invaders.length


    const buildData = () => {
        const groups = _.groupBy(invaders, i => moment(i.date_flash).format("YYYY-MM"))
        const city_groups = _.groupBy(cities, c => moment(c.first_flash_at).format("YYYY-MM"))
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
        let scores = _.map(labels, (label) => _.sum(_.map(groups[label.format("YYYY-MM")] || [], 'point')) + (city_groups[label.format("YYYY-MM")] || []).length * 100)
        for(let i = 1; i < counts.length; i++) {
            if(cumulative) {
                counts[i] = counts[i] + counts[i-1]
                scores[i] = scores[i] + scores[i-1]
            }
        }

        return {
            labels,
            datasets: {
                count: [{
                    data: counts,
                    backgroundColor: "#00acff"
                }],
                score: [{
                    data: scores,
                    backgroundColor: "#2bcc23"
                }]
            }[tab],
            options: chartOptions
        }
    }

    function format(number: number) {
        return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
    }
    
    const [chartData, setChartData] = useState(buildData())

    useEffect(() => {
        setChartData(buildData())
    }, [cumulative, tab])

    const toggleTab = () => {
        if(tab === 'count') {
            setTab('score')
        }
        else {
            setTab('count')
        }
    }

    
    return <div className="stats-page">
        <Menu>
            <div className="btn" onClick={() => setCumulative(!cumulative)}>
                <div className={`icon ${cumulative ? 'chart-column' : 'chart-line'}`}/>
                <div className="desktop-label">{ cumulative ? "Voir par mois" : "Voir l'évolution"}</div>
            </div>
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
            <div className={`today ${tab}-active`} onClick={toggleTab}>
                <div className="score">
                    <span className="value">{ format(score) }</span>
                    <span className="label">points</span>
                </div>
                <div className="count">
                    <span className="value">{ format(totalFlashedCount) }</span>
                    <span className="label">flashés</span>
                </div>
            </div>
    </div>
}

export default StatsPage