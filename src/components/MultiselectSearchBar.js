import React, { useEffect, useState } from "react";
import "./MultiselectSearchBar.css"; // Create a CSS file for styling
import Header from "./Header";
import { fetchData } from "./service";

const MultiselectSearchBar = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [allItems, setAllItems] = useState([]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const selectItem = (item) => {
    setSelectedItems([...selectedItems, item]);
    setDropdownVisible(false);
    setSearchInput("");
  };

  const removeItem = (index) => {
    const updatedItems = [...selectedItems];
    updatedItems.splice(index, 1);
    setSelectedItems(updatedItems);
  };

  const handleClickOutside = (event) => {
    if (event.target.closest(".multiselect") === null) {
      setDropdownVisible(false);
    }
  };

  const handleBackspace = (e) => {
    if (e.key === "Backspace" && searchInput === "") {
      // Highlight the last chip when backspace is pressed and the input is empty
      const lastChipIndex = selectedItems.length - 1;
      const chip = document.getElementById(`chip-${lastChipIndex}`);

      if (chip) {
        if (chip.classList.contains("highlight")) {
          // If the chip is already highlighted, remove it
          removeHighlightedItem();
        } else {
          // If the chip is not highlighted, highlight it
          chip.classList.add("highlight");
        }
      }
    }
  };

  const removeHighlightedItem = () => {
    const highlightedChip = document.querySelector(".chip.highlight");
    if (highlightedChip) {
      const index = parseInt(highlightedChip.getAttribute("data-index"), 10);
      removeItem(index);
    }
  };

  useEffect(() => {
    fetchData().then((res) => setAllItems(res));
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const filteredItems = allItems.filter((item) => {
    const searchTerms = searchInput.toLowerCase().split(" ");
    return searchTerms.every(
      (term) =>
        item.name.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    document.addEventListener("keydown", handleBackspace);
    return () => {
      document.removeEventListener("keydown", handleBackspace);
    };
  }, [searchInput, selectedItems]);

  return (
    <div>
      <Header />
      <div className="multiselect">
        <div className="select-box" onClick={toggleDropdown}>
          <div className="selected-items">
            {selectedItems.map((item, index) => (
              <div
                key={index}
                id={`chip-${index}`}
                className={`chip ${
                  index === selectedItems.length - 1 ? "highlight" : ""
                }`}
                data-index={index}
              >
                <span className="image-circle">
                  <img src={item.avatar} alt="User Avatar" />
                </span>
                {item.name}
                <span
                  onClick={() => removeItem(index)}
                  style={{ cursor: "pointer", padding: "0px 15px" }}
                >
                  x
                </span>
              </div>
            ))}
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Add New User ..."
            className={`search-text ${searchInput.length > 0 ? "active" : ""}`}
            onClick={toggleDropdown}
          />
        </div>
        <div className="select-line"></div>

        {dropdownVisible && (
          <div className="dropdown-content">
            {filteredItems?.map((item, index) => (
              <div
                key={index}
                onClick={() => selectItem(item)}
                className="dropdown-item"
              >
                <div style={{ display: "flex", alignContent: "center" }}>
                  <span className="image-circle">
                    {" "}
                    <img src={item.avatar} alt="User Avatar" />
                  </span>
                  {item.name}
                </div>
                {item.email}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiselectSearchBar;
