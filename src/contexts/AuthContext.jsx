// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
<<<<<<< HEAD
  // 1. isLoggedIn 상태를 localStorage에서 불러와 초기화합니다.
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user"); // 'user'라는 통합 키 사용
      return storedUser ? JSON.parse(storedUser).isLoggedIn : false;
    } catch (error) {
      console.error("Failed to parse isLoggedIn from localStorage:", error);
      return false;
    }
  });

  // 2. user 상태도 localStorage에서 불러와 초기화합니다.
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user"); // 'user'라는 통합 키 사용
      return storedUser ? JSON.parse(storedUser).userData : null;
    } catch (error) {
      console.error("Failed to parse user data from localStorage:", error);
      return null;
    }
  });

  // useEffect는 초기 로딩 시점에서는 불필요합니다.
  // useState의 초기화 함수에서 이미 localStorage를 읽어오기 때문입니다.
  // 다만, 외부에서 localStorage가 변경될 경우를 대비한 동기화 로직이 필요하다면 유지할 수 있습니다.
  // 여기서는 명시적인 초기화 로직이 useState에 있으므로, 이 useEffect는 제거하거나
  // localStorage의 외부 변경을 감지하는 용도로만 사용할 수 있습니다.
  /*
  useEffect(() => {
    // 이 useEffect는 사실상 위 useState 초기화 함수로 대체됩니다.
    // 만약 다른 탭에서 로그인/로그아웃이 발생했을 때를 대비하려면 이 로직을 유지하고,
    // window.addEventListener('storage', ...) 등을 사용할 수 있습니다.
    const savedUserData = localStorage.getItem("user");
    if (savedUserData) {
      try {
        const { isLoggedIn: storedIsLoggedIn, userData: storedUserData } = JSON.parse(savedUserData);
        setIsLoggedIn(storedIsLoggedIn);
        setUser(storedUserData);
      } catch (error) {
        console.error("Error parsing user data from localStorage on mount:", error);
        setIsLoggedIn(false);
        setUser(null);
      }
    }
  }, []);
  */

  const login = (userData) => {
    // user를 userData로 변경하여 명확하게 합니다.
    setIsLoggedIn(true);
    setUser(userData);
    // 3. 로그인 시 isLoggedIn과 userData를 함께 'user'라는 키로 localStorage에 저장합니다.
    localStorage.setItem(
      "user",
      JSON.stringify({ isLoggedIn: true, userData })
    );
=======
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
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
  };

  const signup = (userInfo) => {
    // 회원가입 시 모든 정보 저장
    setIsLoggedIn(true);
    setUser(userInfo);
<<<<<<< HEAD
    // 4. signup 시에도 user 정보를 통합하여 저장합니다.
    localStorage.setItem(
      "user",
      JSON.stringify({ isLoggedIn: true, userData: userInfo })
    );
    // 기존 token 저장은 유지하거나 제거할 수 있습니다. (필요에 따라)
    localStorage.setItem("token", "mock_token");
=======
    localStorage.setItem("token", "mock_token");
    localStorage.setItem("nickname", userInfo.nickname);
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
<<<<<<< HEAD
    // 5. 로그아웃 시 'user' 키와 'token' 키 모두 제거합니다.
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // 기존 token 제거 유지
=======
    localStorage.removeItem("token");
    localStorage.removeItem("nickname");
>>>>>>> 006c325297d01cc01f41955b9c1496cd26d394b8
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
