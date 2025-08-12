import React, { useState, useEffect } from 'react';
import { doctors } from '../mock/doctors';
import { appointments as initialAppointments } from '../mock/appointments';
import { appointmentStorage } from '../utils/storage';
import { formatDate, formatTime, getTodayDate, getMinDate, getDayOfWeek, isTimeAvailable } from '../utils/dateHelpers';

const ClinikAppointments = ({ currentUser, selectedDoctorId, onViewChange }) => {
  const [view, setView] = useState('list');
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    patientName: currentUser?.name || '',
    patientEmail: currentUser?.email || '',
    patientPhone: '',
    doctorId: selectedDoctorId || '',
    date: '',
    time: '',
    reason: '',
    notes: ''
  });

  useEffect(() => {
    const storedAppointments = appointmentStorage.get();
    if (storedAppointments.length === 0) {
      appointmentStorage.set(initialAppointments);
      setAppointments(initialAppointments);
    } else {
      setAppointments(storedAppointments);
    }
  }, []);

  useEffect(() => {
    if (selectedDoctorId) {
      setFormData(prev => ({ ...prev, doctorId: selectedDoctorId }));
      setView('new');
    }
  }, [selectedDoctorId]);

  const selectedDoctor = doctors.find(d => d.id === parseInt(formData.doctorId));
  const availableTimes = selectedDoctor && formData.date 
    ? selectedDoctor.schedule[getDayOfWeek(formData.date)] || []
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const doctor = doctors.find(d => d.id === parseInt(formData.doctorId));
    const newAppointment = {
      id: Date.now(),
      ...formData,
      doctorId: parseInt(formData.doctorId),
      doctorName: doctor.name,
      specialty: doctor.specialty,
      status: 'pendiente'
    };

    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    appointmentStorage.set(updatedAppointments);

    setFormData({
      patientName: currentUser?.name || '',
      patientEmail: currentUser?.email || '',
      patientPhone: '',
      doctorId: '',
      date: '',
      time: '',
      reason: '',
      notes: ''
    });

    setView('list');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const cancelAppointment = (appointmentId) => {
    const updatedAppointments = appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status: 'cancelada' } : apt
    );
    setAppointments(updatedAppointments);
    appointmentStorage.set(updatedAppointments);
  };

  const confirmAppointment = (appointmentId) => {
    const updatedAppointments = appointments.map(apt =>
      apt.id === appointmentId ? { ...apt, status: 'confirmada' } : apt
    );
    setAppointments(updatedAppointments);
    appointmentStorage.set(updatedAppointments);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmada': return 'bg-green-100 text-green-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const userAppointments = currentUser?.role === 'admin' 
    ? appointments 
    : (currentUser?.role === 'doctor'
      ? appointments.filter(apt => apt.doctorName === currentUser?.name) // Asumiendo que el nombre del doctor en mock/doctors.js coincide con el nombre de usuario
      : appointments.filter(apt => apt.patientEmail === currentUser?.email)
    );

  if (view === 'new') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Nueva Cita</h2>
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
                    Nombre del Paciente
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    required
                    value={formData.patientName}
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
                    name="patientEmail"
                    required
                    value={formData.patientEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="patientPhone"
                  required
                  value={formData.patientPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Médico
                </label>
                <select
                  name="doctorId"
                  required
                  value={formData.doctorId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Seleccionar médico</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    min={getMinDate()}
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora
                  </label>
                  <select
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    disabled={!selectedDoctor || !formData.date}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                  >
                    <option value="">Seleccionar hora</option>
                    {availableTimes.map(time => (
                      <option 
                        key={time} 
                        value={time}
                        disabled={!isTimeAvailable(selectedDoctor, formData.date, time, appointments)}
                      >
                        {time} {!isTimeAvailable(selectedDoctor, formData.date, time, appointments) ? '(Ocupado)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo de la consulta
                </label>
                <input
                  type="text"
                  name="reason"
                  required
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ej: Consulta general, dolor de cabeza..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas adicionales
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Información adicional relevante..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Agendar Cita
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {currentUser?.role === 'admin' ? 'Todas las Citas' : (currentUser?.role === 'doctor' ? 'Mis Citas de Pacientes' : 'Mis Citas')}
            </h1>
            <p className="text-gray-600">
              {currentUser?.role === 'admin' 
                ? 'Gestiona todas las citas médicas del sistema'
                : (currentUser?.role === 'doctor' ? 'Visualiza las citas programadas con tus pacientes' : 'Gestiona tus citas médicas programadas')
              }
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => onViewChange('home')}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Volver al Inicio
            </button>
            {currentUser?.role !== 'doctor' && ( // Solo pacientes y administradores pueden crear citas
              <button
                onClick={() => setView('new')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                + Nueva Cita
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          {userAppointments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay citas programadas
              </h3>
              <p className="text-gray-600 mb-6">
                {currentUser?.role === 'doctor' ? 'No tienes citas programadas con pacientes.' : 'Agenda tu primera cita médica con nuestros especialistas.'}
              </p>
              {currentUser?.role !== 'doctor' && (
                <button
                  onClick={() => setView('new')}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Agendar Primera Cita
                </button>
              )}
            </div>
          ) : (
            userAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {appointment.doctorName}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><span className="font-medium">Paciente:</span> {appointment.patientName}</p>
                        <p><span className="font-medium">Especialidad:</span> {appointment.specialty}</p>
                        <p><span className="font-medium">Motivo:</span> {appointment.reason}</p>
                      </div>
                      <div>
                        <p><span className="font-medium">Fecha:</span> {formatDate(appointment.date)}</p>
                        <p><span className="font-medium">Hora:</span> {formatTime(appointment.time)}</p>
                        <p><span className="font-medium">Teléfono:</span> {appointment.patientPhone}</p>
                      </div>
                    </div>
                    
                    {appointment.notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Notas:</span> {appointment.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {currentUser?.role === 'admin' && appointment.status !== 'cancelada' && ( // Solo administradores pueden confirmar/cancelar
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 md:ml-6">
                      {appointment.status === 'pendiente' && (
                        <button
                          onClick={() => confirmAppointment(appointment.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                          Confirmar
                        </button>
                      )}
                      <button
                        onClick={() => cancelAppointment(appointment.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                  {currentUser?.role === 'patient' && appointment.status !== 'cancelada' && ( // Pacientes solo pueden cancelar sus propias citas
                    <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 md:ml-6">
                      <button
                        onClick={() => cancelAppointment(appointment.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        Cancelar Mi Cita
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinikAppointments;