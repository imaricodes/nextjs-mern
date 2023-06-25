import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getNotes: RequestHandler = async (req, res, next) => {
    try {
      const notes = await NoteModel.find().exec();
      res.status(200).json(notes);
    } catch (error) {
      next(error);
    }
  }

  export const getNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;

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