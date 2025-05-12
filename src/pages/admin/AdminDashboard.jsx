import { useState, useEffect } from 'react';
import { useAssets } from '../../context/AssetContext';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { Package, Users, Clipboard, Settings, AlertTriangle, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { assets, employees, categories, requests, complaints } = useAssets();
  const [lowStockAssets, setLowStockAssets] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Find assets with low stock
    setLowStockAssets(assets.filter(asset => asset.quantity < 5));
  }, [assets]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <Button 
          onClick={() => navigate('/admin/assets')}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Asset
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Assets"
          value={assets.length}
          icon={Package}
          variant="blue"
          onClick={() => navigate('/admin/assets')}
        />
        <StatCard
          title="Total Employees"
          value={employees.length}
          icon={Users}
          variant="green"
        />
        <StatCard
          title="Categories"
          value={categories.length}
          icon={Clipboard}
          variant="purple"
          onClick={() => navigate('/admin/categories')}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockAssets.length}
          icon={AlertTriangle}
          variant="red"
          trend="up"
          trendValue="12"
        />
      </div>

      {/* Assets by Category */}
      <Card title="Assets by Category">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((category) => {
            const categoryAssets = assets.filter(asset => asset.category === category.name);
            const availableCount = categoryAssets.filter(asset => asset.status === 'available').length;
            const assignedCount = categoryAssets.filter(asset => asset.status === 'assigned').length;
            
            return (
              <div key={category.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                
                <div className="mt-3 flex justify-between">
                  <div>
                    <Badge variant="success">{availableCount} Available</Badge>
                  </div>
                  <div>
                    <Badge variant="primary">{assignedCount} Assigned</Badge>
                  </div>
                </div>
                
                <div className="mt-3 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(categoryAssets.length / assets.length) * 100}%` }}
                  ></div>
                </div>
                
                <p className="mt-2 text-xs text-gray-500">
                  {categoryAssets.length} assets ({Math.round((categoryAssets.length / assets.length) * 100)}% of total)
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Asset Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <Card title="Recent Asset Requests">
          {requests.slice(0, 5).map((request) => (
            <div 
              key={request.id} 
              className="border-b last:border-b-0 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{request.userName}</p>
                  <p className="text-sm text-gray-500">{request.assetType}</p>
                </div>
                <Badge
                  variant={
                    request.status === 'pending' ? 'warning' :
                    request.status === 'approved' ? 'success' : 'danger'
                  }
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-gray-600 line-clamp-1">{request.reason}</p>
              <p className="mt-1 text-xs text-gray-500">
                {new Date(request.date).toLocaleDateString()}
              </p>
            </div>
          ))}
          
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center text-blue-600"
            >
              View All Requests
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* Recent Complaints */}
        <Card title="Recent Complaints">
          {complaints.slice(0, 5).map((complaint) => (
            <div 
              key={complaint.id} 
              className="border-b last:border-b-0 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{complaint.userName}</p>
                  <p className="text-sm text-gray-500">{complaint.assetName}</p>
                </div>
                <Badge
                  variant={
                    complaint.status === 'open' ? 'warning' :
                    complaint.status === 'in progress' ? 'primary' : 'success'
                  }
                >
                  {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-gray-600 line-clamp-1">{complaint.description}</p>
              <p className="mt-1 text-xs text-gray-500">
                {new Date(complaint.date).toLocaleDateString()}
              </p>
            </div>
          ))}
          
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center text-blue-600"
            >
              View All Complaints
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Low Stock */}
      <Card title="Low Stock Assets">
        <div className="space-y-4">
          {lowStockAssets.length > 0 ? (
            lowStockAssets.map((asset) => (
              <div 
                key={asset.id} 
                className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100"
              >
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded overflow-hidden mr-4">
                    <img
                      src={asset.image}
                      alt={asset.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{asset.name}</h4>
                    <p className="text-xs text-gray-500">{asset.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">{asset.quantity} left</p>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="mt-1"
                    onClick={() => navigate('/admin/assets')}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Inventory
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <div className="mx-auto h-12 w-12 text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-3 text-sm font-medium text-gray-900">All Good!</h3>
              <p className="mt-1 text-sm text-gray-500">No assets are running low on inventory.</p>
            </div>
          )}
        </div>
      </Card>

      {/* System Settings */}
      <Card title="System Settings">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 flex flex-col items-center text-center hover:bg-gray-50 cursor-pointer">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900">General Settings</h3>
            <p className="text-sm text-gray-500 mt-1">System configuration and preferences</p>
          </div>
          
          <div className="border rounded-lg p-4 flex flex-col items-center text-center hover:bg-gray-50 cursor-pointer">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900">User Management</h3>
            <p className="text-sm text-gray-500 mt-1">Manage users and permissions</p>
          </div>
          
          <div className="border rounded-lg p-4 flex flex-col items-center text-center hover:bg-gray-50 cursor-pointer">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900">Reports</h3>
            <p className="text-sm text-gray-500 mt-1">Generate system reports</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;