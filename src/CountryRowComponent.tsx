"use client";
import "./countries-list.css";
import "./pagination.css";
import { useContext, useState } from "react";
import { Country } from "./data/Country";
import { Link } from "react-router-dom";
import { NotesContext } from "./data/NotesContext";
import { Note } from "./data/Note";

export interface CountryProps {
  country: Country;
}

export default function CountryRowComponent(props: CountryProps) {
  const { country } = props;
  const notesRepository = useContext(NotesContext);
  const [note] = useState<Note | null>(notesRepository.get(country.cca2));

  return (
    <li key={country.index} data-country={country.name.common} className="list-content">
      <Link state={{ data: country }} to={`/country-details/${country.cca3}`} >
        <span className="country-name">{country.name.common}</span>
      </Link>
      <span className="country-official">
        <span>{country.name.official}</span>
      </span>
      <span className="country-img">
        <img alt={country.flags.alt} src={country.flags.png} />
      </span>
      <span className="country-description">{country.flags.alt}</span>
    </li>
  );
}