import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Sep', uv: 4000 },
  { name: 'Oct', uv: 3000 },
  { name: 'Nov', uv: 2000 },
  { name: 'Dec', uv: 2780 },
  { name: 'Jan', uv: 1890 },
  { name: 'Feb', uv: 2390 },
];
const CustomLineChart = () => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="uv" stroke="#8884d8" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default CustomLineChart;
