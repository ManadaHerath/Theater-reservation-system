import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { axiosPrivate } from "../../../api/axios";
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

const UpdateMovie = () => {
  const movie_id = useParams().id;
  const [actors, setActors] = useState([]);
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
    setActors([...actors, { name: "", avatar: "" }]);
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

  const movieData = async () => {
    try {
      const response = await axiosPrivate.get(
        `http://localhost:5001/movies/${movie_id}`
      );
      setMovie(response.data);
      setActors(response.data.actors);
      console.log("Movie data:", response.data);
    } catch (error) {
      console.error("Error fetching movie:", error);
    }
  };

  useEffect(() => {
    movieData();
  }, []);

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
      if (selectedCoverPhoto !== null || selectedMoviePoster !== null) {
        const photoResponse = await axiosPrivate.post(
          "/photo-upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const updatedMovie = {
          ...movie,
          poster_url: photoResponse.data[1].movie_poster,
          cover_photo: photoResponse.data[0].cover_photo,
        };
        console.log("Upload successful:", movie);
        console.log("cover_photo:", photoResponse.data[0]);
        console.log("movie_poster:", photoResponse.data[1]);
        setMovie(updatedMovie);

        const response = await axiosPrivate.patch(
          `http://localhost:5001/movies/${movie_id}`,
          {
            movie: updatedMovie,
            actors,
          }
        );
        if (response.status === 201) {
          setShowDialog(true);
        }
      } else {
        const response = await axiosPrivate.patch(
          `http://localhost:5001/movies/${movie_id}`,
          {
            movie: movie,
            actors,
          }
        );
        if (response.status === 201) {
          setShowDialog(true);
        }
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
          Update Movie
        </Typography>
        <form onSubmit={handleSubmit}>
          <BlueTextField
            fullWidth
            label="Movie Name"
            name="title"
            focused
            value={movie.title || ""}
            margin="normal"
            onChange={handleChange}
            required
          />
          <BlueTextField
            fullWidth
            label="Description"
            name="overview"
            margin="normal"
            focused
            value={movie.overview || ""}
            required
            multiline
            onChange={handleChange}
            rows={3}
          />
          <BlueTextField
            fullWidth
            label="Writer"
            name="movie_writter"
            margin="normal"
            focused
            onChange={handleChange}
            required
          />
          <BlueTextField
            fullWidth
            label="Director"
            name="movie_director"
            focused
            value={movie.movie_director || ""}
            margin="normal"
            onChange={handleChange}
            required
          />
          <BlueTextField
            fullWidth
            label="Released Date"
            name="released_date"
            type="date"
            value={
              movie.released_date
                ? new Date(movie.released_date).toISOString().split("T")[0]
                : ""
            }
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
            focused
            value={movie.trailer_video_url || ""}
            onChange={handleChange}
            required
          />
          <BlueTextField
            fullWidth
            label="Original Language"
            name="original_language"
            focused
            value={movie.original_language || ""}
            margin="normal"
            onChange={handleChange}
            required
          />
          <BlueTextField
            fullWidth
            label="Duration"
            name="duration"
            focused
            value={movie.duration || ""}
            margin="normal"
            onChange={handleChange}
            required
          />
          <BlueTextField
            fullWidth
            label="Rating"
            name="rating"
            margin="normal"
            focused
            value={movie.rating || ""}
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
          />
          <BlueTextField
            fullWidth
            label="Movie Poster"
            name="moviePoster"
            type="file"
            InputLabelProps={{ shrink: true }}
            margin="normal"
            onChange={handleMoviePosterChange}
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
                  focused
                  value={actor.name} // Bind the value to the actor's name
                  onChange={(e) =>
                    handleActorChange(index, "name", e.target.value)
                  }
                  margin="normal"
                  required
                  sx={{ flexGrow: 1, mr: 1 }}
                />
                <BlueTextField
                  label={`Actor Photo URL ${index + 1}`}
                  focused
                  value={actor.avatar} // Bind the value to the actor's avatar
                  onChange={(e) =>
                    handleActorChange(index, "avatar", e.target.value)
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
            <BlueButton type="submit" variant="contained">
              Submit
            </BlueButton>
          </Box>
        </form>

        {showDialog && <AlertDialog message={"Movie Updated Successfully!"} />}
      </Box>
    </Container>
  );
};

export default UpdateMovie;
