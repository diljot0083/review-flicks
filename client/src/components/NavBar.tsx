import { AppBar, Toolbar, Box, Avatar, Menu, MenuItem, Button, useMediaQuery, useTheme } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import MovieIcon from "@mui/icons-material/Movie";
import { useEffect, useState } from "react";
import axios from "axios";

interface NavBarProps {
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavBar = ({ setIsLoggedIn }: NavBarProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [user, setUser] = useState<{ picture?: string; id: string } | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth/me`, {
          withCredentials: true,
        });
        if (res.data.success && res.data.user) setUser(res.data.user);
        else setUser(null);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth/logout`, { withCredentials: true });
      setUser(null);
      setIsLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      handleMenuClose();
    }
  };

  return (
    <AppBar position="static" sx={{ background: "#141E30", py: 0.4 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo */}
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer", flexShrink: 0 }}
          onClick={() => navigate("/")}
        >
          <MovieIcon sx={{ color: "purple", fontSize: "24px", mr: isSmallScreen ? 0.5 : 1 }} />
          <Box
            component="span"
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: isSmallScreen ? "1rem" : "1.25rem",
              whiteSpace: "nowrap",
            }}
          >
            Movie Review
          </Box>
        </Box>

        {/* Right Side Buttons */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "nowrap",
            gap: isSmallScreen ? "4px" : "10px",
          }}
        >
          {/* About & Contact */}
          <Button
            component={Link}
            to="/about"
            sx={{
              color: "white",
              textTransform: "none",
              fontSize: isSmallScreen ? "0.7rem" : "0.9rem",
              padding: isSmallScreen ? "3px 6px" : "6px 10px",
              minWidth: "fit-content",
              whiteSpace: "nowrap",
            }}
          >
            About Us
          </Button>
          <Button
            component={Link}
            to="/contact"
            sx={{
              color: "white",
              textTransform: "none",
              fontSize: isSmallScreen ? "0.7rem" : "0.9rem",
              padding: isSmallScreen ? "3px 6px" : "6px 10px",
              minWidth: "fit-content",
              whiteSpace: "nowrap",
            }}
          >
            Contact Us
          </Button>

          {/* Avatar only */}
          {user && (
            <>
              <Avatar
                src={user.picture}
                sx={{ width: 30, height: 30, cursor: "pointer" }}
                onClick={handleProfileClick}
              />
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
