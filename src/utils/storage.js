export const createStorage = (key, defaultValue = null) => {
  const get = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  const set = (value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      return false;
    }
  };

  const remove = () => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  };

  return { get, set, remove };
};

export const appointmentStorage = createStorage('clinik_appointments', []);
export const patientStorage = createStorage('clinik_patients', []);
export const currentUserStorage = createStorage('clinik_current_user', null);