import React, { useEffect, useContext, useState, Fragment } from 'react';

import AuthContext from '../store/auth-context';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid, regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import classes from './Indicators.module.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  );


  //Options for BarChart
  // export const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: 'top' as const,
  //     },
  //     title: {
  //       display: true,
  //       text: 'Evolution du nombre de patients suivis',
  //     },
  //   },
  // };

  //Options for LineChart
  export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Evolution du nombre de patients suivis',
      },
    },
    scales: {
      // x: {
      //   type: 'time',
      //   time: {
      //     // Luxon format string
      //     // tooltipFormat: 'DD T'
      //     unit: 'month'
      //   },
      //   // title: {
      //   //   display: true,
      //   //   text: 'Date'
      //   // }
      // },
      y: {
          title: {
            display: true,
            text: 'Nombre de patients',
          },
          beginAtZero: true,
  
        
      },

      }
  };
    


function MyIndicators() {
    const [loadedData, setLoadedData] = useState<{date: string, valueM: number, valueW: number}[]>([]);
    const [averageAge, setAverageAge] = useState<number>(0)
    const authCtx = useContext(AuthContext);
    
    useEffect(() => {
      const fetchPatients = async () => {
        try {
          const responseData = await fetch(process.env.REACT_APP_BACKEND_URL + `/patients/indicators`, {
            headers: {
              Authorization: 'Bearer ' + authCtx.token
            } 
          }
          );
          const response = await responseData.json();
          console.log(response)
          setLoadedData(response.patientsIndicators);
          setAverageAge(response.averageAge)
        } catch (err) {}
      };
      fetchPatients();
  }, []);

    // const data = {
    //     labels: loadedData.map(data => data.date),
    //     datasets: [
    //       {
    //         label: 'Femmes',
    //         data: loadedData.map(data => data.valueW),
    //         backgroundColor: 'rgba(255, 99, 132, 0.5)',
    //       },
    //       {
    //         label: 'Hommes',
    //         data: loadedData.map(data => data.valueM),
    //         backgroundColor: 'blue',
    //       },
    //     ],
    //   };

    const data = {
      labels: loadedData.map(data => data.date),
      datasets: [
        {
          label: 'Femmes',
          data: loadedData.map(data => data.valueW),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 0.5)'
        },
        {
          label: 'Hommes',
          data: loadedData.map(data => data.valueM),
          backgroundColor: 'blue',
          borderColor: 'blue',
        },

      ],
    };

    return (
      <Fragment>
        <div className={classes.indicators_summary}>
          <h2>
            Nombre de patients suivis: {loadedData.length > 0? loadedData.slice(-1)[0].valueW + loadedData.slice(-1)[0].valueM: 0} 
             (
              {loadedData.length > 0? loadedData.slice(-1)[0].valueW: 0} <FontAwesomeIcon icon={solid('venus')} />
              /
              {loadedData.length > 0? loadedData.slice(-1)[0].valueM: 0} <FontAwesomeIcon icon={solid('mars')} />
            )
          </h2>
          {/* <h2><FontAwesomeIcon icon={solid('venus')} /> {loadedData.length > 0? loadedData.slice(-1)[0].valueW: 0}</h2>
          <h2><FontAwesomeIcon icon={solid('mars')} /> {loadedData.length > 0? loadedData.slice(-1)[0].valueM: 0}</h2> */}
          <h2>Age moyen: {averageAge} ans</h2>

        </div>
        
        {/* <Bar options={options} data={data} /> */}
        <Line options={options} data={data} />
      </Fragment>)
    ;
  }

  export default MyIndicators;
  