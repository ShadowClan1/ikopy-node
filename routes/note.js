const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
//route 1 fetch notes
router.get("/notes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.userId });
    // const notes = await Notes.findOne({noten : req.body.noten})
    res.json(notes);
  } catch (error) {  
    res.status(404).json({ error });
  }
});
//route 2 create note
router.post("/createnote", fetchuser, async (req, res) => {
  try {
    // let note = await Notes.findOne({noten : req.body.noten});
    // if(note){

    //    res.status(573).json({error: "Notes were registered with this number"})
    // }
    // else{
    const note = await Notes.create({
      user: req.user.userId,
      title: req.body.title,
      description: req.body.description,
    });
    res.json(note);
    // }
  } catch (error) {
    res.status(572).json({ error: error.message });
  }
});

//route 3 update an existing note
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  //create a newNote object

  const newNote = {};
  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }

  //find the note to be update by id and update
  let note = await Notes.findById(req.params.id);
  if (!note) {
    return res.status(595).json({ error: "notes not found" });
  } else {
    if (note.user.toString() !== req.user.userId) {
      return res.status(597).json({ error: "no notes found" });
    } else {
      note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json(note);
    }
  }
});


//route 4 delete note
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    let note = await Notes.findOne({ _id: req.params.id });
    if (!note) {
      res.status(600).json({ error: "note not found" });
    } else {
      if (note.user.toString() !== req.user.userId) {
        res
          .status(600)
          .json({ error: "you dont have any authority to delete the note" });
      } else {
        note = await Notes.findByIdAndDelete(req.params.id);

        res.json({ success: "note has been deleted" });
      }
    }
  } catch (error) {
    res.status(599).json({ error: "note not found", message: error.message });
  }
});

module.exports = router;
