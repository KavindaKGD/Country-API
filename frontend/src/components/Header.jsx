import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
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
        <span className="hidden xs:inline">Country Explorer</span>
      </h1>
      
      <nav className="flex gap-2 sm:gap-4">
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
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-red-600 hover:bg-red-50 transition-colors"
          aria-label="Logout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </nav>
    </header>
  );
}
