import { useState, useEffect } from 'react';
import { useAssets } from '../../context/AssetContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { BarChart3, AlertTriangle, ArrowUpRight } from 'lucide-react';

const ManagerInventory = () => {
  const { assets, categories } = useAssets();
  const [lowStockAssets, setLowStockAssets] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    // Find assets with low stock
    setLowStockAssets(assets.filter(asset => asset.quantity < 5));
    
    // Prepare category data for charts
    const categoryCounts = {};
    categories.forEach(category => {
      categoryCounts[category.name] = {
        total: 0,
        available: 0,
        assigned: 0,
        maintenance: 0,
      };
    });
    
    assets.forEach(asset => {
      if (categoryCounts[asset.category]) {
        categoryCounts[asset.category].total += 1;
        categoryCounts[asset.category][asset.status] = 
          (categoryCounts[asset.category][asset.status] || 0) + 1;
      }
    });
    
    const formattedCategoryData = Object.keys(categoryCounts).map(category => ({
      name: category,
      ...categoryCounts[category],
    }));
    
    setCategoryData(formattedCategoryData);
  }, [assets, categories]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
      </div>

      {/* Inventory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Assets</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{assets.length}</h3>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex space-x-3">
            <Badge variant="primary">{assets.filter(a => a.status === 'assigned').length} Assigned</Badge>
            <Badge variant="success">{assets.filter(a => a.status === 'available').length} Available</Badge>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">{lowStockAssets.length}</h3>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center text-red-600 border-red-200 hover:bg-red-50"
            >
              Notify Admin
              <ArrowUpRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Categories</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</h3>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.slice(0, 3).map((category) => (
              <Badge key={category.id} variant="secondary">{category.name}</Badge>
            ))}
            {categories.length > 3 && (
              <Badge variant="default">+{categories.length - 3} more</Badge>
            )}
          </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                ${assets.reduce((sum, asset) => sum + asset.purchasePrice, 0).toLocaleString()}
              </h3>
            </div>
            <div className="bg-amber-100 p-2 rounded-full">
              <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">65% of annual budget</p>
          </div>
        </div>
      </div>

      {/* Category Distribution */}
      <Card title="Category Distribution">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-4">Assets by Category</h4>
            {categoryData.map((category) => (
              <div key={category.name} className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <span className="text-sm text-gray-500">{category.total} assets</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(category.total / assets.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-6">
            <h4 className="text-sm font-medium text-gray-500 mb-4">Status Distribution</h4>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Available</span>
                  <span className="text-sm text-gray-500">
                    {assets.filter(a => a.status === 'available').length} assets
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ 
                      width: `${(assets.filter(a => a.status === 'available').length / assets.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Assigned</span>
                  <span className="text-sm text-gray-500">
                    {assets.filter(a => a.status === 'assigned').length} assets
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ 
                      width: `${(assets.filter(a => a.status === 'assigned').length / assets.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Maintenance</span>
                  <span className="text-sm text-gray-500">
                    {assets.filter(a => a.status === 'maintenance').length} assets
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ 
                      width: `${(assets.filter(a => a.status === 'maintenance').length / assets.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Low Stock Alert */}
      {lowStockAssets.length > 0 && (
        <Card title="Low Stock Alerts">
          <div className="space-y-4">
            {lowStockAssets.map((asset) => (
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
                  >
                    Request More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default ManagerInventory;