import { useState, useEffect } from 'react';
import { useAssets } from '../../context/AssetContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Filter, Search, AlertCircle } from 'lucide-react';

const UserAssets = () => {
  const { getUserAssets, createComplaint } = useAssets();
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [complaintDesc, setComplaintDesc] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const userAssets = getUserAssets();
    setAssets(userAssets);
    setFilteredAssets(userAssets);
    
    // Extract unique categories
    const uniqueCategories = [...new Set(userAssets.map(asset => asset.category))];
    setCategories(uniqueCategories);
  }, [getUserAssets]);

  // Filter assets based on search and category
  useEffect(() => {
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
    
    setFilteredAssets(result);
  }, [assets, searchTerm, selectedCategory]);

  const openComplaintModal = (asset) => {
    setSelectedAsset(asset);
    setComplaintModalOpen(true);
  };

  const handleComplaintSubmit = () => {
    if (selectedAsset && complaintDesc.trim()) {
      createComplaint(selectedAsset.id, complaintDesc);
      setComplaintModalOpen(false);
      setComplaintDesc('');
      setSelectedAsset(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Assets</h1>
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
          
          <div className="mt-3 md:mt-0 flex items-center space-x-2">
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
        </div>
      </div>
      
      {/* Assets List */}
      <div className="space-y-6">
        {filteredAssets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => (
              <Card key={asset.id} className="overflow-hidden flex flex-col">
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img
                    src={asset.image}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{asset.name}</h3>
                    <Badge variant="primary">{asset.category}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{asset.description}</p>
                  <p className="mt-1 text-xs text-gray-500">Serial: {asset.serialNumber}</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex-1 flex flex-col justify-end">
                    <div className="text-xs text-gray-500 mb-3">
                      <div>
                        <span className="font-medium">Assigned:</span> {new Date(asset.assignedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center"
                      onClick={() => openComplaintModal(asset)}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Report Issue
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="mx-auto h-16 w-16 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No assets found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {assets.length === 0 ? 
                "You don't have any assigned assets yet." : 
                "No assets match your current search filters."}
            </p>
          </div>
        )}
      </div>
      
      {/* Complaint Modal */}
      <Modal
        isOpen={complaintModalOpen}
        onClose={() => setComplaintModalOpen(false)}
        title="Report an Issue"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setComplaintModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleComplaintSubmit}
              disabled={!complaintDesc.trim()}
            >
              Submit
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
                <p className="text-sm text-gray-500">Serial: {selectedAsset.serialNumber}</p>
              </div>
            </div>
            
            <div>
              <label htmlFor="complaint" className="block text-sm font-medium text-gray-700 mb-1">
                Issue Description
              </label>
              <textarea
                id="complaint"
                rows={4}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Describe the issue you're experiencing with this asset..."
                value={complaintDesc}
                onChange={(e) => setComplaintDesc(e.target.value)}
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
                    Your issue will be reviewed by the team and you'll be notified about the resolution.
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

export default UserAssets;