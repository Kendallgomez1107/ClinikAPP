export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (timeString) => {
  return timeString;
};

export const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const getMinDate = () => {
  return getTodayDate();
};

export const getDayOfWeek = (dateString) => {
  const date = new Date(dateString);
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
};

export const isTimeAvailable = (doctor, date, time, existingAppointments) => {
  const dayOfWeek = getDayOfWeek(date);
  const doctorSchedule = doctor.schedule[dayOfWeek] || [];
  
  if (!doctorSchedule.includes(time)) {
    return false;
  }

  const isBooked = existingAppointments.some(apt => 
    apt.doctorId === doctor.id && 
    apt.date === date && 
    apt.time === time &&
    apt.status !== 'cancelada'
  );

  return !isBooked;
};