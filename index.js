import { useState } from "react";
import { DateTime } from "luxon";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
dayjs.extend(utc);
dayjs.extend(timezone);

// * Method
// ! Returns Boolean
// ? Function that receives a value and checks its
// ? type, and returns a boolean indicating whether
// ? it has a value.
const hasValue = (parameter) => {
  if (parameter === undefined || parameter === null) {
    return false;
  } else if (typeof parameter === "object") {
    if (Array.isArray(parameter)) {
      return parameter.length > 0;
    } else {
      return Object.keys(parameter).length > 0;
    }
  } else {
    return parameter !== "";
  }
};

// * Method
// ! Returns Array
// ? Function that receives an array and removes an specific
// ? element by its index and return a new array
const removeElement = (arr, index) => {
  arr.splice(index, 1);
  return arr;
};

// * Method
// ! Returns Object
// ? Function that receives an object and removes an specific
// ? property by its name and return a new Object
const removeProperty = (obj, property) => {
  if (obj.hasOwnProperty(property)) {
    Object.defineProperty(obj, property, {
      configurable: true,
      enumerable: true,
      writable: true,
      value: undefined,
    });
    delete obj[property];
  }
  return obj;
};

// * Method
// ! Returns Boolean
// ? Function that checks if an object has a specific property
const hasProperty = (obj, property) => {
  return obj.hasOwnProperty(property);
};

// * Method
// ! Returns Object
// ? Function that reads a file and give useful information
// ? like the name, type, size and Base64 Encode
const readFileInfo = (file) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => {
      resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        base64: reader.result,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// * Method
// ! Returns Array
// ? Function that cleans an array. It removes all NULL,
// ? undefined and empty strings from the array
const removeEmptyElements = (arr) => {
  return arr.filter(Boolean);
};

// * Method
// ! Returns Array
// ? Function that returns unique values from array
const getUniqueValues = (arr) => {
  return [...new Set(arr)];
};

// * Method
// ! Returns Array
// ? Function that join 2 arrays through property mapping
// ? It receives 2 arrays and 3 property references

// ! arr1 -> Main Array (Array)
// ! arr2 -> Auxiliar Array (Array)
// ! arr1Prop -> represents the property of the arr1 array that we want to use for mapping (String)
// ! arr2Prop -> represents the property of the arr2 array that we want to use for mapping (String)
// ! arr2PropValue -> represents the property of the arr2 array that we want to return in the result (String)

// * It's important to understand how this function works.
// ? The functional logic it's very similar to LEFT JOIN in SQL.

// ? SELECT arr1.id, arr1.name, arr1.arr1Prop, arr2.returnedProp
// ? FROM arr1
// ? JOIN LEFT arr2 ON arr1.arr1Prop = arr2.arr2Prop

const joinMapping = (arr1, arr1Prop, arr2, arr2Prop, arr2PropValue) => {
  console.log();
  return arr1.map((p) => {
    const map = arr2.find((_p) => _p[arr2Prop] === p[arr1Prop]);
    return {
      ...p,
      [arr2PropValue]: hasValue(map) ? map[arr2PropValue] : undefined,
      disabled: !hasValue(map),
    };
  });
};

// * Method
// ! Returns Array
// ? Function that returns all words from a String.
const getWords = (str) => {
  const words = str.split(/\s+/);

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, "");
  }

  return removeEmptyElements(words);
};

// * Method
// ! Returns Array
// ? Function that returns all instances from an Array based on filtering properties
// ! For Simple Arrays (Strings, Numbers) no filter should be used.
const searchFiltering = (array, query, filters) => {
  const words = getWords(query);

  var result = [];

  if (hasValue(filters)) {
    filters.forEach((propFilter) => {
      words.forEach((w) => {
        try {
          result = [
            ...result,
            ...array.filter((e) =>
              e[propFilter].toLowerCase().includes(w.toLowerCase())
            ),
          ];
        } catch (error) {
          console.warn(
            "[00ricardo-utils] - This operation is not possible. Probably you're filtering based on a wrong Filter."
          );
          console.warn(
            "[00ricardo-utils] - Please check the right properties."
          );
          console.warn("[00ricardo-utils] - Error: ", error);
        }
      });
    });
  } else {
    try {
      words.forEach((w) => {
        result = [
          ...result,
          ...array.filter((e) => e.toLowerCase().includes(w.toLowerCase())),
        ];
      });
    } catch (error) {
      console.warn(
        "[00ricardo-utils] - This operation is not possible. Probably you're filtering an array of Objects and you must specify the filtering property."
      );
      console.warn("[00ricardo-utils] - Example: Title");
    }
  }
  return result;
};

// * Method
// ! Returns Object
// ? Function that renames a Object Property
const renameProperty = (obj, oldProp, newProp) => {
  const { [oldProp]: _, ...rest } = obj;
  return {
    ...rest,
    [newProp]: obj[oldProp],
  };
};

// * Method
// ! Returns Object
// ? Function that groups an array of objects by a property
const groupBy = (array, groupByProperty) => {
  array.reduce((result, element) => {
    const key = element[groupByProperty];
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(element);
    return result;
  }, {});
};

/**
 * Function that aggregates an array of objects by a property
 *
 * @Method
 * @param {string} array - Array of Objects
 * @param {string} _key - Property to be used as Key
 * @param {string} propToAggregate - Property to aggregate
 * @returns {Object} Aggregated Data
 * @Example
 * - aggregateData([
    { name: 'Alice', category: 'A', value: '10' },
    { name: 'Bob', category: 'B', value: '20' },
    { name: 'Charlie', category: 'A', value: '30' },
    { name: 'Dave', category: 'B', value: '40' }], 
    category', 
    'value')
 * - { A: 40, B: 60 }
 */
function aggregateData(array, _key, propToAggregate) {
  return array.reduce((result, item) => {
    const key = item[_key];
    const propValue = Number(item[propToAggregate]); // convert to number
    if (isNaN(propValue)) {
      return result; // ignore non-number properties
    }
    if (!result[key]) {
      result[key] = 0;
    }
    result[key] += propValue;
    return result;
  }, {});
}
/**
 * Function that validates an email
 *
 * @Method
 * @param {string} email - Email
 * @returns {Boolean} Validate Email
 * @Example
 * - validateEmail("00ricardo-utils@package.com")
 * -  True
 */
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Function that calculates the Time Zones (TZ) and their date times
 *
 * @Method
 * @param {string} originTimeZone
 * @param {string} offsetTimeZone
 * @param {string} dateTimeString
 * @returns {Object} Time Zones
 * @Example
 * - convertTimezone('Asia/Tokyo', 'CET', '2023-04-12T03:00')
 * - {
  originDateTime: '2023/04/12, 03:00:00',
  originTimeZone: 'Asia/Tokyo',
  offsetDateTime: '2023/04/12, 11:00:00',
  offsetTimeZone: 'CET',
  CETDateTime: '2023/04/12, 11:00:00',
  hourDifference: 8
}
 */
const convertTimezone = (originTimeZone, offsetTimeZone, dateTimeString) => {
  const originDate = DateTime.fromISO(dateTimeString, { zone: originTimeZone });
  const offsetDate = originDate.setZone(offsetTimeZone);
  const _CET_ = originDate.setZone("CET");
  const hourDifference = offsetDate.offset - originDate.offset;

  const response = {
    originDateTime: originDate.toFormat("yyyy/MM/dd, HH:mm:ss"),
    originTimeZone,
    offsetDateTime: offsetDate.toFormat("yyyy/MM/dd, HH:mm:ss"),
    offsetTimeZone,
    CETDateTime: _CET_.toFormat("yyyy/MM/dd, HH:mm:ss"),
    hourDifference: hourDifference / 60,
  };
  return response;
};
/*
convertTimezone('Europe/Lisbon', 'CET', '2023-04-12T15:00') // ;
convertTimezone('Asia/Tokyo', 'CET', '2023-04-12T03:00') //;
convertTimezone('America/Bahia', 'CET', '2023-04-12T15:00') //;
*/

/**
 * Function that sorts an array ascending or descending
 *
 * @Method
 * @param {string} array
 * @param {string} direction (default 'ASC')
 * @returns {Array} Sorted Array
 * @Example
 * - sortArray([3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5], 'DESC');
 * - [9, 6, 5, 5, 5, 4, 3, 3, 2, 1, 1]
 */

const sortArray = (array, direction = "ASC") => {
  if (direction === "ASC") {
    return array.sort((a, b) => a - b);
  } else if (direction === "DESC") {
    return array.sort((a, b) => b - a);
  } else {
    throw new Error('Invalid sorting direction. Use "ASC" or "DESC".');
  }
};

/**
 * Function that sorts an array ascending or descending
 *
 * @Method
 * @param {string} array
 * @param {string} property
 * @returns {Array} Sorted Objects Array
 * @Example
 * - sortObjectsArrayByProperty([{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }, { name: 'Charlie', age: 35 }], 'age');
 * - [{ name: 'Bob', age: 25 }, { name: 'Alice', age: 30 }, { name: 'Charlie', age: 35 }]
 */
const sortObjectsArrayByProperty = (array, property) => {
  return array.sort((a, b) => {
    if (a[property] < b[property]) {
      return -1;
    }
    if (a[property] > b[property]) {
      return 1;
    }
    return 0;
  });
};

const setLocalStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const getLocalStorageItem = (key, defaultValue = null) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

const watchLocalStorageKey = (key, callback) => {
  const localStorageChangeListener = (e) => {
    if (e.key === key) {
      callback();
    }
  };
  document.addEventListener("storage", localStorageChangeListener);
};

/**
 * Custom Hook that debounces a function to optimize rendering
 *
 * @Method
 * @param {Function} debouncedFn
 * @param {Number} delay
 * @returns {} Debounce a function to execute
 * @Example
 * - const debouncedFunction = useDebounce((value) => {
    console.log(`Debounced input: ${value}`);
    setInputValue(event.target.value);
  }, 300); // 300 milliseconds delay debouncedFn

 * - function handleInputChange(event) {
    debouncedFunction(event.target.value);
  }
* -  onChange={handleInputChange}
 */
const useDebounce = (debouncedFn, delay) => {
  const [debouncedCallback, setDebouncedCallback] = useState(null);

  // Update the debounced callback whenever the delay changes
  if (
    debouncedCallback === null ||
    debouncedCallback === undefined ||
    delay !== debouncedCallback.delay
  ) {
    setDebouncedCallback({
      debouncedFn,
      delay,
      timeout: null,
    });
  }

  return (...args) => {
    const { debouncedFn, delay, timeout } = debouncedCallback;

    // Clear the previous timeout
    if (timeout) {
      clearTimeout(timeout);
    }

    // Set a new timeout
    const newTimeout = setTimeout(() => {
      debouncedFn(...args);
    }, delay);

    // Update the timeout in the debounced callback
    setDebouncedCallback({
      ...debouncedCallback,
      timeout: newTimeout,
    });
  };
};

/**
 * Custom Hook that manages Local Application Storage
 *
 * @Method
 * @param {String} key
 * @param {Any} value
 * @returns [storedValue, setValue] getter and setter
 * @Example
 * const [name, setName] = useLocalStorage("utils", "00ricardo")
 */
const useLocalStorage = (key, value) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return value;
    }
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : value;
    } catch (error) {
      console.error(error);
      return value;
    }
  });
  const setValue = (val) => {
    try {
      setStoredValue(val);
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(val));
      }
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue];
};

// * Developer @00ricardo
// ? Created 14/01/23
// ! Portugal

const rutils = {
  hasValue: hasValue,
  removeElement: removeElement,
  removeProperty: removeProperty,
  hasProperty: hasProperty,
  readFileInfo: readFileInfo,
  removeEmptyElements: removeEmptyElements,
  joinMapping: joinMapping,
  getWords: getWords,
  searchFiltering: searchFiltering,
  getUniqueValues: getUniqueValues,
  renameProperty: renameProperty,
  groupBy: groupBy,
  aggregateData: aggregateData,
  validateEmail: validateEmail,
  convertTimezone: convertTimezone,
  sortArray: sortArray,
  sortObjectsArrayByProperty: sortObjectsArrayByProperty,
  getLocalStorageItem,
  getLocalStorageItem,
  setLocalStorageItem: setLocalStorageItem,
  watchLocalStorageKey: watchLocalStorageKey,
  useDebounce: useDebounce,
  useLocalStorage: useLocalStorage,
};

export default rutils;
