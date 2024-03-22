import { Note } from "./Note";

export default class NotesRepository {
    public upsert(note: Note) {
        localStorage.setItem(note.cca2, JSON.stringify(note));
    }

    public delete(cca2: string) {
        localStorage.removeItem(cca2);
    }

    public get(cca2: string): Note | null {
        const content = localStorage.getItem(cca2);
        if (content === null) {
            return null;
        }

        const note: Note = JSON.parse(content);
        return note;
    }
}
