import { Card, CardMedia, CardContent, Typography } from "@mui/material";

interface MovieCardProps {
  imdbID: string;
  title: string;
  imageUrl: string;
  plot?: string;
  onClick: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, imageUrl, plot, onClick }) => {
  return (
    <Card 
      sx={{ 
        width: 250, 
        backgroundColor: "#1c1c1c", 
        color: "white", 
        padding: "10px", 
        cursor: "pointer", 
        transition: "transform 0.2s", 
        "&:hover": { transform: "scale(1.05)" } 
      }}
      onClick={onClick}
    >
      <CardMedia component="img" height="300" image={imageUrl} alt={title} />
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        {plot && (
          <Typography variant="body2" color="gray">
            {plot.length > 100 ? plot.substring(0, 100) + "..." : plot}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MovieCard;
