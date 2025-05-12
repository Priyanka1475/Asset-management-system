import { useState, useEffect } from 'react';
import { useAssets } from '../../context/AssetContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Table from '../../components/ui/Table';
import { PlusCircle, ClipboardList, Calendar, Info } from 'lucide-react';

const UserRequests = () => {
  const { getUserRequests, createAssetRequest } = useAssets();
  const [requests, setRequests] = useState([]);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [assetType, setAssetType] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    setRequests(getUserRequests());
  }, [getUserRequests]);

  const handleCreateRequest = () => {
    if (assetType && reason) {
      createAssetRequest(assetType, reason);
      setShowNewRequestModal(false);
      setAssetType('');
      setReason('');
      setRequests(getUserRequests());
    }
  };

  // Get badge variant based on status
  const getStatusVariant = (status) => {
    const statusMap = {
      'pending': 'warning',
      'approved': 'success',
      'rejected': 'danger',
    };
    return statusMap[status] || 'default';
  };

  const requestColumns = [
    { 
      key: 'assetType', 
      header: 'Asset Type', 
      sortable: true 
    },
    { 
      key: 'reason', 
      header: 'Reason', 
      sortable: false,
      render: (row) => (
        <span className="truncate block max-w-xs">{row.reason}</span>
      )
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
      header: 'Date', 
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
      header: 'Details', 
      sortable: false,
      render: (row) => (
        <Button variant="ghost" size="sm" className="flex items-center">
          <Info className="h-4 w-4" />
        </Button>
      )
    },
  ];

  const assetTypeOptions = [
    'Laptop',
    'Desktop',
    'Monitor',
    'Phone',
    'Tablet',
    'Keyboard',
    'Mouse',
    'Headset',
    'Office Chair',
    'Desk',
    'Other'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Asset Requests</h1>
        <Button 
          onClick={() => setShowNewRequestModal(true)}
          className="flex items-center"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      <Card>
        {requests.length > 0 ? (
          <Table
            columns={requestColumns}
            data={requests}
            pagination={true}
          />
        ) : (
          <div className="text-center py-12">
            <ClipboardList className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Requests</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't made any asset requests yet.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => setShowNewRequestModal(true)}
            >
              Create your first request
            </Button>
          </div>
        )}
      </Card>
      
      {/* New Request Modal */}
      <Modal
        isOpen={showNewRequestModal}
        onClose={() => setShowNewRequestModal(false)}
        title="Request New Asset"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowNewRequestModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateRequest}
              disabled={!assetType || !reason}
            >
              Submit Request
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="assetType" className="block text-sm font-medium text-gray-700 mb-1">
              Asset Type
            </label>
            <select
              id="assetType"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
            >
              <option value="">Select Asset Type</option>
              {assetTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Request
            </label>
            <textarea
              id="reason"
              rows={4}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Please explain why you need this asset..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            ></textarea>
          </div>
          
          <div className="bg-blue-50 px-4 py-3 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Your request will be reviewed by your manager. You'll be notified once it's approved or rejected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserRequests;