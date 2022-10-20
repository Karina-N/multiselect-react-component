import { CONFIG_FILES } from "next/dist/shared/lib/constants";
import { useState, useLayoutEffect, useRef } from "react";
import styles from "./MultiSelect.module.css";

export default function MultiSelect({ options }) {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selection, setSelection] = useState([]);
  const [maxCount, setMaxCount] = useState(null);

  const refSelection = useRef(null);
  const refContainer = useRef(null);

  const [selectionWidth, setSelectionWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const updateteWidths = () => {
    setSelectionWidth(refSelection.current?.offsetWidth);
    setContainerWidth(refContainer.current?.offsetWidth);
  };

  useLayoutEffect(() => {
    updateteWidths();
  }, [selection, containerWidth]);

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
    setFilteredOptions(options.filter((w) => w.toLowerCase().includes(e.target.value.toLowerCase())));
  };

  const handleSelection = (e) => {
    setSelection((prevState) => {
      if (e.target.checked) {
        return [...prevState, e.target.value];
      } else {
        return prevState.filter((elm) => elm !== e.target.value);
      }
    });
  };

  const displaySelectionDiv = () => {
    if (selection.length < 1) {
      return <div>Choose a tag</div>;
    } else {
      return (
        <div className={styles.selectionList} ref={refSelection}>
          {displaySelectedOptions()}
        </div>
      );
    }
  };

  const displaySelectedOptions = () => {
    // With help of useRef() we are comparing the dynamic width of DOM elements
    // width of selected items vs parent container
    const additionalGap = 80;
    if (selectionWidth == undefined || selectionWidth + additionalGap <= containerWidth) {
      //  maxCount is the maximum number of array elements that can be displayed
      if (maxCount !== null) setMaxCount(null); // reseting it every time full list of options is displayed
      return selection.map((s, i) => {
        return (
          <div key={i}>
            <div className={styles.selectedItem}>{s}</div>
          </div>
        );
      });
    } else {
      //every time we go into else, we save the last number of elements that can still be displayed.
      if (maxCount === null) setMaxCount(selection.length - 1);
      return (
        <>
          {selection.slice(0, maxCount).map((s, i) => {
            return (
              <div key={i}>
                <div className={styles.selectedItem}>{s}</div>
              </div>
            );
          })}
          <span className={styles.dots}>...</span>
          <div className={styles.selectedItem}>{selection.length}</div>
        </>
      );
    }
  };

  const displayOptions = () => {
    return (
      <div className={styles.content}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="Search"
          value={searchInput}
          onChange={handleSearchInput}
        />
        <form className={styles.optionsDisplay}>
          {filteredOptions.map((opt, i) => {
            return (
              <div className={styles.singleOption} key={i}>
                <input
                  className={styles.checkboxInput}
                  type="checkbox"
                  name={opt}
                  value={opt}
                  onChange={handleSelection}
                  checked={selection.includes(opt)}
                />
                <label>{opt}</label>
              </div>
            );
          })}
        </form>
      </div>
    );
  };

  return (
    <div>
      <h4> Multi-select</h4>
      <div className={styles.multiSelectForm}>
        <div className={styles.selectionDisplayDiv} ref={refContainer} onClick={() => setOpen((prev) => !prev)}>
          {displaySelectionDiv()}
          <div className={open ? styles.openedArrow : styles.closedArrow}></div>
        </div>
        {open && displayOptions()}
      </div>
    </div>
  );
}
