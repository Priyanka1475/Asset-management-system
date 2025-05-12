import { useState, useEffect } from 'react';
import { useAssets } from '../../context/AssetContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import { MessageSquare, Calendar } from 'lucide-react';

const UserComplaints = () => {
  const { getUserComplaints } = useAssets();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    setComplaints(getUserComplaints());
  }, [getUserComplaints]);

  // Get badge variant based on status
  const getStatusVariant = (status) => {
    const statusMap = {
      'open': 'warning',
      'in progress': 'primary',
      'resolved': 'success',
    };
    return statusMap[status] || 'default';
  };

  const complaintColumns = [
    { 
      key: 'assetName', 
      header: 'Asset', 
      sortable: true 
    },
    { 
      key: 'description', 
      header: 'Issue Description', 
      sortable: false,
      render: (row) => (
        <span className="truncate block max-w-xs">{row.description}</span>
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
      header: 'Reported', 
      sortable: true,
      render: (row) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1 text-gray-400" />
          <span>{new Date(row.date).toLocaleDateString()}</span>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
      </div>

      <Card>
        {complaints.length > 0 ? (
          <Table
            columns={complaintColumns}
            data={complaints}
            pagination={true}
          />
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Complaints</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't filed any asset complaints yet.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserComplaints;