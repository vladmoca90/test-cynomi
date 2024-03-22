import { createContext } from "react";

export interface CountryRepository {
    countryId?: number;
}

export const defaultCountryRepository: CountryRepository = {};

export const CountryContext = createContext<CountryRepository>(defaultCountryRepository);