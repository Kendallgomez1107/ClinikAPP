import React, { useState, useEffect } from 'react';
import { patients as initialPatients } from '../mock/patients';
import { patientStorage } from '../utils/storage';

const ClinikPatients = ({ currentUser, onViewChange }) => {
  const [patients, setPatients] = useState([]);
  const [view, setView] = useState('list');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    address: '',
    emergencyContact: '',
    medicalHistory: '',
    allergies: '',
    bloodType: ''
  });

  useEffect(() => {
    const storedPatients = patientStorage.get();
    if (storedPatients.length === 0) {
      patientStorage.set(initialPatients);
      setPatients(initialPatients);
    } else {
      setPatients(storedPatients);
    }
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newPatient = {
      id: Date.now(),
      ...formData,
      medicalHistory: formData.medicalHistory.split(',').map(item => item.trim()).filter(item => item),
      allergies: formData.allergies.split(',').map(item => item.trim()).filter(item => item)
    };

    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    patientStorage.set(updatedPatients);

    setFormData({
      name: '',
      email: '',
      phone: '',
      birthDate: '',
      address: '',
      emergencyContact: '',
      medicalHistory: '',
      allergies: '',
      bloodType: ''
    });

    setView('list');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const viewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setView('details');
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Bloquear el acceso si no hay usuario logueado o si el rol es 'patient'
  if (!currentUser || currentUser?.role === 'patient') { 
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600">Necesitas iniciar sesión como administrador o médico para ver esta sección.</p>
          <button
            onClick={() => onViewChange('home')}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    );
  }

  if (view === 'new') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Nuevo Paciente</h2>
              <button
                onClick={() => onViewChange('home')}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Volver al inicio
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    required
                    value={formData.birthDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contacto de Emergencia
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    required
                    value={formData.emergencyContact}
                    onChange={handleChange}
                    placeholder="Nombre - Teléfono"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Sangre
                  </label>
                  <select
                    name="bloodType"
                    required
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Seleccionar</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Historial Médico (separado por comas)
                </label>
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Ej: Hipertensión, Diabetes, Asma..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alergias (separadas por comas)
                </label>
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Ej: Penicilina, Polen, Mariscos..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Registrar Paciente
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'details' && selectedPatient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Detalles del Paciente</h2>
              <button
                onClick={() => setView('list')} // Volver a la lista de pacientes
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Volver a la lista
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Nombre:</span>
                      <p className="text-gray-900">{selectedPatient.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Email:</span>
                      <p className="text-gray-900">{selectedPatient.email}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Teléfono:</span>
                      <p className="text-gray-900">{selectedPatient.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Edad:</span>
                      <p className="text-gray-900">{calculateAge(selectedPatient.birthDate)} años</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Tipo de Sangre:</span>
                      <p className="text-gray-900">{selectedPatient.bloodType}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contacto</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Dirección:</span>
                      <p className="text-gray-900">{selectedPatient.address}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Contacto de Emergencia:</span>
                      <p className="text-gray-900">{selectedPatient.emergencyContact}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Historial Médico</h3>
                  <div className="space-y-2">
                    {selectedPatient.medicalHistory.length > 0 ? (
                      selectedPatient.medicalHistory.map((condition, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mr-2 mb-2"
                        >
                          {condition}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">Sin historial médico registrado</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Alergias</h3>
                  <div className="space-y-2">
                    {selectedPatient.allergies.length > 0 ? (
                      selectedPatient.allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm mr-2 mb-2"
                        >
                          {allergy}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">Sin alergias registradas</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Pacientes</h1>
            <p className="text-gray-600">Gestiona la información de los pacientes registrados</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => onViewChange('home')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Volver al Inicio
            </button>
            {currentUser?.role === 'admin' && ( // Solo administradores pueden añadir pacientes
              <button
                onClick={() => setView('new')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                + Nuevo Paciente
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar pacientes por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="grid gap-6">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron pacientes' : 'No hay pacientes registrados'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda'
                  : (currentUser?.role === 'admin' ? 'Registra el primer paciente en el sistema' : 'No hay pacientes disponibles para visualizar.')
                }
              </p>
              {!searchTerm && currentUser?.role === 'admin' && (
                <button
                  onClick={() => setView('new')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Registrar Primer Paciente
                </button>
              )}
            </div>
          ) : (
            filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 cursor-pointer"
                onClick={() => viewPatientDetails(patient)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">{patient.name}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {calculateAge(patient.birthDate)} años
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><span className="font-medium">Email:</span> {patient.email}</p>
                        <p><span className="font-medium">Teléfono:</span> {patient.phone}</p>
                        <p><span className="font-medium">Tipo de Sangre:</span> {patient.bloodType}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Dirección:</span> {patient.address}</p>
                        <p><span className="font-medium">Emergencia:</span> {patient.emergencyContact}</p>
                      </div>
                    </div>

                    {patient.medicalHistory.length > 0 && (
                      <div className="mt-3">
                        <span className="text-sm font-medium text-gray-700">Condiciones: </span>
                        {patient.medicalHistory.slice(0, 3).map((condition, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs mr-1"
                          >
                            {condition}
                          </span>
                        ))}
                        {patient.medicalHistory.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{patient.medicalHistory.length - 3} más
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinikPatients;