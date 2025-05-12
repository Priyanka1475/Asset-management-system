import { useState, useEffect } from 'react';
import { Monitor, ClipboardList, MessageSquare, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAssets } from '../../context/AssetContext';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const { 
    getUserAssets, 
    getUserRequests, 
    getUserComplaints, 
    createAssetRequest 
  } = useAssets();
  const navigate = useNavigate();
  
  const [userAssets, setUserAssets] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [userComplaints, setUserComplaints] = useState([]);

  useEffect(() => {
    setUserAssets(getUserAssets());
    setUserRequests(getUserRequests());
    setUserComplaints(getUserComplaints());
  }, [getUserAssets, getUserRequests, getUserComplaints]);

  // Status badge variant mapper
  const getStatusVariant = (status) => {
    const statusMap = {
      'pending': 'warning',
      'approved': 'success',
      'rejected': 'danger',
      'open': 'warning',
      'in progress': 'primary',
      'resolved': 'success',
    };
    return statusMap[status] || 'default';
  };

  const recentRequestsColumns = [
    { 
      key: 'assetType', 
      header: 'Asset Type', 
      sortable: true 
    },
    { 
      key: 'status', 
      header: 'Status', 
      sortable: true,
      render: (row) => (
        <Badge variant={getStatusVariant(row.status)}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      )
    },
    { 
      key: 'date', 
      header: 'Requested', 
      sortable: true,
      render: (row) => new Date(row.date).toLocaleDateString()
    },
  ];

  const recentComplaintsColumns = [
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
        <Badge variant={getStatusVariant(row.status)}>
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
        <h1 className="text-2xl font-bold text-gray-900">Hi, {currentUser.firstName}!</h1>
        <div>
          <Button
            onClick={() => navigate('/user/requests')}
            className="flex items-center"
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            New Asset Request
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Assigned Assets"
          value={userAssets.length}
          icon={Monitor}
          variant="blue"
          onClick={() => navigate('/user/assets')}
        />
        <StatCard
          title="Active Requests"
          value={userRequests.filter(r => r.status === 'pending').length}
          icon={ClipboardList}
          variant="amber"
          onClick={() => navigate('/user/requests')}
        />
        <StatCard
          title="Open Complaints"
          value={userComplaints.filter(c => c.status !== 'resolved').length}
          icon={MessageSquare}
          variant="red"
          onClick={() => navigate('/user/complaints')}
        />
      </div>

      {/* Recent Assigned Assets */}
      <Card title="Recently Assigned Assets">
        {userAssets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userAssets.slice(0, 3).map((asset) => (
              <div key={asset.id} className="border rounded-lg overflow-hidden flex flex-col">
                <div className="h-40 overflow-hidden bg-gray-100">
                  <img
                    src={asset.image}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-1">
                  <h3 className="font-medium text-gray-900">{asset.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{asset.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <Badge variant="primary">{asset.category}</Badge>
                    <span className="text-xs text-gray-500">
                      Assigned: {new Date(asset.assignedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 flex flex-col items-center">
            <Monitor className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">No assets assigned yet.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => navigate('/user/requests')}
            >
              Request an Asset
            </Button>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <Card title="Recent Requests">
          {userRequests.length > 0 ? (
            <Table 
              columns={recentRequestsColumns}
              data={userRequests.slice(0, 5)}
            />
          ) : (
            <div className="text-center py-6">
              <ClipboardList className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No requests yet.</p>
            </div>
          )}
        </Card>

        {/* Recent Complaints */}
        <Card title="Recent Complaints">
          {userComplaints.length > 0 ? (
            <Table 
              columns={recentComplaintsColumns}
              data={userComplaints.slice(0, 5)}
            />
          ) : (
            <div className="text-center py-6">
              <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No complaints yet.</p>
            </div>
          )}
        </Card>
      </div>

      {/* Important Notices */}
      <Card title="Important Notices">
        <div className="border border-amber-200 rounded-lg bg-amber-50 p-4 flex">
          <div className="mr-4 flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-amber-800">Maintenance Schedule</h4>
            <p className="text-sm text-amber-700 mt-1">
              IT will be performing system maintenance this weekend. Please save your work and shut down your computers before leaving on Friday.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserDashboard;