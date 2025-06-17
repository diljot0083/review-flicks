import { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box, useMediaQuery, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MovieIcon from "@mui/icons-material/Movie";

interface NavBarProps {
  setGenreFilter: (genre: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ setGenreFilter }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleGenreClick = (genre: string) => {
    setGenreFilter(genre);
    handleMenuClose();
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
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: isSmallScreen ? "1rem" : "1.25rem",
              whiteSpace: "nowrap",
            }}
          >
            Movie Review
          </Typography>
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
          {/* Categories Button */}
          <Button
            sx={{
              color: "white",
              border: "1px solid white",
              borderRadius: "6px",
              textTransform: "none",
              fontSize: isSmallScreen ? "0.7rem" : "0.9rem",
              padding: isSmallScreen ? "3px 6px" : "6px 10px",
              minWidth: "fit-content",
              whiteSpace: "nowrap",
            }}
            onClick={handleMenuOpen}
          >
            Categories
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            {["Action", "Drama", "Comedy", "Horror"].map((genre) => (
              <MenuItem key={genre} onClick={() => handleGenreClick(genre)}>
                {genre}
              </MenuItem>
            ))}
          </Menu>

          {/* About & Contact Buttons */}
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
