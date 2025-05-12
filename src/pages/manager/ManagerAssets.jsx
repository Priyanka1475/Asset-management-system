import { useState, useEffect } from 'react';
import { useAssets } from '../../context/AssetContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import Badge from '../../components/ui/Badge';
import { Search, Filter, UserPlus } from 'lucide-react';

const ManagerAssets = () => {
  const { assets, employees, assignAsset } = useAssets();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(() => {
    // Extract unique categories
    const uniqueCategories = [...new Set(assets.map(asset => asset.category))];
    setCategories(uniqueCategories);
    
    // Apply filters
    let result = assets;
    
    if (searchTerm) {
      result = result.filter(
        asset => 
          asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      result = result.filter(asset => asset.category === selectedCategory);
    }
    
    if (statusFilter) {
      result = result.filter(asset => asset.status === statusFilter);
    }
    
    setFilteredAssets(result);
  }, [assets, searchTerm, selectedCategory, statusFilter]);

  const handleAssignClick = (asset) => {
    setSelectedAsset(asset);
    setShowAssignModal(true);
  };

  const handleAssign = () => {
    if (selectedAsset && selectedEmployee) {
      assignAsset(selectedAsset.id, selectedEmployee);
      setShowAssignModal(false);
      setSelectedAsset(null);
      setSelectedEmployee('');
    }
  };

  const getStatusBadgeVariant = (status) => {
    const statusMap = {
      'available': 'success',
      'assigned': 'primary',
      'maintenance': 'warning',
    };
    return statusMap[status] || 'default';
  };

  const assetColumns = [
    {
      key: 'name',
      header: 'Asset',
      sortable: true,
      render: (row) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0 mr-3">
            <img
              src={row.image}
              alt={row.name}
              className="h-10 w-10 rounded-md object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.name}</p>
            <p className="text-xs text-gray-500">{row.serialNumber}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (row) => (
        <Badge variant={getStatusBadgeVariant(row.status)}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'assignedTo',
      header: 'Assigned To',
      sortable: true,
      render: (row) => {
        if (row.status !== 'assigned') return <span>-</span>;
        const employee = employees.find(emp => emp.id === row.assignedTo);
        return employee ? `${employee.firstName} ${employee.lastName}` : '-';
      },
    },
    {
      key: 'quantity',
      header: 'Quantity',
      sortable: true,
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          className="flex items-center"
          disabled={row.status === 'assigned'}
          onClick={() => handleAssignClick(row)}
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Assign
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Asset Assignment</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search assets..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="mt-3 md:mt-0 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Assets Table */}
      <Card>
        <Table 
          columns={assetColumns} 
          data={filteredAssets} 
          pagination={true}
        />
      </Card>

      {/* Assign Asset Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Assign Asset to Employee"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowAssignModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedEmployee}
            >
              Assign Asset
            </Button>
          </>
        }
      >
        {selectedAsset && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                <img
                  src={selectedAsset.image}
                  alt={selectedAsset.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">{selectedAsset.name}</h4>
                <p className="text-sm text-gray-500">{selectedAsset.category} • {selectedAsset.serialNumber}</p>
              </div>
            </div>
            
            <div>
              <label htmlFor="employee" className="block text-sm font-medium text-gray-700 mb-1">
                Select Employee
              </label>
              <select
                id="employee"
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
              >
                <option value="">Select an Employee</option>
                {employees
                  .filter(emp => emp.role === 'user')
                  .map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName} ({employee.department})
                    </option>
                  ))}
              </select>
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
                    Once assigned, the employee will be responsible for this asset. They will be notified by email.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManagerAssets;