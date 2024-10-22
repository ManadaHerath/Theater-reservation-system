import React, { useState } from 'react';
import UsersList from '../../components/Admin/Users/UsersList';
import AdminList from '../../components/Admin/Users/AdminList';
import TheaterAdminList from '../../components/Admin/Users/TheaterAdminList';
import SystemManagerList from '../../components/Admin/Users/SystemManagerList';
import AddUser from '../../components/Admin/Users/AddUser';

const AdminUser = () => {
  const [selectedTab, setSelectedTab] = useState('customer');

  // Function to render the content based on the selected tab
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'customer':
        return <UsersList />;
      case 'admin':
        return <AdminList />;
      case 'theaterAdmin':
        return <TheaterAdminList />;
      case 'systemManager':
        return <SystemManagerList />;
      case 'addUser':
        return <AddUser/>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto flex pt-[60px]">
      {/* Navbar: 1/4 width */}
      <div className="w-1/4 h-screen p-4 bg-gray-100">
        <h2 className="mb-4 text-2xl font-bold">Tabs for Components</h2>

        {/* Navigation Tabs (Vertical) */}
        <div className="flex flex-col space-y-4">
          <div
            onClick={() => setSelectedTab('customer')}
            className={`cursor-pointer py-2 px-4 border-l-4 ${selectedTab === 'customer' ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-500'}`}
          >
            Customers
          </div>
          <div
            onClick={() => setSelectedTab('admin')}
            className={`cursor-pointer py-2 px-4 border-l-4 ${selectedTab === 'admin' ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-500'}`}
          >
            Admins
          </div>
          <div
            onClick={() => setSelectedTab('theaterAdmin')}
            className={`cursor-pointer py-2 px-4 border-l-4 ${selectedTab === 'theaterAdmin' ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-500'}`}
          >
            Theater Admins
          </div>
          <div
            onClick={() => setSelectedTab('systemManager')}
            className={`cursor-pointer py-2 px-4 border-l-4 ${selectedTab === 'systemManager' ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-500'}`}
          >
            System Managers
          </div>
          <div
            onClick={() => setSelectedTab('addUser')}
            className={`cursor-pointer py-2 px-4 border-l-4 ${selectedTab === 'addUser' ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-500'}`}
          >
            Add User
          </div>
        </div>
      </div>

      {/* Content: 3/4 width */}
      <div className="w-3/4 p-4 bg-white">
        {/* Render the selected component */}
        {renderTabContent()}
         
      </div>
    </div>
  );
};

export default AdminUser;
