import { Key } from "react";
import { CountryNames } from "./CountryNames";

export interface Country {
    index: Key | null | undefined;
    id: number;
    cca2: string;
    cca3: string;
    flags: {
        "png": string,
        "svg": string,
        "alt": string,
    },
    name: CountryNames;
}
