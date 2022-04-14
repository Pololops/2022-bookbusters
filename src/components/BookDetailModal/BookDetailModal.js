import React, { useState, useContext } from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
//import { CardActionArea } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import PLS from "../../assets/img/simpson.jpg";
import bookContext from "../../contexts/BookContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function BookDetailModal() {
  const handleClose = () => setOpen(false);
  const [open, setOpen] = useState(false);
  const { openedBook, setOpenedBook } = useContext(bookContext);

  function livrePLS() {
    // permet de charger une cover de livre si la base de donnée n'en renvoi pas
    if (livre.cover === undefined) {
      return PLS;
    } else {
      return livre.cover;
    }
  }

  function textPLS() {
    // permet de charger un resumer de livre si celui-ci n'en dispose pas
    if (livre.resume === undefined) {
      return <>Résumé pas trouvé dans la base de donnée.</>;
    } else {
      return livre.resume;
    }
  }

  if (!openedBook) return null;

  const livre = openedBook;
  const users = livre.donors;

  return (
    <div>
      <Modal
        open={Boolean(openedBook)}
        onClose={() => setOpenedBook(null)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ textAlign: "center", mb: 2 }}
          >
            {livre.title}
          </Typography>

          <Box sx={{ display: { xs: "block", md: "flex" } }}>
            <CardMedia
              component="img"
              image={livrePLS()}
              alt="seigneur"
              sx={{ mr: 2 }}
            />

            <Box id="modal-modal-description" sx={{ mt: 2 }}>
              <p>
                <b>Auteur:</b> {livre.author}{" "}
              </p>

              <Box component="p" sx={{ display: { xs: "none", md: "inline" } }}>
                <b>Résumé: </b> {textPLS()}
              </Box>
            </Box>
          </Box>
          <Box>
            {users && users.length > 0 && (
              <>
                Livre disponible chez :{" "}
                {users.map((user, index) => (
                  <span className="bookUserOwner" key={index}>
                    {user.username}
                  </span>
                ))}
              </>
            )}
            {(!users || users.length === 0) && (
              <>
                <Typography>Personne ne possède le livre !</Typography>
              </>
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default BookDetailModal;
