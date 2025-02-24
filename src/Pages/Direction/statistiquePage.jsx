import DefaultLayout from "../../layouts/DefaultLayout";
import TechBarChart from "../../Components/Chart/TechBarChart";
import AreaChartComponent from "../../Components/Chart/AreaChartComponent ";
import ProfitChart from "../../Components/Chart/ProfitChart ";
import CustomLineChart from "../../Components/Chart/LineChart ";
import CustomBarChart from "../../Components/Chart/BarChart";
import DonutChart from "../../Components/Chart/DonutChart";
import TechCercleChart from "../../Components/Chart/TechCercleChart";
export default function StatistiquePage() {
  return (
    <DefaultLayout>
    <div className="ml-64 pt-24 p-6 mt-6 space-y-6 bg-[#f4f7fe] dark:bg-gray-900 h-full">

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TechBarChart></TechBarChart>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="text-lg font-semibold mb-12">Weekly Revenue</div>
            <AreaChartComponent></AreaChartComponent>
        </div>
      </div>

      <ProfitChart></ProfitChart>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800  rounded-lg shadow-md">
          <TechCercleChart />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="text-lg font-semibold mb-4">Weekly Revenue</div>
          <DonutChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="text-lg font-semibold mb-4">This Month</div>
          <CustomLineChart />
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="text-lg font-semibold mb-4">Weekly Revenue</div>
          <CustomBarChart />
        </div>
      </div>

    </div>
    
  </DefaultLayout>
  )
}
