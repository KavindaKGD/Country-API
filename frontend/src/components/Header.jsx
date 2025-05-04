import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    // Get user data from localStorage
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUsername(userData.username || "User");
      } catch (err) {
        setUsername("User");
      }
    }
  }, []);

  // Handle clicks outside user menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md py-4 px-4 sm:px-6 flex justify-between items-center sticky top-0 z-20">
      <h1
        onClick={() => navigate("/home")}
        className="text-xl sm:text-2xl font-bold text-blue-700 cursor-pointer flex items-center gap-2 hover:text-blue-800 transition-colors"
        role="button"
        tabIndex="0"
        aria-label="Go to home page"
      >
        <span className="text-2xl sm:text-3xl">🌍</span>
        <span className="inline">Country Explorer</span>
      </h1>
      
      <nav className="flex gap-2 sm:gap-4 items-center">
        {location.pathname !== "/home" && (
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
            aria-label="Go to home page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-7-7v14" />
            </svg>
            <span className="hidden sm:inline">Home</span>
          </button>
        )}
        {location.pathname !== "/favorites" && (
          <button
            onClick={() => navigate("/favorites")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-yellow-600 hover:bg-yellow-50 transition-colors"
            aria-label="View favorites"
          >
            <span className="text-xl">⭐</span>
            <span className="hidden sm:inline">Favorites</span>
          </button>
        )}
        
        {/* User profile section */}
        <div className="relative ml-1" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-blue-700 hover:bg-blue-50 border border-blue-100 transition-colors"
            aria-label="User menu"
            aria-expanded={showUserMenu}
            aria-haspopup="true"
          >
            <div className="h-7 w-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium text-sm">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline max-w-[100px] truncate">{username}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg py-1 w-48 z-30">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900 truncate">Signed in as</p>
                <p className="text-sm text-gray-600 truncate">{username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
