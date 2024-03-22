"use client";
import "./country-form.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useState } from "react";
import { Country } from "./data/Country";
import { Note } from "./data/Note";

export interface AddNoteProps {
    country: Country;
    note: Note | null;
    onClose: () => void;
    onNoteCreated: (note: Note) => void;
}

const close = <FontAwesomeIcon icon={faXmark} />

export default function CreateEditNoteComponent(props: AddNoteProps) {
    const { country, note, onClose, onNoteCreated } = props;
    const [noteTitleText, setNoteTitleText] = useState(note?.title ?? "");
    const [noteBodyText, setNoteBodyText] = useState(note?.body ?? "");

    const getNoteTitleText = useCallback((e: { target: { value: string } }) => {
        const value = e.target.value;
        setNoteTitleText(value);
    }, []);

    const getNoteBodyText = useCallback((e: { target: { value: string } }) => {
        const value = e.target.value;
        setNoteBodyText(value);
    }, []);

    const activateSubmit = useCallback(() => {
        if (noteBodyText.length === 0) {
            return `submit disabled`;
        }

        return `submit`;
    }, [noteBodyText.length]);

    const submitNote = useCallback(() => {
        const note: Note = {
            cca2: country.cca2,
            title: noteTitleText,
            body: noteBodyText,
        };

        onNoteCreated(note);
    }, [country, noteBodyText, noteTitleText, onNoteCreated]);

    return (
        <div className="country-pen">
            <div className="country-form">
                <span onClick={onClose} className="form-close">{close}</span>
                <label htmlFor="noteTitle">Note title:</label>
                <input onChange={getNoteTitleText} type="text" id="noteTitle" name="noteTitle" placeholder="Write the note title" value={noteTitleText} />
                <label htmlFor="Note">Add notes:</label>
                <textarea onChange={getNoteBodyText} placeholder="Write your notes..." value={noteBodyText}></textarea>
                <input className={activateSubmit()} onClick={submitNote} type="submit" value="Save note" />
            </div>
        </div>
    );
}