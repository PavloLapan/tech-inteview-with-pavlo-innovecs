import React, { useState, useEffect } from "react";
import _data from "../dataSource.json";
import {
    List,
    ListItem,
    ListItemText,
    Paper,
    TextField,
    Typography,
    Pagination,
} from "@mui/material";

type Market = "US" | "CH" | "EU" | "IN";
type ItemType = "PRIVATE" | "OFFCHAIN" | "ONCHAIN";

interface Model {
    id: number;
    i: {
        type: ItemType;
        price: {
            high: number;
            low: number;
            lastTradedPrevious: number;
            lastTraded: number;
        };
        lotSize: "10" | "100" | "1";
        currency: string;
        name: string;
    };
    market: Market;
}

const ITEMS_PER_PAGE = 15;

const redClassName = "red";
const greyClassName = "grey";
const greenClassName = "green";

const determinePriceColorClass = (price: number, highPrice: number) => {
    if (price < highPrice) {
        return redClassName;
    } else if (price === highPrice) {
        return greyClassName;
    } else {
        return greenClassName;
    }
};

const CACHE_KEY = "searchCache";
const SEARCH_RESULTS_CACHE_PREFIX = "searchResultsCache_";
const SEARCH_RESULTS_EXPIRATION = 2 * 7 * 24 * 60 * 60 * 1000; // 2 weeks as we discussed in call

///////////////////////////////////////////////////////////////////////// Utility functions, should be splitted to helpers service also
const cacheData = (data: Model[]) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    localStorage.setItem(`${CACHE_KEY}_timestamp`, Date.now().toString());
};

const getCachedData = () => {
    const cachedResults = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(`${CACHE_KEY}_timestamp`);

    if (cachedResults && cachedTimestamp) {
        const expirationTime = Number(cachedTimestamp) + SEARCH_RESULTS_EXPIRATION;
        if (Date.now() < expirationTime) {
            return JSON.parse(cachedResults);
        }
    }

    return null;
};

const cacheSearchResults = (searchTerm: string, results: Model[]) => {
    const cacheKey = `${SEARCH_RESULTS_CACHE_PREFIX}${searchTerm}`;
    localStorage.setItem(cacheKey, JSON.stringify(results));
    localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
};

//ending of the utility components

const getCachedSearchResults = (searchTerm: string) => {
    const cacheKey = `${SEARCH_RESULTS_CACHE_PREFIX}${searchTerm}`;
    const cachedResults = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);

    if (cachedResults && cachedTimestamp) {
        const expirationTime = Number(cachedTimestamp) + SEARCH_RESULTS_EXPIRATION;
        if (Date.now() < expirationTime) {
            return JSON.parse(cachedResults);
        }
    }

    return null;
};

const Search = () => {
    const [cachedData, setCachedData] = useState<Model[]>(getCachedData() || _data);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<Model[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (!getCachedData()) {
            // @ts-ignore
            cacheData(_data);
        }
    }, []);

    useEffect(() => {
        if (searchTerm.length >= 2) {
            const cachedResults = getCachedSearchResults(searchTerm);
            if (cachedResults) {
                setSearchResults(cachedResults);
            } else {
                const filteredResults = cachedData.filter(
                    (item) =>
                        item.i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.i.type.toLowerCase().includes(searchTerm.toLowerCase())
                );

                const sortedResults = filteredResults.sort((a, b) => {
                    const marketPriorityA = a.market;
                    const marketPriorityB = b.market;

                    if (marketPriorityA !== marketPriorityB) {
                        return marketPriorityA.localeCompare(marketPriorityB);
                    }

                    const priceDifferenceA = Math.abs(a.i.price.lastTradedPrevious - a.i.price.high);
                    const priceDifferenceB = Math.abs(b.i.price.lastTradedPrevious - b.i.price.high);

                    return priceDifferenceA - priceDifferenceB;
                });

                setSearchResults(sortedResults);
                cacheSearchResults(searchTerm, sortedResults);
                setCurrentPage(1);
            }
        } else {
            setSearchResults([]);
            setCurrentPage(1);
        }
    }, [searchTerm, cachedData]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setCurrentPage(newPage);
    };

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedResults = searchResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div>
            <h1>Search</h1>
            <TextField
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSearchTerm(e.target.value)}
            />
            {paginatedResults.length > 0 && (
                <Paper elevation={3} sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                    <List>
                        {paginatedResults.map((result) => (
                            <ListItem key={result.id}>
                                <ListItemText
                                    primary={`${result.i.name}_${result.i.type}`}
                                    secondary={`Market: ${result.market}, Price: ${
                                        result.i.price.lastTradedPrevious * +result.i.lotSize
                                    }`}
                                    className={determinePriceColorClass(
                                        result.i.price.lastTradedPrevious * +result.i.lotSize,
                                        result.i.price.high
                                    )}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Pagination
                        count={Math.ceil(searchResults.length / ITEMS_PER_PAGE)}
                        page={currentPage}
                        onChange={handlePageChange}
                    />
                </Paper>
            )}
        </div>
    );
};

export default Search;
