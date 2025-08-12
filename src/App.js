import React, { useState, useEffect } from 'react';
import ClinikHeader from './components/ClinikHeader';
import ClinikHome from './components/ClinikHome';
import ClinikLogin from './components/ClinikLogin';
import ClinikDoctors from './components/ClinikDoctors';
import ClinikAppointments from './components/ClinikAppointments';
import ClinikPatients from './components/ClinikPatients';
import { currentUserStorage } from './utils/storage';

const App = () => {
  const [currentView, setCurrentView] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  useEffect(() => {
    const storedUser = currentUserStorage.get();
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const handleViewChange = (view, options = {}) => {
    setCurrentView(view);
    if (options.selectedDoctorId) {
      setSelectedDoctorId(options.selectedDoctorId);
    } else {
      setSelectedDoctorId(null);
    }
  };

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setCurrentView('home');
  };

  const handleLogout = () => {
    currentUserStorage.remove();
    setCurrentUser(null);
    setCurrentView('home');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <ClinikHome onViewChange={handleViewChange} />;
      case 'login':
        return <ClinikLogin onLogin={handleLogin} onViewChange={handleViewChange} />;
      case 'doctors':
        return <ClinikDoctors onViewChange={handleViewChange} />;
      case 'appointments':
        return (
          <ClinikAppointments 
            currentUser={currentUser} 
            selectedDoctorId={selectedDoctorId}
            onViewChange={handleViewChange}
          />
        );
      case 'patients':
        return <ClinikPatients currentUser={currentUser} onViewChange={handleViewChange} />;
      default:
        return <ClinikHome onViewChange={handleViewChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ClinikHeader
        currentView={currentView}
        onViewChange={handleViewChange}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      <main className="flex-grow">
        {renderCurrentView()}
      </main>
      <footer className="bg-gray-800 text-white py-6 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} ClinikApp. Todos los derechos reservados. Proyecto de tercer año de sistema de UML.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Términos</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;