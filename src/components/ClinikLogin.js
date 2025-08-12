import React, { useState } from 'react';
import { currentUserStorage } from '../utils/storage';
import { doctors } from '../mock/doctors'; // Importar la lista de doctores

const ClinikLogin = ({ onLogin, onViewChange }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'patient'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      let role = 'patient';
      let userName = 'Usuario';

      // Lógica para determinar el rol y el nombre de usuario al iniciar sesión
      if (formData.email === 'admin@clinik.com') {
        role = 'admin';
        userName = 'Administrador';
      } else {
        // Buscar si el email coincide con algún doctor
        const doctorFound = doctors.find(doc => doc.email === formData.email);
        if (doctorFound) {
          role = 'doctor';
          userName = doctorFound.name; // Usar el nombre del doctor del mock
        } else {
          // Si no es admin ni doctor, es paciente
          role = 'patient';
          // Aquí podrías buscar el nombre del paciente si tuvieras un mock de pacientes con emails
          // Por ahora, se queda como 'Usuario'
        }
      }

      const userData = {
        id: Date.now(),
        name: userName,
        email: formData.email,
        role: role
      };
      
      currentUserStorage.set(userData);
      onLogin(userData);
    } else {
      // Simulación de registro
      // Al registrarse, el rol siempre será 'patient'
      const userData = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: 'patient' // Siempre 'patient' al registrarse
      };
      
      currentUserStorage.set(userData);
      onLogin(userData);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isLogin ? 'Accede a tu cuenta de ClinikApp' : 'Únete a ClinikApp'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
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
                  placeholder="Tu nombre completo"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-700 font-medium mb-2">Cuentas de prueba:</p>
            <p className="text-xs text-blue-600">
              Email Admin: admin@clinik.com<br />
              Email Doctor: maria.gonzalez@clinik.com (o cualquier email de mock/doctors.js)<br />
              Contraseña: cualquiera (para todos)
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => onViewChange('home')}
            className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinikLogin;