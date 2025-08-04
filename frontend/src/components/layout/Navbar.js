import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import { Sun, Moon, LogOut, BarChart3 } from "lucide-react";
import { Button } from "../ui/Button";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-card shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold text-primary"
          >
            <BarChart3 size={28} />
            <span>DataStream Hub</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            {user ? (
              <>
                <span className="hidden sm:inline text-sm text-secondary">
                  欢迎, {user.username}!
                </span>
                <Button onClick={handleLogout} variant="ghost">
                  <LogOut className="h-5 w-5 mr-2" />
                  登出
                </Button>
              </>
            ) : (
              <div className="space-x-2">
                <Button asChild variant="ghost">
                  <Link to="/login">登录</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">注册</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
