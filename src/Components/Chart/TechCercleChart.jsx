import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

export default function TechCercleChart() {
  const doughnutData = {
    labels: ['RAM 8GB', 'SSD 512GB', 'NVIDIA RTX 3060', 'Intel i7 CPU', 'Motherboard ATX'],
    datasets: [
      {
        label: 'Temps de réparation (heures)',
        data: [1, 1.5, 3, 2, 2.5], // Durée en heures pour chaque pièce
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <div className="bg-white max-h-96 dark:bg-gray-800 p-6 flex flex-col rounded-lg shadow-md">
        <h2 className="text-lg text-left font-bold mb-4">Temps de réparation estimé pour chaque pièce</h2>
        <div className="flex-1 flex items-center justify-center">
          <div style={{ width: '310px', height: '310px' }}>
            <Doughnut 
              data={doughnutData} 
              options={{ 
                responsive: true, 
                plugins: { legend: { position: 'bottom' } } 
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
