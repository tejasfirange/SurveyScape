import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Landing from './components/Landing';
import Adsign from './components/Adsign';
import DBViewer from './components/DBViewer';
import CreateSurvey from './components/CreateSurvey';
import EditSurvey from './components/EditSurvey';
import SurveyDetails from './components/SurveyDetails';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/admin" element={
            <PrivateRoute>
              <Adsign />
            </PrivateRoute>
          } />
          <Route path="/dbviewer" element={
            <PrivateRoute>
              <DBViewer />
            </PrivateRoute>
          } />
          <Route path="/create-survey" element={
            <PrivateRoute>
              <CreateSurvey />
            </PrivateRoute>
          } />
          <Route path="/edit-survey/:id" element={
            <PrivateRoute>
              <EditSurvey />
            </PrivateRoute>
          } />
          <Route path="/survey-details/:id" element={
            <PrivateRoute>
              <SurveyDetails />
            </PrivateRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;