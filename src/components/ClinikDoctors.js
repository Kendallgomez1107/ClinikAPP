import React, { useState } from 'react';
import { doctors } from '../mock/doctors';

const ClinikDoctors = ({ onViewChange }) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  
  const specialties = ['all', ...new Set(doctors.map(doctor => doctor.specialty))];
  
  const filteredDoctors = selectedSpecialty === 'all' 
    ? doctors 
    : doctors.filter(doctor => doctor.specialty === selectedSpecialty);

  const handleBookAppointment = (doctorId) => {
    onViewChange('appointments', { selectedDoctorId: doctorId });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Nuestros Especialistas
            </h1>
            <p className="text-gray-600">
              Conoce a nuestro equipo de profesionales médicos altamente calificados
            </p>
          </div>
          <button
            onClick={() => onViewChange('home')}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Volver al Inicio
          </button>
        </div>

        {/* Filtros */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {specialties.map((specialty) => (
            <button
              key={specialty}
              onClick={() => setSelectedSpecialty(specialty)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                selectedSpecialty === specialty
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {specialty === 'all' ? 'Todas las Especialidades' : specialty}
            </button>
          ))}
        </div>

        {/* Grid de Doctores */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
            >
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300">
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {doctor.name}
                  </h3>
                  
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-4">
                    {doctor.specialty}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-6 w-full">
                    <div className="flex items-center justify-center space-x-2">
                      <span>📧</span>
                      <span className="truncate">{doctor.email}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span>📞</span>
                      <span>{doctor.phone}</span>
                    </div>
                  </div>

                  <div className="w-full space-y-3">
                    <div className="text-xs text-gray-500 text-center">
                      <p className="font-medium mb-1">Horarios Disponibles:</p>
                      <p>Lun - Vie: 9:00 AM - 5:00 PM</p>
                    </div>
                    
                    <button
                      onClick={() => handleBookAppointment(doctor.id)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Agendar Cita
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👨‍⚕️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay doctores disponibles
            </h3>
            <p className="text-gray-600">
              No se encontraron especialistas para la especialidad seleccionada.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinikDoctors;