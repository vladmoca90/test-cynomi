"use client";
import "./countries-list.css";
import "./country-form.css";
import "./pagination.css";
import { Suspense, useCallback, useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faSearch } from "@fortawesome/free-solid-svg-icons";
import CountryRowComponent from "./CountryRowComponent";
import { Country } from "./data/Country";
import { NotesContext } from "./data/NotesContext";

enum CountriesStatus {
  Loading = "Loading",
  OK = "OK",
  ErrorLoading = "ErrorLoading"
}

const arrowRight = <FontAwesomeIcon icon={faArrowRight} />
const arrowLeft = <FontAwesomeIcon icon={faArrowLeft} />
const searchIcon = <FontAwesomeIcon icon={faSearch} />

const countriesUrl = "https://restcountries.com/v3.1/all?fields=name,flags,languages,currencies,cca2,cca3";
const countriesPerPage = 20;

const filterCountries = (countries: Country[], query: string): Country[] => {
  query = query.toLowerCase();

  return countries.filter((country) =>
    country.name.common.toLowerCase().includes(query) ||
    country.name.official.toLowerCase().includes(query));
}

const calculateLastPage = (countries: Country[], countriesPerPage: number, defaultPage: number): number => {
  if (countries.length === 0) {
    return defaultPage;
  }

  return Math.ceil(countries.length / countriesPerPage);
}

const getVisibleCountries = (countries: Country[], page: number, countriesPerPage: number): Country[] => {
  const start = (page - 1) * countriesPerPage;
  const end = page * countriesPerPage;

  return countries.slice(start, end);
}

const generatePagesArray = (lastPage: number): number[] => {
  return Array.from({ length: lastPage }, (v, k) => k + 1);
};

export default function CountriesListComponent() {
  const [status, setStatus] = useState<CountriesStatus>(CountriesStatus.Loading);
  const [countries, setCountries] = useState<Country[]>([]);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const notesRepository = useContext(NotesContext);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(filterCountries(countries, query));
  const [firstPage, setFirstPage] = useState(1);
  const [lastPage, setLastPage] = useState(calculateLastPage(countries, countriesPerPage, 1));
  const [visibleCountries, setVisibleCountries] = useState<Country[]>(getVisibleCountries(filteredCountries, currentPage, countriesPerPage));
  const [allPages, setAllPages] = useState(generatePagesArray(lastPage));

  const getCountriesList = useCallback(async () => {
    const res = await fetch(countriesUrl);

    if (!res.ok) {
      setStatus(CountriesStatus.ErrorLoading);
      throw new Error("The data is NOT valid!");
    }

    const data: Country[] = await res.json();

    setCountries(data.sort((a, b) => a.name.common.localeCompare(b.name.common)));
    setStatus(CountriesStatus.OK);
  }, []);

  useEffect(() => {
    setAllPages(generatePagesArray(lastPage));
  }, [lastPage]);

  useEffect(() => {
    setFilteredCountries(countries);
    setLastPage(calculateLastPage(countries, countriesPerPage, 1));
  }, [countries]);

  const previousPage = useCallback(() => {
    if (currentPage !== firstPage) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage, firstPage]);

  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const nextPage = useCallback(() => {
    if (currentPage !== lastPage) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, lastPage]);

  const isPrevDisabled = useCallback(() => {
    if (currentPage === 1) {
      return "pagination-item prev-item prev-disabled";
    }

    return "pagination-item prev-item";
  }, [currentPage]);

  const isNextDisabled = useCallback(() => {
    if (currentPage === lastPage) {
      return "pagination-item next-item next-disabled";
    }

    return "pagination-item next-item";
  }, [lastPage, currentPage]);

  const search = useCallback((e: { target: { value: string } }) => {
    const query = e.target.value;
    const filteredCountries = query.length < 2 ? countries : filterCountries(countries, query);

    changePage(1);
    setLastPage(calculateLastPage(filteredCountries, countriesPerPage, 1));
    setFilteredCountries(filteredCountries);
    setQuery(query);
  }, [countries, changePage]);

  useEffect(() => {
    setVisibleCountries(getVisibleCountries(filteredCountries, currentPage, countriesPerPage));
  }, [filteredCountries, currentPage]);

  const Loading = useCallback(() => {
    return <span><img className="loading-img" alt="loading" src="./images/loading.gif" /></span>;
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    getCountriesList();
  }, [getCountriesList]);

  return (
    <main id="content">
      <div className="main">
        <div className="countries-search">
          <label>Search a country:</label>
          <div className="countries-search-input">
            {searchIcon}
            <input value={query} onChange={search} title="countries" type="text" />
          </div>
        </div>
        <ul className="countries-list">
          <li className="list-title">
            <span className="country-name">Name</span>
            <span className="country-name">Official name</span>
            <span className="country-img">Flag</span>
            <span className="country-description">Flag description</span>
          </li>
          {
            status === CountriesStatus.Loading &&
            <li className="list-content">
              <span className="country-name"></span>
              <span className="country-name"></span>
              <span className="country-img">
                <Suspense fallback={<Loading />}>
                  <Loading />
                </Suspense>
              </span>
              <span className="country-description"></span>
            </li>
          }
          {
            status === CountriesStatus.OK &&
            <NotesContext.Provider value={notesRepository}>
              {
                visibleCountries.map((country, index) => {
                  return (
                    <CountryRowComponent country={country} key={index} />
                  );
                })
              }
            </NotesContext.Provider>
          }
        </ul>
        <div id="pagination">
          <ul className="pagination-list">
            <li className={isPrevDisabled()}>
              <a href="##" className="page-link" onClick={previousPage}>{arrowLeft}</a>
            </li>
            {
              allPages.map((n, i) => {
                return (
                  <li className={`pagination-item ${currentPage === n ? 'active' : ''}`} key={i}>
                    <a href="##" className="page-link prev-link" onClick={() => changePage(n)}>{n}</a>
                  </li>
                );
              })
            }
            <li className={isNextDisabled()}>
              <a href="##" className="page-link" onClick={nextPage}>{arrowRight}</a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}