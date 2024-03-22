"use client";
import "./countries-list.css";
import { Link, useLocation } from "react-router-dom";
import { useCallback, useContext, useState } from "react";
import { NotesContext } from "./data/NotesContext";
import { Country } from "./data/Country";
import { Note } from "./data/Note";
import CreateEditNoteComponent from "./CreateEditNoteComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const edit = <FontAwesomeIcon icon={faEdit} />

export default function CountryDetailsComponent() {
    const location = useLocation();
    const notesRepository = useContext(NotesContext);
    const [country] = useState<Country>(location.state?.data);
    const [note, setNote] = useState<Note | null>(notesRepository.get(country.cca2));
    const [showDialog, setShowNoteDialog] = useState(false);

    const toggleNoteDialog = useCallback(() => {
        setShowNoteDialog(value => !value);
    }, []);

    const addDisableButton = useCallback(() => {
        if (showDialog) {
            return "add-note-button add-btn disabled-btn";
        } else {
            return "add-note-button add-btn";
        }
    }, [showDialog]);

    const onNoteCreated = useCallback((note: Note) => {
        notesRepository.upsert(note);
        setNote(note);
        toggleNoteDialog();
    }, [notesRepository, toggleNoteDialog]);

    return (
        <main id="content">
            <div className="main country-details">
                <ul className="countries-list">
                    <li className="list-title">
                        <span className="country-name">Name</span>
                        <span className="country-name">Official name</span>
                        <span className="country-img">Flag</span>
                        <span className="country-description">Flag description</span>
                        <span className="country-notes">Notes</span>
                    </li>
                    <li data-country={country.name.common} className="list-content">
                        <Link to="##">
                            <span className="country-name">{country.name.common}</span>
                        </Link>
                        <span className="country-official">
                            <span className="country-name">{country.name.official}</span>
                        </span>
                        <span className="country-img">
                            <img alt={country.flags.alt} src={country.flags.png} />
                        </span>
                        <span className="country-description">{country.flags.alt}</span>
                        <span className="notes">
                            <span className="note-content">
                                {
                                    note &&
                                    <span>
                                        <h4 className="">{note.title}</h4>
                                        <p className="">{note.body}</p>
                                    </span>
                                }
                            </span>
                            <span className="note-content">
                                {
                                    !note && <button className={addDisableButton()} onClick={toggleNoteDialog}>Add note +</button>
                                }
                                {
                                    note && <button className={addDisableButton()} onClick={toggleNoteDialog}>{edit}</button>
                                }
                            </span>
                        </span>
                    </li>
                </ul>
                {
                    showDialog && <CreateEditNoteComponent country={country} note={note} onClose={toggleNoteDialog} onNoteCreated={onNoteCreated} />
                }
                <Link className="goback-btn" to="/">GO BACK</Link>
            </div>
        </main>
    );
}