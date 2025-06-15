// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // nickname, email 등 포함 가능

  useEffect(() => {
    const savedNickname = localStorage.getItem("nickname");
    if (savedNickname) {
      setIsLoggedIn(true);
      setUser({ nickname: savedNickname });
    }
  }, []);

  const login = (user) => {
    setIsLoggedIn(true);
    setUser(user);
    localStorage.setItem("nickname", user.nickname); // 🔥 이 줄 추가
  };

  const signup = (userInfo) => {
    // 회원가입 시 모든 정보 저장
    setIsLoggedIn(true);
    setUser(userInfo);
    localStorage.setItem("token", "mock_token");
    localStorage.setItem("nickname", userInfo.nickname);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("nickname");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
