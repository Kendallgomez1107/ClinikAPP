import React from 'react';

const ClinikHome = ({ onViewChange }) => {
  const features = [
    {
      icon: '📅',
      title: 'Agenda tu Cita',
      description: 'Reserva citas médicas de forma rápida y sencilla con nuestros especialistas.',
      action: () => onViewChange('appointments')
    },
    {
      icon: '👨‍⚕️',
      title: 'Nuestros Médicos',
      description: 'Conoce a nuestro equipo de profesionales especializados en diferentes áreas.',
      action: () => onViewChange('doctors')
    },
    {
      icon: '🏥',
      title: 'Atención Integral',
      description: 'Brindamos servicios médicos completos con la más alta calidad y tecnología.'
    },
    {
      icon: '⏰',
      title: 'Horarios Flexibles',
      description: 'Disponibilidad de lunes a viernes con horarios que se adaptan a tu rutina.'
    }
  ];

  const stats = [
    { number: '500+', label: 'Pacientes Atendidos' },
    { number: '15+', label: 'Especialistas' },
    { number: '98%', label: 'Satisfacción' },
    { number: '24/7', label: 'Disponibilidad' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Tu Salud es Nuestra
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Prioridad
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Sistema integral de gestión médica que conecta pacientes con profesionales de la salud. 
            Agenda citas, consulta especialistas y lleva el control de tu historial médico.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onViewChange('appointments')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Agendar Cita Ahora
            </button>
            <button
              onClick={() => onViewChange('doctors')}
              className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200"
            >
              Ver Especialistas
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir ClinikApp?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ofrecemos una experiencia médica moderna, eficiente y centrada en el paciente.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group cursor-pointer"
                onClick={feature.action}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para cuidar tu salud?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Únete a cientos de pacientes que ya confían en nosotros para su atención médica.
          </p>
          <button
            onClick={() => onViewChange('appointments')}
            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Comenzar Ahora
          </button>
        </div>
      </section>
    </div>
  );
};

export default ClinikHome;