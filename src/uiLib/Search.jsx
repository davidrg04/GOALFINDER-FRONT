import React, {useState} from "react";
function Search({onSearch}) {
    const [search, setSearch] = useState("");

    const handleSearch = (e) => {
        setSearch(e.target.value);
    }
    const clearSearch = () => {
        setSearch("");
        onSearch("");
    };

    const performSearch = () => {
        onSearch(search);  
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    };

    return(
        <div className="relative w-52">
        <input
            value={search}
            onChange={handleSearch}
            onKeyDown={handleKeyPress}
            type="search"
            placeholder="Buscar"
            className="w-full border-2 px-3 py-1 border-emerald-600 rounded-3xl placeholder:text-emerald-950 bg-emerald-200 focus:border-3 active:border-emerald-600 text-sm pl-10"
        />
        <i onClick={performSearch} className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 font-bold hover:cursor-pointer z-20"></i>
        {search && (
                <i
                    className="bi bi-x-circle absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-600 font-bold hover:cursor-pointer z-20"
                    onClick={clearSearch}
                ></i>
            )}
        </div>
    )
}

export default Search;