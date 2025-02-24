import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '17', uv: 4000 },
  { name: '18', uv: 3000 },
  { name: '19', uv: 2000 },
  { name: '20', uv: 2780 },
  { name: '21', uv: 1890 },
  { name: '22', uv: 2390 },
];
const CustomBarChart = () => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="uv" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default CustomBarChart;
