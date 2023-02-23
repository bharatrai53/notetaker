const fs = require("fs");
const util = require("util");
const router = require("express").Router();
const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

let notesData = [];

// GET request
router.get("/notes", (req, res) => {
  // Read notes from JSON file
  readFileAsync("db/db.json", "utf8")
    .then(function (data) {
      // Parse data to get an array of objects
      notesData = JSON.parse(data);
      // Send notesData as response
      res.json(notesData);
    })
    .catch(function (error) {
      // Send error response
      res.status(500).send(error);
    });
});

// POST request
router.post("/notes", (req, res) => {
  readFileAsync("db/db.json", "utf8")
    .then(function (data) {
      // Parse data to get an array of objects
      notesData = JSON.parse(data);

      const newNote = req.body;
      const currentID = notesData.length;

      newNote.id = currentID + 1;
      // Add new note 
      notesData.push(newNote);

      notesData = JSON.stringify(notesData, null, 2);

      writeFileAsync("db/db.json", notesData)
        .then(function () {
          // Send success response with updated notesData
          res.json(notesData);
        })
        .catch(function (error) {
          // Send error response
          res.status(500).send(error);
        });
    })
    .catch(function (error) {
      // Send error response
      res.status(500).send(error);
    });
});

// DELETE request
router.delete("/notes/:id", (req, res) => {
  const selID = parseInt(req.params.id);

  for (let i = 0; i < notesData.length; i++) {
    if (selID === notesData[i].id) {
      notesData.splice(i, 1);
      const noteJSON = JSON.stringify(notesData, null, 2);

      writeFileAsync("db/db.json", noteJSON)
        .then(function () {
          // Send success response with updated notesData
          res.json(notesData);
        })
        .catch(function (error) {
          // Send error response
          res.status(500).send(error);
        });
      return;
    }
  }
  // If note is not found, send error response
  res.status(404).send("Note not found");
});

module.exports = router;
