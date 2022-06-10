import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
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
        text: 'Evolution du nombre de patients suivis',
      },
    },

  };
  
   //const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
//const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
// const labelsdatas = [
//     {
//         date: 'Janvier 2021',
//         value: 10
//     },
//     {
//         date: 'Février 2021',
//         value: 10
//     },
//     {
//         date: 'Mars 2021',
//         value: 12
//     },
// ];



//   export const data = {
      
//     //labels: labelsdatas.map(labeldata => labeldata.date),
//     labels: loadedData.map(data => data.date),
//     datasets: [
//       {
//         label: '',
//         // data: labelsdatas.map(labeldata => labeldata.value),
//         data: loadedData.map(data => data.value),
//         //borderColor: 'rgb(255, 99, 132)',
//         backgroundColor: 'rgba(255, 99, 132, 0.5)',
//       },
//     //   {
//     //     label: 'Dataset 2',
//     //     data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
//     //     borderColor: 'rgb(53, 162, 235)',
//     //     backgroundColor: 'rgba(53, 162, 235, 0.5)',
//     //   },
//     ],
//   };
  


  export function MyIndicators() {
    const [loadedData, setLoadedData] = useState<{date: string, value: number}[]>([])
       useEffect(() => {
        const fetchPatients = async () => {
          try {
            const responseData = await fetch(
              `http://localhost:5000/api/patients/indicators`
            );
            const response = await responseData.json();
            console.log(response)
            setLoadedData(response.patientsIndicators);
            // setLoadedPatients(response.patients);  
          } catch (err) {}
        };
        fetchPatients();
    }, []);

    const data = {
        labels: loadedData.map(data => data.date),
        datasets: [
          {
            label: 'Nombre de patients',
            data: loadedData.map(data => data.value),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      };

    return <Bar options={options} data={data} />;
  }
  