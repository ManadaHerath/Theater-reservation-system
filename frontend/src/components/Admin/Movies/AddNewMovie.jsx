import React, { useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import AlertDialog from "./DialogBox";
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
  const axiosPrivate = useAxiosPrivate();
  const [actors, setActors] = useState([{ name: "", photo_url: "" }]);
  const [submitted, setSubmitted] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [movie, setMovie] = useState({
    title: "",
    trailer_video_url: "",
    poster_url: "",
    overview: "",
    released_date: "",
    duration: "",
    original_language: "",
    movie_director: "",
    movie_writer: "",
    cover_photo: "",
    rating: "",
  });

  const handleAddActor = () => {
    setActors([...actors, { name: "", photo_url: "" }]);
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
  const handleChange = (e) => {
    setMovie({ ...movie, [e.target.name]: e.target.value });
  };
  const [selectedCoverPhoto, setSelectedCoverPhoto] = useState(null);
  const [selectedMoviePoster, setSelectedMoviePoster] = useState(null);

  const handleCoverPhotoChange = (event) => {
    setSelectedCoverPhoto(event.target.files[0]);
  };
  const handleMoviePosterChange = (event) => {
    setSelectedMoviePoster(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    setSubmitted(true);
    event.preventDefault();
    const formData = new FormData();
    formData.append("cover_photo", selectedCoverPhoto);
    formData.append("movie_poster", selectedMoviePoster);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const photoResponse = await axiosPrivate.post("/photo-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const updatedMovie = {
        ...movie,
        poster_url: photoResponse.data[1].movie_poster,
        cover_photo: photoResponse.data[0].cover_photo,
      };
      console.log("Upload successful:", movie);
      console.log("cover_photo:", photoResponse.data[0]);
      console.log("movie_poster:", photoResponse.data[1]);
      setMovie(updatedMovie);

      const response = await axiosPrivate.post("/movies", {
        movie: updatedMovie,
        actors,
      });
      if (response.status === 201) {
        setShowDialog(true);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
    console.log("Form submitted:");
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
            name="title"
            margin="normal"
            onChange={handleChange}
            required
          />
          <BlueTextField
            fullWidth
            label="Description"
            name="overview"
            margin="normal"
            required
            multiline
            onChange={handleChange}
            rows={3}
          />
          <BlueTextField
            fullWidth
            label="Writer"
            name="movie_writer"
            margin="normal"
            onChange={handleChange}
            required
          />
          <BlueTextField
            fullWidth
            label="Director"
            name="movie_director"
            margin="normal"
            onChange={handleChange}
            required
          />
          <BlueTextField
            fullWidth
            label="Released Date"
            name="released_date"
            type="date"
            InputLabelProps={{ shrink: true }}
            margin="normal"
            onChange={handleChange}
            required
          />

          <BlueTextField
            fullWidth
            label="Trailer Video Url"
            name="trailer_video_url"
            margin="normal"
            onChange={handleChange}
            required
          />
          <BlueTextField
            fullWidth
            label="Original Language"
            name="original_language"
            margin="normal"
            onChange={handleChange}
            required
          />
          <BlueTextField
            fullWidth
            label="Duration"
            name="duration"
            margin="normal"
            onChange={handleChange}
            required
          />
          <BlueTextField
            fullWidth
            label="Rating"
            name="rating"
            margin="normal"
            onChange={handleChange}
            required
          />
          <BlueTextField
            fullWidth
            label="Movie Cover"
            name="coverPhoto"
            type="file"
            InputLabelProps={{ shrink: true }}
            margin="normal"
            onChange={handleCoverPhotoChange}
            required
          />
          <BlueTextField
            fullWidth
            label="Movie Poster"
            name="moviePoster"
            type="file"
            InputLabelProps={{ shrink: true }}
            margin="normal"
            onChange={handleMoviePosterChange}
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
                <BlueTextField
                  label={`Actor Photo URL ${index + 1}`}
                  value={actor.photo_url}
                  onChange={(e) =>
                    handleActorChange(index, "photo_url", e.target.value)
                  }
                  margin="normal"
                  required
                  sx={{ flexGrow: 1, mr: 1 }}
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

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <BlueButton type="submit" variant="contained" disabled={submitted}>
              Submit
            </BlueButton>
          </Box>
        </form>

        {showDialog && (
          <AlertDialog message={"Movie Added Successfully!"} reload={true} />
        )}
      </Box>
    </Container>
  );
};

export default AddNewMovie;
