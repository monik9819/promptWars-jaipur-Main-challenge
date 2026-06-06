export const getUsers = () => {
  const users = localStorage.getItem('mindease_users');
  return users ? JSON.parse(users) : {};
};

export const saveUser = (user) => {
  const users = getUsers();
  users[user.email] = user;
  localStorage.setItem('mindease_users', JSON.stringify(users));
};

export const getUser = (email) => {
  return getUsers()[email];
};

export const getSession = () => {
  const session = sessionStorage.getItem('mindease_session');
  return session ? JSON.parse(session) : null;
};

export const saveSession = (sessionData) => {
  sessionStorage.setItem('mindease_session', JSON.stringify(sessionData));
};

export const clearSession = () => {
  sessionStorage.removeItem('mindease_session');
};

export const getCheckins = (email) => {
  const checkins = localStorage.getItem(`mindease_checkins_${email}`);
  return checkins ? JSON.parse(checkins) : [];
};

export const saveCheckin = (email, checkin) => {
  const checkins = getCheckins(email);
  checkins.unshift(checkin); // Add to the beginning
  localStorage.setItem(`mindease_checkins_${email}`, JSON.stringify(checkins));
};
