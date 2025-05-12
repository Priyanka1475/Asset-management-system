import { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_ASSETS, MOCK_REQUESTS, MOCK_COMPLAINTS, MOCK_EMPLOYEES } from '../data/mockData';
import { useAuth } from './AuthContext';
import { nanoid } from 'nanoid';

const AssetContext = createContext();

export const useAssets = () => useContext(AssetContext);

export const AssetProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [assets, setAssets] = useState(MOCK_ASSETS);
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [employees, setEmployees] = useState(MOCK_EMPLOYEES);
  const [categories, setCategories] = useState([
    { id: '1', name: 'Laptops', description: 'Computing devices' },
    { id: '2', name: 'Phones', description: 'Mobile communication devices' },
    { id: '3', name: 'Peripherals', description: 'Computer accessories' },
    { id: '4', name: 'Furniture', description: 'Office furniture' },
  ]);

  // Get user assets
  const getUserAssets = () => {
    if (!currentUser) return [];
    return assets.filter(asset => asset.assignedTo === currentUser.id);
  };

  // Get user requests
  const getUserRequests = () => {
    if (!currentUser) return [];
    return requests.filter(request => request.userId === currentUser.id);
  };

  // Get user complaints
  const getUserComplaints = () => {
    if (!currentUser) return [];
    return complaints.filter(complaint => complaint.userId === currentUser.id);
  };

  // Create a new asset request
  const createAssetRequest = (assetType, reason) => {
    const newRequest = {
      id: nanoid(),
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      assetType,
      reason,
      status: 'pending',
      date: new Date().toISOString(),
    };
    
    setRequests(prev => [newRequest, ...prev]);
    return newRequest;
  };

  // Create a new asset complaint
  const createComplaint = (assetId, description) => {
    const asset = assets.find(a => a.id === assetId);
    const newComplaint = {
      id: nanoid(),
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      assetId,
      assetName: asset.name,
      description,
      status: 'open',
      date: new Date().toISOString(),
    };
    
    setComplaints(prev => [newComplaint, ...prev]);
    return newComplaint;
  };

  // Add a new asset (admin only)
  const addAsset = (assetData) => {
    const newAsset = {
      id: nanoid(),
      ...assetData,
      status: 'available',
      createdAt: new Date().toISOString(),
    };
    
    setAssets(prev => [newAsset, ...prev]);
    return newAsset;
  };

  // Update asset quantity (admin only)
  const updateAssetQuantity = (assetId, quantity) => {
    setAssets(prev => 
      prev.map(asset => 
        asset.id === assetId 
          ? { ...asset, quantity: asset.quantity + quantity } 
          : asset
      )
    );
  };

  // Assign asset to user (manager only)
  const assignAsset = (assetId, userId) => {
    setAssets(prev => 
      prev.map(asset => 
        asset.id === assetId 
          ? { 
              ...asset, 
              assignedTo: userId, 
              status: 'assigned',
              assignedAt: new Date().toISOString()
            } 
          : asset
      )
    );
  };

  // Update request status (manager only)
  const updateRequestStatus = (requestId, status) => {
    setRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status, updatedAt: new Date().toISOString() } 
          : request
      )
    );
  };

  // Update complaint status (manager only)
  const updateComplaintStatus = (complaintId, status) => {
    setComplaints(prev => 
      prev.map(complaint => 
        complaint.id === complaintId 
          ? { ...complaint, status, updatedAt: new Date().toISOString() } 
          : complaint
      )
    );
  };

  // Add new employee (manager only)
  const addEmployee = (employeeData) => {
    const newEmployee = {
      id: nanoid(),
      ...employeeData,
      createdAt: new Date().toISOString(),
    };
    
    setEmployees(prev => [newEmployee, ...prev]);
    return newEmployee;
  };

  // Delete asset (admin only)
  const deleteAsset = (assetId) => {
    setAssets(prev => prev.filter(asset => asset.id !== assetId));
  };

  // Add category (admin only)
  const addCategory = (name, description) => {
    const newCategory = {
      id: nanoid(),
      name,
      description,
    };
    
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const value = {
    assets,
    requests,
    complaints,
    employees,
    categories,
    getUserAssets,
    getUserRequests,
    getUserComplaints,
    createAssetRequest,
    createComplaint,
    addAsset,
    updateAssetQuantity,
    assignAsset,
    updateRequestStatus,
    updateComplaintStatus,
    addEmployee,
    deleteAsset,
    addCategory
  };

  return (
    <AssetContext.Provider value={value}>
      {children}
    </AssetContext.Provider>
  );
};

export default AssetContext;