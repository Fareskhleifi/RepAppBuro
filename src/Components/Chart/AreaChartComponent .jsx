
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", cost: 400, profit: 240 },
  { month: "Feb", cost: 300, profit: 220 },
  { month: "Mar", cost: 200, profit: 170 },
  { month: "Apr", cost: 278, profit: 200 },
];

const AreaChartComponent = () => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="cost" stackId="1" stroke="#8884d8" fill="#8884d8" />
          <Area type="monotone" dataKey="profit" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartComponent;
