import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home/Home';
import Stats from './pages/Home/Stats';
import Articles from './pages/Home/Articles';
import Profile from './pages/Home/Profile';
import ProfileInfo from './pages/Home/ProfileInfo';
import ProfilePrivacy from './pages/Home/ProfilePrivacy';
import ProfileNotifications from './pages/Home/ProfileNotifications';
import ProfileHelp from './pages/Home/ProfileHelp';
import ArticleDetail from './pages/Home/ArticleDetail';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminEmotions from './pages/Admin/AdminEmotions';
import AdminArticles from './pages/Admin/AdminArticles';
import AdminRoles from './pages/Admin/AdminRoles';
import AdminPermissions from './pages/Admin/AdminPermissions';
import NotFound from './pages/NotFound/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AdminRoute from './components/AdminRoute';
import { ToastProvider } from './context/ToastContext';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/stats" 
            element={
              <ProtectedRoute>
                <Stats />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/articles" 
            element={
              <ProtectedRoute>
                <Articles />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/articles/:id" 
            element={
              <ProtectedRoute>
                <ArticleDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/info" 
            element={
              <ProtectedRoute>
                <ProfileInfo />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/privacy" 
            element={
              <ProtectedRoute>
                <ProfilePrivacy />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/notifications" 
            element={
              <ProtectedRoute>
                <ProfileNotifications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/help" 
            element={
              <ProtectedRoute>
                <ProfileHelp />
              </ProtectedRoute>
            } 
          />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          <Route path="/admin/roles" element={<AdminRoute><AdminRoles /></AdminRoute>} />
          <Route path="/admin/permissions" element={<AdminRoute><AdminPermissions /></AdminRoute>} />
          <Route path="/admin/emotions" element={<AdminRoute><AdminEmotions /></AdminRoute>} />
          <Route path="/admin/articles" element={<AdminRoute><AdminArticles /></AdminRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
