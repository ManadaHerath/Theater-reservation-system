import React, { useState } from "react";
import {
  Button,
  TextField,
  IconButton,
  Container,
  Typography,
  Box,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { styled } from "@mui/system";

const BlueButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#1976d2",
  color: "#fff",
  "&:hover": {
    backgroundColor: "#004ba0",
  },
}));

const BlueTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#1976d2", // Blue color
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#1976d2",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#1976d2",
    },
    "&:hover fieldset": {
      borderColor: "#115293",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1976d2",
    },
  },
});

const AddNewMovie = () => {
  const [actors, setActors] = useState([{ name: "", photo: null }]);

  const handleAddActor = () => {
    setActors([...actors, { name: "", photo: null }]);
  };

  const handleRemoveActor = (index) => {
    const newActors = actors.filter((_, i) => i !== index);
    setActors(newActors);
  };

  const handleActorChange = (index, field, value) => {
    const newActors = actors.map((actor, i) =>
      i === index ? { ...actor, [field]: value } : actor
    );
    setActors(newActors);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", {
      movieName: event.target.movieName.value,
      description: event.target.description.value,
      writer: event.target.writer.value,
      director: event.target.director.value,
      releaseDate: event.target.releaseDate.value,
      coverPhoto: event.target.coverPhoto.files[0],
      actors,
    });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          bgcolor: "#f0f4f8",
          borderRadius: 3,
          boxShadow: 3,
          p: 4,
          mt: 5,
          mb: 5,
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, color: "#1976d2" }}>
          Add New Movie
        </Typography>
        <form onSubmit={handleSubmit}>
          <BlueTextField
            fullWidth
            label="Movie Name"
            name="movieName"
            margin="normal"
            required
          />
          <BlueTextField
            fullWidth
            label="Description"
            name="description"
            margin="normal"
            required
            multiline
            rows={3}
          />
          <BlueTextField
            fullWidth
            label="Writer"
            name="writer"
            margin="normal"
            required
          />
          <BlueTextField
            fullWidth
            label="Director"
            name="director"
            margin="normal"
            required
          />
          <BlueTextField
            fullWidth
            label="Release Date"
            name="releaseDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            margin="normal"
            required
          />
          <Typography variant="h6" sx={{ mt: 2, color: "#1976d2" }}>
            Actors
          </Typography>
          {actors.map((actor, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", mt: 1 }}
            >
              <div className="flex flex-col md:flex-row items-center justify-center">
                <BlueTextField
                  label={`Actor Name ${index + 1}`}
                  value={actor.name}
                  onChange={(e) =>
                    handleActorChange(index, "name", e.target.value)
                  }
                  margin="normal"
                  required
                  sx={{ flexGrow: 1, mr: 1 }}
                />
                <input
                  accept="image/*"
                  type="file"
                  onChange={(e) =>
                    handleActorChange(index, "photo", e.target.files[0])
                  }
                  required
                />
                <IconButton
                  onClick={() => handleRemoveActor(index)}
                  sx={{ color: "#d32f2f" }}
                >
                  <RemoveCircleIcon />
                </IconButton>
              </div>
            </Box>
          ))}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <IconButton onClick={handleAddActor} sx={{ color: "#1976d2" }}>
              <AddCircleIcon fontSize="large" />
            </IconButton>
          </Box>
          <BlueTextField
            fullWidth
            label="Movie Cover"
            name="coverPhoto"
            type="file"
            InputLabelProps={{ shrink: true }}
            margin="normal"
            required
          />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <BlueButton type="submit" variant="contained">
              Submit
            </BlueButton>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default AddNewMovie;
