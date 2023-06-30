import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getNotes: RequestHandler = async (req, res, next) => {
    try {
      //LEARN: The .exec() method is used to execute the Promise. Without it, the request would not return a promise.
      const notes = await NoteModel.find().exec();
      res.status(200).json(notes);
    } catch (error) {
      next(error);
    }
  }

  //QUESTION: Why no interface here? Because the params are not in the request body? -yes
  export const getNote: RequestHandler = async (req, res, next) => {
    const {noteId, number} = req.params;
    console.log({number})

    try {
        //LEARN: isValidObjectId is a static method of the mongoose class. It returns true if the value is a valid ObjectId, otherwise false. It does not throw an error if the value is not a valid ObjectId. It is used to validate that a value passed to a route parameter is a valid ObjectId. If it is not a valid ObjectId, then we throw an error.
        if (!mongoose.isValidObjectId(noteId)) {
          throw createHttpError(400, "Invalid note ID");
        }
        const note = await NoteModel.findById(noteId).exec();

        if(!note) {
          throw createHttpError(404, "Note not found");
        }
        res.status(200).json(note);
        
    } catch (error) {
        next(error);
    }
  };


  interface CreateNoteBody{
    title?: string;
    text?: string;
  }

  //LEARN:The RequestHandler takes these four types. They are the parts of a (request/??)... params, response body, request body and query... the requestHandler in the createNote controller does not have params, resp body or query, so we use unknown for those types. Without the CreateNoteBody interface, title and text would be of type 'any' and we would not get type checking.
 
  export const createNote: RequestHandler<unknown, unknown, CreateNoteBody, unknown> = async (req, res, next) => {
    const title = req.body.title;
    const text = req.body.text;

    try {

      if(!title) {
        throw createHttpError(400, "Title is required");
      }

        const newNote = await NoteModel.create({
            title: title,
            text: text,
        });
        res.status(201).json(newNote);
        
    } catch (error) {
        next(error);
    }
  };

  interface UpdateNoteParams{
    noteId: string,
  }

interface UpdateNoteBody{
  title?: string,
  text: string,
}

//QUESTION: Still don't undertand, the four RequestHandler type parmeters... especially the fourth one. It says the fourth are the url query parameters. So, what are the params
  export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {

    const noteId = req.params.noteId;
    const newTitle = req.body.title;
    const newText = req.body.text;

    try {
      if (!mongoose.isValidObjectId(noteId)) {
        throw createHttpError(400, "Invalid note ID");
      }

      if(!newTitle) {
        throw createHttpError(400, "New title is required");
      }

      const note = await NoteModel.findById(noteId).exec();

      if(!note) {
        throw createHttpError(404, "Note not found");
      }

      note.title = newTitle;
      note.text = newText;

      const updatedNote = await note.save();

      res.status(200).json(updatedNote);
    } catch (error) {
      next(error);
    }
  };



  export const deleteNote: RequestHandler = async (req, res, next) => {

    const noteId = req.params.noteId;
 
    try {
      if (!mongoose.isValidObjectId(noteId)) {
        throw createHttpError(400, "Invalid note ID");
      }

      let note = await NoteModel.findById(noteId).exec();

      if(!note) {
        throw createHttpError(404, "Note not found");
      }

      note = await NoteModel.findByIdAndRemove(noteId).exec();

      //LEARN:  The 204 No Content status code indicates that the server successfully processed the request and is not returning any content. It is used when the server does not wish to send any content in the response. This is unlike the 200 OK status code, which indicates that the request was successful and the server is sending back the requested resource. Example: res.status(201).json(newNote);

      res.sendStatus(204);
      
    } catch (error) {
      next(error);
    }
  }