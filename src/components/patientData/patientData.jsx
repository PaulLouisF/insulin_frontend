import React from 'react';
import 'chartjs-adapter-date-fns';
import { enGB, fr } from 'date-fns/locale'
import {
  Chart as ChartJS,
  TimeScale,
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
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  export const options = {
    responsive: true,
    // plugins: {
    //   // legend: {
    //   //   position: 'top' as const,
    //   // },
    //   title: {
    //     display: true,
    //     text: 'Chart.js Line Chart',
    //   },
    // },
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
 
        x: {
          type: 'time',
          time: {
            //parser: 'yyyy-MM-dd',
            unit: 'month',
          },
       
          // time: {
          //     parser: 'yyyy-MM-dd',
          //     unit: 'day',
             
          //   },
          // adapters: {
          //   date: {locale: enGB},
          //   //type: 'time',
          //   // // time: {
          //   // //   tooltipFormat: 'DD T',
          //   // // },
          //   distribution: "series",
          //   time: {
          //     parser: 'yyyy-MM-dd',
          //     unit: 'year',
          //   },
          // },
             
          // }, 
          title: {
            display: true,
            text: 'Date'
          },
           
            
                
        },
        y: {
            title: {
              display: true,
              text: 'Taille (cm)',
            },
            position: 'left',
            min: 0
        },
        y1: {
          title: {
            display: true,
            text: 'Poids (kg)',
          },
          position: 'right',
          min: 0
      }
        }



  };
  
  //const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
//const labels = ['2021-11-07 00:00:00', '2021-12-07 00:00:00', '2022-03-07 00:00:00', '2022-05-07 00:00:00'];

  // export const data = {
  //   //labels,
  //   datasets: [
  //     {
  //       label: 'Dataset 1',
  //       // data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
  //       // data: [10, 50, 30, 40],
  //       data: [
  //         {
  //          x: new Date('2020-8-13'),
    
  //         y: 40
  //     }, {
  //         x: new Date('2021-8-13'),
  //         y: 60
  //     }, 
  //     {
  //         x: new Date('2024-3-10'),
  //         y: 20
  //     }
  //   ],
  //       // data: [{
  //       //     x: '2021-11-06 23:39:30',
  //       //     y: 3
  //       //   }],
  //       borderColor: 'rgb(255, 99, 132)',
  //       backgroundColor: 'rgba(255, 99, 132, 0.5)',
  //     },
  //   //   {
  //   //     label: 'Dataset 2',
  //   //     data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
  //   //     borderColor: 'rgb(53, 162, 235)',
  //   //     backgroundColor: 'rgba(53, 162, 235, 0.5)',
  //   //   },
  //   ],
  // };
  
  // export function MyChart() {



  const MyChart = (props) => {

    const data = {
      //labels,
      datasets: [
        {
          label: 'Taille',
          data: props.patient.Consultations.map((consultation) => {
            return {
              
              x: new Date(consultation.created_at),
              y: consultation.height,
            }
          }),
          yAxisID: 'y',
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Poids',
          data: props.patient.Consultations.map((consultation) => {
            return {
              
              x: new Date(consultation.created_at),
              y: consultation.weight,
            }
          }),
          yAxisID: 'y1',
          borderColor: 'rgb(75, 50, 192)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };


    return <Line options={options} data={data} />;
  }

  export default MyChart
  