import { useState, useEffect } from 'react';
import { useAssets } from '../../context/AssetContext';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { 
  Users, 
  Package, 
  ClipboardList, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const { 
    assets, 
    employees, 
    requests, 
    complaints,
    updateRequestStatus
  } = useAssets();
  const navigate = useNavigate();
  
  // Count assets by status
  const totalAssets = assets.length;
  const assignedAssets = assets.filter(asset => asset.status === 'assigned').length;
  const availableAssets = assets.filter(asset => asset.status === 'available').length;
  
  // Get pending asset requests
  const pendingRequests = requests.filter(request => request.status === 'pending');
  
  // Get open complaints
  const openComplaints = complaints.filter(
    complaint => complaint.status === 'open' || complaint.status === 'in progress'
  );
  
  // Assets that are low in quantity (less than 5)
  const lowStockAssets = assets.filter(asset => asset.quantity < 5);

  // Handle request approval
  const handleRequestAction = (requestId, status) => {
    updateRequestStatus(requestId, status);
  };

  const pendingRequestColumns = [
    { 
      key: 'userName', 
      header: 'Employee', 
      sortable: true,
      render: (row) => (
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2 text-gray-400" />
          <span>{row.userName}</span>
        </div>
      )
    },
    { 
      key: 'assetType', 
      header: 'Asset Type', 
      sortable: true
    },
    { 
      key: 'date', 
      header: 'Requested', 
      sortable: true,
      render: (row) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
          <span>{new Date(row.date).toLocaleDateString()}</span>
        </div>
      )
    },
    { 
      key: 'actions', 
      header: 'Actions', 
      sortable: false,
      render: (row) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            className="text-green-600 border-green-600 hover:bg-green-50"
            onClick={() => handleRequestAction(row.id, 'approved')}
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-600 border-red-600 hover:bg-red-50"
            onClick={() => handleRequestAction(row.id, 'rejected')}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  ];

  const complaintColumns = [
    { 
      key: 'userName', 
      header: 'Employee', 
      sortable: true,
    },
    { 
      key: 'assetName', 
      header: 'Asset', 
      sortable: true
    },
    { 
      key: 'status', 
      header: 'Status', 
      sortable: true,
      render: (row) => (
        <Badge 
          variant={row.status === 'open' ? 'warning' : 'primary'}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      )
    },
    { 
      key: 'date', 
      header: 'Reported', 
      sortable: true,
      render: (row) => new Date(row.date).toLocaleDateString()
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Assets"
          value={totalAssets}
          icon={Package}
          variant="blue"
          onClick={() => navigate('/manager/assets')}
        />
        <StatCard
          title="Total Employees"
          value={employees.length}
          icon={Users}
          variant="green"
          onClick={() => navigate('/manager/employees')}
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests.length}
          icon={ClipboardList}
          variant="amber"
        />
        <StatCard
          title="Open Complaints"
          value={openComplaints.length}
          icon={MessageSquare}
          variant="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Asset Requests */}
        <Card title="Pending Asset Requests">
          {pendingRequests.length > 0 ? (
            <Table 
              columns={pendingRequestColumns}
              data={pendingRequests}
            />
          ) : (
            <div className="text-center py-6">
              <CheckCircle className="h-12 w-12 mx-auto text-green-300 mb-4" />
              <p className="text-gray-500">No pending requests.</p>
            </div>
          )}
        </Card>

        {/* Recent Complaints */}
        <Card title="Recent Complaints">
          {openComplaints.length > 0 ? (
            <Table 
              columns={complaintColumns}
              data={openComplaints}
            />
          ) : (
            <div className="text-center py-6">
              <CheckCircle className="h-12 w-12 mx-auto text-green-300 mb-4" />
              <p className="text-gray-500">No open complaints.</p>
            </div>
          )}
        </Card>
      </div>

      {/* Inventory Status */}
      <Card title="Inventory Status">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-700">Total Assets</h3>
            <p className="text-2xl font-bold text-blue-800 mt-1">{totalAssets}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-700">Available</h3>
            <p className="text-2xl font-bold text-green-800 mt-1">{availableAssets}</p>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-amber-700">Assigned</h3>
            <p className="text-2xl font-bold text-amber-800 mt-1">{assignedAssets}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-700">Low Stock</h3>
            <p className="text-2xl font-bold text-red-800 mt-1">{lowStockAssets.length}</p>
          </div>
        </div>

        {/* Low Stock Assets */}
        {lowStockAssets.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Low Stock Items</h3>
            <div className="space-y-2">
              {lowStockAssets.map((asset) => (
                <div 
                  key={asset.id} 
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
                >
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
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
                    >
                      Notify Admin
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ManagerDashboard;