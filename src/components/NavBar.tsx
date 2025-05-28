import { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MovieIcon from "@mui/icons-material/Movie";

interface NavBarProps {
  setGenreFilter: (genre: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ setGenreFilter }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  // Open Categories Dropdown
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Close Categories Dropdown
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ background: "#141E30", padding: "10px" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
          <MovieIcon sx={{ color: "purple", fontSize: "28px", marginRight: "8px" }} />
          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold" }}>
            Movie Review
          </Typography>
        </Box>

        <Box>
          <Button
            sx={{
              color: "white",
              border: "2px solid white",
              borderRadius: "8px",
              marginRight: "10px",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
            }}
            onClick={handleMenuOpen}
          >
            Categories
          </Button>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => { setGenreFilter("Action"); handleMenuClose(); }}>Action</MenuItem>
            <MenuItem onClick={() => { setGenreFilter("Drama"); handleMenuClose(); }}>Drama</MenuItem>
            <MenuItem onClick={() => { setGenreFilter("Comedy"); handleMenuClose(); }}>Comedy</MenuItem>
            <MenuItem onClick={() => { setGenreFilter("Horror"); handleMenuClose(); }}>Horror</MenuItem>
          </Menu>
          
          <Button
            component={Link}
            to="/about"
            sx={{ color: "white", marginLeft: "10px", textTransform: "none" }}
          >
            About Us
          </Button>
          <Button
            component={Link}
            to="/contact"
            sx={{ color: "white", marginLeft: "10px", textTransform: "none" }}
          >
            Contact Us
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
