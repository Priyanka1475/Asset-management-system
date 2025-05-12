
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AssetProvider } from './context/AssetContext';
import Login from './pages/auth/Login';
import UserDashboard from './pages/user/UserDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserAssets from './pages/user/UserAssets';
import UserRequests from './pages/user/UserRequests';
import UserComplaints from './pages/user/UserComplaints';
import ManagerEmployees from './pages/manager/ManagerEmployees';
import ManagerAssets from './pages/manager/ManagerAssets';
import ManagerInventory from './pages/manager/ManagerInventory';
import AdminAssets from './pages/admin/AdminAssets';
import AdminCategories from './pages/admin/AdminCategories';
import AdminReports from './pages/admin/AdminReports';
import ProtectedRoute from './components/auth/ProtectedRoute';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <AssetProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* End User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/user" element={<UserDashboard />} />
            <Route path="/user/assets" element={<UserAssets />} />
            <Route path="/user/requests" element={<UserRequests />} />
            <Route path="/user/complaints" element={<UserComplaints />} />
          </Route>
          
          {/* Manager Routes */}
          <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/manager/employees" element={<ManagerEmployees />} />
            <Route path="/manager/assets" element={<ManagerAssets />} />
            <Route path="/manager/inventory" element={<ManagerInventory />} />
          </Route>
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/assets" element={<AdminAssets />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </Route>
          
          <Route path="/login" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AssetProvider>
    </AuthProvider>
  );
}

export default App;