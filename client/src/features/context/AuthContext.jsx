import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../../lib/api/client';

const AuthContext = createContext();

const DEMO_USERS = [
  {
    id: 1,
    name: 'HAMUTUK Administrator',
    email: 'admin@hamutuk.local',
    role: 'ADMIN',
    area: 'Munisípiu Viqueque (Sentrál)',
    phone: '+670 7723 4567'
  },
  {
    id: 2,
    name: 'Mateus da Costa',
    email: 'mateus.suco@hamutuk.local',
    role: 'SUCO_OFFICER',
    area: 'Postu Uato-Lari, Suku Macadique',
    phone: '+670 7789 1234'
  },
  {
    id: 3,
    name: 'Helena Pinto Soares',
    email: 'helena.coord@hamutuk.local',
    role: 'MUNICIPAL_COORDINATOR',
    area: 'Munisípiu Viqueque',
    phone: '+670 7812 9988'
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('hamutuk_auth_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USERS[1]; // Default to Suco Officer for offline prototype demo
      }
    }
    return DEMO_USERS[1];
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('hamutuk_auth_token') || 'demo_mock_jwt_token_for_viqueque';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('hamutuk_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hamutuk_auth_user');
    }
  }, [user]);

  // Attempt to exchange mock/demo token for a real signed JWT from backend API if online
  useEffect(() => {
    const currentToken = localStorage.getItem('hamutuk_auth_token');
    if (
      !currentToken ||
      currentToken.startsWith('demo_') ||
      currentToken.startsWith('jwt_mock_') ||
      currentToken === 'demo_mock_jwt_token_for_viqueque'
    ) {
      const email = user?.email || 'admin@hamutuk.local';
      const password = user?.role === 'ADMIN' ? 'Admin123456!' : 'password123';
      api.login({ email, password })
        .then((res) => {
          if (res.data?.success && res.data?.token) {
            setToken(res.data.token);
            localStorage.setItem('hamutuk_auth_token', res.data.token);
            if (res.data.user) {
              setUser(res.data.user);
              localStorage.setItem('hamutuk_auth_user', JSON.stringify(res.data.user));
            }
          }
        })
        .catch(() => {
          // Offline, gracefully keep local session
        });
    }
  }, []);

  const login = async (emailOrUsername, password) => {
    // 1. Try real backend authentication
    try {
      const res = await api.login({ email: emailOrUsername, password });
      if (res.data?.success && res.data?.token) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('hamutuk_auth_token', res.data.token);
        localStorage.setItem('hamutuk_auth_user', JSON.stringify(res.data.user));
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      console.warn('Real API login failed, attempting local fallback:', err.message);
    }

    // 2. Offline / local fallback
    const found = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === emailOrUsername.toLowerCase() ||
             u.name.toLowerCase().includes(emailOrUsername.toLowerCase())
    );

    if (found && (password === 'password123' || password === 'Admin123456!' || password.length >= 4)) {
      const demoToken = 'jwt_mock_' + found.role.toLowerCase() + '_' + Date.now();
      setUser(found);
      setToken(demoToken);
      localStorage.setItem('hamutuk_auth_token', demoToken);
      return { success: true, user: found };
    }

    return { success: false, message: 'Kredensiál la loos. Kuantan uza konta demo.' };
  };

  const loginAsDemo = async (role) => {
    const target = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[1];
    const password = target.role === 'ADMIN' ? 'Admin123456!' : 'password123';

    try {
      const res = await api.login({ email: target.email, password });
      if (res.data?.success && res.data?.token) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem('hamutuk_auth_token', res.data.token);
        localStorage.setItem('hamutuk_auth_user', JSON.stringify(res.data.user));
        return;
      }
    } catch (err) {
      console.warn('Real API login unavailable for demo switch, using offline demo session:', err.message);
    }

    // Offline fallback
    setUser(target);
    const demoToken = 'demo_' + role.toLowerCase() + '_token';
    setToken(demoToken);
    localStorage.setItem('hamutuk_auth_token', demoToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hamutuk_auth_user');
    localStorage.removeItem('hamutuk_auth_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        loginAsDemo,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isCoordinator: user?.role === 'MUNICIPAL_COORDINATOR' || user?.role === 'ADMIN',
        isSucoOfficer: user?.role === 'SUCO_OFFICER'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
