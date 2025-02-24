import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function TechBarChart() {

    const monthlyData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Nombre de Tâches',
            data: [12, 19, 3, 5, 2, 3, 7, 8, 10, 15, 20, 25], // Replace with your actual data
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      };

      
  return (
        <div className="bg-white max-h-[389px] dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg text-left font-bold mb-4">Nombre de Tâches par Mois</h2>
          <div className='flex items-center justify-center'>
            <Bar
              data={monthlyData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Tâches Mensuelles',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
  )
}
