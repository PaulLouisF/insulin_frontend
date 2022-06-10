import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart',
      },
    },
    // scales: {
    //     x: {
    //       type: 'time',
    //       time: {
    //         // Luxon format string
    //         tooltipFormat: 'DD T'
    //       },
    //       title: {
    //         display: true,
    //         text: 'Date'
    //       }
    //     },
    //     y: {
    //         title: {
    //           display: true,
    //           text: 'value'
    //         }
    //       }
    //     }
  };
  
//   const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  export const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        // data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
        data: [10, 20, 30, 40],
        // data: [{
        //     x: '2021-11-06 23:39:30',
        //     y: 3
        //   }],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    //   {
    //     label: 'Dataset 2',
    //     data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
    //     borderColor: 'rgb(53, 162, 235)',
    //     backgroundColor: 'rgba(53, 162, 235, 0.5)',
    //   },
    ],
  };
  
  export function MyChart() {
    return <Line options={options} data={data} />;
  }
  