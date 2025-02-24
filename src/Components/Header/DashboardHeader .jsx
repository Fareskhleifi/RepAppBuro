import { BellIcon, InformationCircleIcon, MoonIcon, SunIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Dropdown from '../Dropdown/Dropdown'; 
import { BsArrowBarUp } from 'react-icons/bs';


// eslint-disable-next-line react/prop-types
const DashboardHeader = ({ onToggleDarkMode, isDarkMode,pageTitle  }) => {
  return (
    <div className={`fixed top-0 ml-4 border-none rounded-2xl left-64 mt-4 right-0 z-10 flex justify-between items-center p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-[#f4f7fe] bg-opacity-70 backdrop-blur-md'}`}>
      {/* Left Section: Breadcrumbs and Title */}
      <div className="text-sm">
        <p className={`text-gray-500 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>Pages / {pageTitle}</p>
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{pageTitle}</h1>
      </div>

      {/* Right Section: Search, Icons, and Profile */}
      <div className="flex items-center bg-white dark:bg-gray-400 rounded-full p-2 space-x-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className={`pl-10 pr-4 py-2 ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-[#f4f7fe] text-gray-700'} border border-gray-50 rounded-full focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
          />
          <MagnifyingGlassIcon className="absolute left-3.5 top-3 w-4 h-5 text-gray-400" />
        </div>

        {/* Icons */}
        <div className="flex items-center  space-x-4">
          {/* Notification Dropdown */}
          <Dropdown
      button={
        <BellIcon className={`w-6 h-6 ${isDarkMode ? 'text-gray-50' : 'text-gray-500'} hover:text-indigo-600 transition cursor-pointer`} />
      }
      animation="origin-[65%_0%] md:origin-top-right transition-all duration-300 ease-in-out"
      classNames="py-2 top-4 -left-[230px] md:-left-[440px] w-max"
    >
      <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl shadow-shadow-500 dark:!bg-navy-700 dark:text-white dark:shadow-none sm:w-[460px]">
        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-navy-700 dark:text-white">Notifications</p>
          <p className="text-sm font-bold text-navy-700 dark:text-white cursor-pointer">Mark all read</p>
        </div>

        {/* Sample Notification Items */}
        {[
          {
            title: "New Update: Horizon UI Dashboard PRO",
            description: "A new update for your downloaded item is available!",
            timestamp: "2 minutes ago",
          },
          {
            title: "System Maintenance Scheduled",
            description: "The system will be down for maintenance at 3 AM.",
            timestamp: "10 minutes ago",
          },
          {
            title: "New Message from Support",
            description: "You have received a new message from customer support.",
            timestamp: "30 minutes ago",
          },
          {
            title: "Weekly Report Generated",
            description: "Your weekly report has been generated and is ready to download.",
            timestamp: "1 hour ago",
          },
        ].map((notification, index) => (
          <button key={index} className="flex w-full items-center border-b border-gray-200 pb-2 mb-2">
            <div className="flex h-full w-[85px] items-center justify-center rounded-xl bg-gradient-to-b from-brandLinear to-brand-500 py-4 text-2xl text-white">
              <BsArrowBarUp />
            </div>
            <div className="ml-2 flex h-full w-full flex-col justify-center rounded-lg px-1 text-sm">
              <p className="mb-1 text-left text-base font-bold text-gray-900 dark:text-white">{notification.title}</p>
              <p className="font-base text-left text-xs text-gray-900 dark:text-white">{notification.description}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{notification.timestamp}</p>
            </div>
          </button>
        ))}
      </div>
    </Dropdown>

          <InformationCircleIcon className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} hover:text-indigo-600 transition cursor-pointer`} />
          <button onClick={onToggleDarkMode} className="w-6 h-6 text-gray-500 hover:text-indigo-600 transition cursor-pointer">
            {isDarkMode ? <SunIcon className="w-6 h-6 text-yellow-500" /> : <MoonIcon className="w-6 h-6 text-gray-500" />}
          </button>

          {/* Profile Image */}
          <div className="w-10 h-10 rounded-full bg-blue-300 overflow-hidden">
            {/* <img src="/src/assets/acceuil-image.jpg" alt="Profile" className="object-cover w-full h-full" /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
