import { useState, useEffect } from 'react';
import { useAssets } from '../../context/AssetContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { BarChart3, Download, Printer, FileText, Calendar, RefreshCw } from 'lucide-react';

const AdminReports = () => {
  const { assets, employees, complaints, requests } = useAssets();
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Calculate asset value
  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.purchasePrice, 0);
  
  // Assets by category
  const [categoryData, setCategoryData] = useState([]);
  
  useEffect(() => {
    // Group assets by category
    const categoryCounts = {};
    assets.forEach(asset => {
      categoryCounts[asset.category] = (categoryCounts[asset.category] || 0) + 1;
    });
    
    const formattedData = Object.keys(categoryCounts).map(category => ({
      name: category,
      count: categoryCounts[category],
      percentage: (categoryCounts[category] / assets.length) * 100
    }));
    
    setCategoryData(formattedData);
  }, [assets]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
      </div>

      {/* Report Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <input
                type="date"
                className="block border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
              />
            </div>
            <Button size="sm" variant="outline" className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex items-center">
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              PDF
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm">Total Assets</p>
              <h3 className="text-2xl font-bold mt-1">{assets.length}</h3>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <BarChart3 className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 text-blue-100 text-sm">
            <span className="font-medium">{assets.filter(a => a.status === 'assigned').length}</span> assigned,
            <span className="font-medium ml-1">{assets.filter(a => a.status === 'available').length}</span> available
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 text-sm">Total Value</p>
              <h3 className="text-2xl font-bold mt-1">${totalAssetValue.toLocaleString()}</h3>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-green-100 text-sm">
            Average cost: <span className="font-medium">${(totalAssetValue / assets.length).toFixed(2)}</span>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-amber-100 text-sm">Employees</p>
              <h3 className="text-2xl font-bold mt-1">{employees.length}</h3>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-amber-100 text-sm">
            <span className="font-medium">{employees.filter(e => e.role === 'user').length}</span> users,
            <span className="font-medium ml-1">{employees.filter(e => e.role === 'manager').length}</span> managers
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm">Activity</p>
              <h3 className="text-2xl font-bold mt-1">
                {requests.length + complaints.length}
              </h3>
            </div>
            <div className="bg-white/20 p-2 rounded-lg">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 text-purple-100 text-sm">
            <span className="font-medium">{requests.length}</span> requests,
            <span className="font-medium ml-1">{complaints.length}</span> complaints
          </div>
        </Card>
      </div>

      {/* Asset Distribution */}
      <Card title="Asset Distribution">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-4">Distribution by Category</h4>
            {categoryData.map((category) => (
              <div key={category.name} className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <span className="text-sm text-gray-500">{category.count} ({category.percentage.toFixed(1)}%)</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium text-gray-500 mb-4">Distribution by Status</h4>
            <div className="flex flex-wrap gap-4">
              <div className="bg-blue-50 rounded-lg p-4 flex-1 min-w-[140px]">
                <div className="text-blue-600 font-semibold">Available</div>
                <div className="text-xl font-bold text-gray-900 mt-1">
                  {assets.filter(a => a.status === 'available').length}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {((assets.filter(a => a.status === 'available').length / assets.length) * 100).toFixed(1)}%
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 flex-1 min-w-[140px]">
                <div className="text-green-600 font-semibold">Assigned</div>
                <div className="text-xl font-bold text-gray-900 mt-1">
                  {assets.filter(a => a.status === 'assigned').length}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {((assets.filter(a => a.status === 'assigned').length / assets.length) * 100).toFixed(1)}%
                </div>
              </div>
              
              <div className="bg-amber-50 rounded-lg p-4 flex-1 min-w-[140px]">
                <div className="text-amber-600 font-semibold">Maintenance</div>
                <div className="text-xl font-bold text-gray-900 mt-1">
                  {assets.filter(a => a.status === 'maintenance').length}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {((assets.filter(a => a.status === 'maintenance').length / assets.length) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card title="Recent Activity">
        <div className="flow-root">
          <ul className="-mb-8">
            {[...requests, ...complaints]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 6)
              .map((item, idx) => (
                <li key={item.id}>
                  <div className="relative pb-8">
                    {idx !== 5 ? (
                      <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                    ) : null}
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          'requests' in item ? 'bg-blue-100' : 'bg-red-100'
                        }`}>
                          {('assetType' in item) ? (
                            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {item.userName}
                          </div>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {new Date(item.date).toLocaleDateString()} • {new Date(item.date).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>
                            {'assetType' in item
                              ? `Requested ${item.assetType}: ${item.reason}`
                              : `Reported issue with ${item.assetName}: ${item.description}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default AdminReports;