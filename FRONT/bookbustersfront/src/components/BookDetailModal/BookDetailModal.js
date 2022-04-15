import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import bookContext from "../../contexts/BookContext";
import bookDefaultCover from "../../assets/img/simpson.jpg";
import { Button, IconButton, Stack, Tooltip } from "@mui/material";

// Import des icones pour la modale
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookIcon from "@mui/icons-material/Book";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import VolunteerActivismOutlinedIcon from "@mui/icons-material/VolunteerActivismOutlined";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import AddAlertOutlinedIcon from "@mui/icons-material/AddAlertOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { updateBookStatus } from "../../api/fetchApi";

const styleBox = {
  position: "absolute",
  top: { xs: "50%", md: "50%" },
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  bgcolor: "background.paper",
  boxShadow: 20,
  p: 2,
  maxHeight: "90vh",
  overflowY: "auto",
  borderRadius: "5px",
};

function BookDetailModal() {
  const { openedBook, setOpenedBook } = useContext(bookContext);
  const [library, setLibrary] = useState(true);
  const [favorit, setFavorit] = useState(true);
  const [alert, setAlert] = useState(true);
  const [donation, setDonation] = useState(true);

  if (!openedBook) return null;
  const book = openedBook;
  const users = book.donors;

  // Inverser tout de suite la valeur de l'état pour des questions de cycles de vie
  // nous sommes dans le meme cycle de vie
  const handleUpdateBookStatus = async (statusToUpdate) => {
    let bookStatus = {
      library,
      favorit,
      donation,
      alert,
      isbn10: book.isbn10,
      isbn13: book.isbn13,
    };
    switch (statusToUpdate) {
      case "library":
        setLibrary(!library);
        bookStatus.library = !library;
        break;
      case "favorit":
        setFavorit(!favorit);
        bookStatus.favorit = !favorit;
        break;
      case "donation":
        setDonation(!donation);
        bookStatus.donation = !donation;
        break;
      case "alert":
        setAlert(!alert);
        bookStatus.alert = !alert;
        break;
      default:
        break;
    }

    const result = await updateBookStatus(bookStatus);

    if (result) {
      const updatedStatus = {
        library: result.conected_user.is_in_library,
        favorit: result.conected_user.is_in_favorite,
        alert: result.connected_user.is_in_alert,
        donation: result.connected_user.is_in_donation,
      };
      setLibrary(updatedStatus.library);
      setFavorit(updatedStatus.favorit);
      setAlert(updatedStatus.alert);
      setDonation(updatedStatus.donation);
    }
  };

  const handleCloseModal = () => {
    setOpenedBook(null);
  };

  return (
    <Modal
      open={Boolean(openedBook)}
      onClose={() => setOpenedBook(null)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{
        position: "fixed",
      }}
    >
      <Box sx={styleBox}>
        <Box sx={{ textAlign: "right" }}>
          <IconButton onClick={handleCloseModal}>
            <CloseIcon sx={{ color: "black" }} fontSize="small" />
          </IconButton>
        </Box>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ textAlign: "center", mb: 2 }}
        >
          {book.title}
        </Typography>
        {/* Zone des cover des livres */}
        <Box sx={{ display: { xs: "block", md: "flex" } }}>
          <Box
            sx={{
              maxWidth: { xs: "250px", md: "500px" },
              height: "auto",
              padding: { xs: "auto", md: "0px 20px 15px 0px" },
            }}
          >
            {book.cover ? (
              <img
                className="imageCovers"
                alt="Book cover"
                src={book.cover}
              ></img>
            ) : (
              <img
                className="imageCovers"
                alt="Generic book cover"
                src={bookDefaultCover}
              ></img>
            )}
          </Box>
          {/* Zone des icones d'interactions */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Tooltip
              title="Ajoutez ce livre à vos favoris"
              arrow
              placement="right"
            >
              <IconButton
                onClick={() => {
                  handleUpdateBookStatus("favorit");
                }}
              >
                {favorit ? (
                  <FavoriteIcon sx={{ color: "red" }} />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Ajoutez ce livre à votre bilbiothèque"
              arrow
              placement="right"
            >
              <IconButton
                onClick={() => {
                  handleUpdateBookStatus("library");
                }}
              >
                {library ? (
                  <BookIcon sx={{ color: "brown" }} />
                ) : (
                  <BookOutlinedIcon />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Activez la donation pour ce livre"
              arrow
              placement="right"
            >
              {/*Déclaration de fonction pour ne pas déclencher le onClick au
              chargement de la page*/}
              <IconButton
                onClick={() => {
                  handleUpdateBookStatus("donation");
                }}
              >
                {donation ? (
                  <VolunteerActivismIcon sx={{ color: "blue" }} />
                ) : (
                  <VolunteerActivismOutlinedIcon />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip
              title="Ajoutez une alerte pour ce livre"
              arrow
              placement="right"
            >
              <IconButton
                onClick={() => {
                  handleUpdateBookStatus("alert");
                }}
              >
                {alert ? (
                  <AddAlertIcon sx={{ color: "green" }} />
                ) : (
                  <AddAlertOutlinedIcon />
                )}
              </IconButton>
            </Tooltip>
          </Box>
          {/* Zone des textes */}
          <Box
            id="modal-modal-description"
            sx={{ margin: "0px 15px 0px 15px" }}
          >
            <Typography variant="overline">Auteur:</Typography>
            <Typography>{book.author}</Typography>
            <Box
              sx={{
                display: { md: "inline" },
              }}
            >
              <Typography variant="overline"> Résumé:</Typography>
              {book.resume ? (
                <Box>{book.resume}</Box>
              ) : (
                <Typography>Pas de résumé trouvé pour ce livre.</Typography>
              )}
            </Box>
          </Box>
        </Box>
        {/* Zone des donateurs */}
        <Stack>
          {users && users.length > 0 && (
            <>
              <Typography variant="h5" align="center">
                Livre disponible chez
              </Typography>
              {users.map((user, index) => (
                <Box
                  className="bookUserOwner"
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Typography align="center" sx={{ width: "50%" }}>
                    {user?.username}
                  </Typography>
                  <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    sx={{ width: "50%" }}
                  >
                    Contactez cette personne
                  </Button>
                </Box>
              ))}
            </>
          )}
          {(!users || users.length === 0) && (
            <>
              <Typography>Personne ne possède le livre !</Typography>
            </>
          )}
        </Stack>
      </Box>
    </Modal>
  );
}

export default BookDetailModal;
