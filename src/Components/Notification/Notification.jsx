import { useState } from "react";
import { format } from "date-fns"; // Ensure date-fns is installed
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import the styles for react-toastify

const Notification = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: 'Your profile has been updated successfully.',
      timestamp: new Date(),
      sender: 'Director',
      type: 'Info',
    },
    {
      id: 2,
      message: 'New book added: "The Great Gatsby".',
      timestamp: new Date(),
      sender: 'Technician',
      type: 'Info',
    },
    {
      id: 3,
      message: 'Reminder: A client is arriving soon.',
      timestamp: new Date(),
      sender: 'Technician',
      type: 'Reminder',
    },
  ]);

  const [newNotification, setNewNotification] = useState('');
  const [senderType, setSenderType] = useState('Technician');
  const [type, setType] = useState('Info'); // Notification type
  const [filter, setFilter] = useState('All'); // Filter state

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const sendNotification = () => {
    if (newNotification.trim()) {
      const newNotificationObject = {
        id: notifications.length + 1,
        message: newNotification,
        timestamp: new Date(),
        sender: senderType,
        type: type,
      };
      setNotifications([...notifications, newNotificationObject]);
      setNewNotification(''); // Clear input after sending
      toast.success("Notification sent!",{
        autoClose: 1500, 
      }
      ); 
    }
  };

  // Filter notifications based on sender type
  const filteredNotifications = notifications.filter(notification => 
    filter === 'All' || notification.sender === filter
  );

  return (
    <div className="ml-64 pt-24 p-6 mt-6 space-y-6 bg-[#f4f7fe] dark:bg-gray-900 h-full">

      {/* Send Notification Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Send a Notification</h2>
        
        <select 
          value={senderType} 
          onChange={(e) => setSenderType(e.target.value)} 
          className="border border-gray-300 rounded-md p-2 mb-4 w-full"
        >
          <option value="Technician">Technician</option>
          <option value="Director">Director</option>
        </select>
        
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)} 
          className="border border-gray-300 rounded-md p-2 mb-4 w-full"
        >
          <option value="Info">Info</option>
          <option value="Warning">Warning</option>
          <option value="Reminder">Reminder</option>
        </select>

        <textarea
          rows="3"
          value={newNotification}
          onChange={(e) => setNewNotification(e.target.value)}
          placeholder="Type your notification here..."
          className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring focus:ring-blue-500"
        />
        
        <button
          onClick={sendNotification}
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Send Notification
        </button>
      </div>

      {/* Notifications List Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-gray-50">
          <label className="text-gray-700">Filter by Sender:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)} 
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="All">All</option>
            <option value="Technician">Technician</option>
            <option value="Director">Director</option>
          </select>
        </div>
        {filteredNotifications.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No notifications to display.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredNotifications.map(notification => (
              <li key={notification.id} className="flex justify-between items-center p-4 hover:bg-gray-100">
                <div>
                  <p className={`text-gray-800 font-semibold ${notification.type === 'Warning' ? 'text-red-600' : ''}`}>
                    {notification.message}
                  </p>
                  <p className="text-sm text-gray-500">{format(notification.timestamp, 'yyyy-MM-dd HH:mm:ss')}</p>
                  <p className="text-xs text-gray-400">From: {notification.sender} | Type: {notification.type}</p>
                </div>
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="text-red-500 hover:text-red-700 transition duration-200"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  );
};

export default Notification;
