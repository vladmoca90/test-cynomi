import { createContext } from "react";
import NotesRepository from "./NotesRepository";

const notesRepository = new NotesRepository();
export const NotesContext = createContext(notesRepository);
