import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './searchComponent.css'
import { useNavigate } from 'react-router-dom';

const SearchComponent = () => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [fullData, setfullData] = useState();
    const suggestBoxRef = useRef(null);
    const navigate = useNavigate();
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestBoxRef.current && !suggestBoxRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = async (event) => {
        const inputValue = event.target.value;
        setQuery(inputValue);
        console.log(query)
        if (query.length <= 3) {
            setSuggestions([]);
            setShowSuggestions(false);
        }
        else {

            try {
                const response = await axios.post("/api/v1/symbol", { query, querytype: 1 });
                const matchedCompanies = response.data;
                setSuggestions(matchedCompanies.data);
                setfullData(matchedCompanies.fullData);
                setShowSuggestions(true);
                console.log(matchedCompanies.data);
                console.log(matchedCompanies.fullData);
            } catch (error) {
                console.error('Error fetching autocomplete suggestions:', error);
            }
        }
    };

    const handleSelection = async (selectedCompany) => {
        setQuery(selectedCompany);
        setShowSuggestions(false);
        var sym = fullData[selectedCompany].symbol;

        if (fullData[selectedCompany].exchange == 'BSE' || fullData[selectedCompany].exchange == 'NSE') {
            sym = sym + '.' + fullData[selectedCompany].exchange
        }
        // console.log(sym)
        const url = `/info/${sym}`;
        navigate(url);


    };

    const handleSearchBarClick = () => {
        setShowSuggestions(true);
    };
    return (
        <form className="d-flex search-form" role="search">
            <div className="search-container">
                <div>

                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onClick={handleSearchBarClick}
                        placeholder="Search"
                        className="form-control me-2"
                        aria-label="Search"
                    />
                </div>
                {showSuggestions && suggestions.length > 0 &&
                    (<div className='suggest' ref={suggestBoxRef}>
                        <ul className='suggestbox'>
                            {suggestions.map((company, index) => (
                                <li className="suggestion" key={index} onClick={() => handleSelection(company)}>
                                    {company} : {fullData[company].exchange}
                                </li>
                            ))}
                        </ul>
                    </div>)
                }
            </div>
        </form>
    );
};

export default SearchComponent;
