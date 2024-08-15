import { useState } from 'react';
import { DateTime } from 'luxon';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
dayjs.extend(utc);
dayjs.extend(timezone);

// * Method
// ! Returns Boolean
// ? Function that receives a value and checks its
// ? type, and returns a boolean indicating whether
// ? it has a value.
export const hasValue = (parameter) => {
  if (parameter === undefined || parameter === null) {
    return false;
  } else if (typeof parameter === 'object') {
    if (Array.isArray(parameter)) {
      return parameter.length > 0;
    } else {
      return Object.keys(parameter).length > 0;
    }
  } else {
    return parameter !== '';
  }
};

// * Method
// ! Returns Array
// ? Function that receives an array and removes an specific
// ? element by its index and return a new array
export const removeElement = (arr, index) => {
  arr.splice(index, 1);
  return arr;
};

// * Method
// ! Returns Object
// ? Function that receives an object and removes an specific
// ? property by its name and return a new Object
export const removeProperty = (obj, property) => {
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
export const hasProperty = (obj, property) => {
  return obj.hasOwnProperty(property);
};

// * Method
// ! Returns Object
// ? Function that reads a file and give useful information
// ? like the name, type, size and Base64 Encode
export const readFileInfo = (file) => {
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
export const removeEmptyElements = (arr) => {
  return arr.filter(Boolean);
};

// * Method
// ! Returns Array
// ? Function that returns unique values from array
export const getUniqueValues = (arr) => {
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

export const joinMapping = (arr1, arr1Prop, arr2, arr2Prop, arr2PropValue) => {
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
export const getWords = (str) => {
  const words = str.split(/\s+/);

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
  }

  return removeEmptyElements(words);
};

// * Method
// ! Returns Array
// ? Function that returns all instances from an Array based on filtering properties
// ! For Simple Arrays (Strings, Numbers) no filter should be used.
export const searchFiltering = (array, query, filters) => {
  const words = getWords(query);

  var result = [];

  if (hasValue(filters)) {
    filters.forEach((propFilter) => {
      words.forEach((w) => {
        try {
          result = [
            ...result,
            ...array.filter((e) => {
              if (hasValue(e[propFilter])) {
                const value = e[propFilter].toString();
                return value.toLowerCase().includes(w.toLowerCase());
              }
            }),
          ];
        } catch (error) {
          console.warn(
            "[00ricardo-utils] - This operation is not possible. Probably you're filtering based on a wrong Filter."
          );
          console.warn(
            '[00ricardo-utils] - Please check the right properties.'
          );
          console.warn('[00ricardo-utils] - Error: ', error);
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
      console.warn('[00ricardo-utils] - Example: Title');
    }
  }
  return result;
};

// * Method
// ! Returns Object
// ? Function that renames a Object Property
export const renameProperty = (obj, oldProp, newProp) => {
  const { [oldProp]: _, ...rest } = obj;
  return {
    ...rest,
    [newProp]: obj[oldProp],
  };
};

// * Method
// ! Returns Object
// ? Function that groups an array of objects by a property
export const groupBy = (array, groupByProperty) => {
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
export const aggregateData = (array, _key, propToAggregate) => {
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
};
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
export const validateEmail = (email) => {
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
export const convertTimezone = (
  originTimeZone,
  offsetTimeZone,
  dateTimeString
) => {
  const originDate = DateTime.fromISO(dateTimeString, { zone: originTimeZone });
  const offsetDate = originDate.setZone(offsetTimeZone);
  const _CET_ = originDate.setZone('CET');
  const hourDifference = offsetDate.offset - originDate.offset;

  const response = {
    originDateTime: originDate.toFormat('yyyy/MM/dd, HH:mm:ss'),
    originTimeZone,
    offsetDateTime: offsetDate.toFormat('yyyy/MM/dd, HH:mm:ss'),
    offsetTimeZone,
    CETDateTime: _CET_.toFormat('yyyy/MM/dd, HH:mm:ss'),
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

export const sortArray = (array, direction = 'ASC') => {
  if (direction === 'ASC') {
    return array.sort((a, b) => a - b);
  } else if (direction === 'DESC') {
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
export const sortObjectsArrayByProperty = (array, property) => {
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

export const setLocalStorageItem = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getLocalStorageItem = (key, defaultValue = null) => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

export const watchLocalStorageKey = (key, callback) => {
  const localStorageChangeListener = (e) => {
    if (e.key === key) {
      callback();
    }
  };
  document.addEventListener('storage', localStorageChangeListener);
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
export const useDebounce = (debouncedFn, delay) => {
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
 * Custom hook to manage data fetching and mutations with TanStack Query.
 *
 * @param {Array} queryKey - The unique key for the query.
 * @param {Function} fetchFunction - Function to fetch data (required for queries).
 * @param {Function} [mutationFunction=null] - Function to mutate data (optional for queries, required for mutations).
 * @param {Object} [options={}] - Configuration options for the query and mutation behavior.
 * @param {boolean} [options.enabled=true] - Determines if the query should run automatically.
 * @param {number} [options.staleTime=0] - Time (in milliseconds) the data is considered fresh before becoming stale.
 * @param {number} [options.cacheTime=0] - Time (in milliseconds) the data remains in cache after becoming unused.
 * @param {number} [options.refetchInterval=null] - Time (in milliseconds) for automatic refetching. Set to `null` to disable.
 * @param {Object} [options.mutationOptions={}] - Options specifically for mutation behavior.
 * @param {Function} [options.mutationOptions.onMutate] - Callback invoked before the mutation function is fired.
 * @param {Function} [options.mutationOptions.onSuccess] - Callback invoked if the mutation is successful.
 * @param {Function} [options.mutationOptions.onError] - Callback invoked if the mutation fails.
 * @param {Function} [options.mutationOptions.onSettled] - Callback invoked when the mutation completes, regardless of success or failure.
 *
 * @example <caption>Basic Query Example</caption>
 * const { data: queueListenerData, error: queueListenerError } = useRestAPI({
 *   queryKey: ['message-listener', msgID],
 *   fetchFunction: () => queueListener(baseURL, msgID),
 *   options: {
 *     enabled: rutils.hasValue(baseURL) && rutils.hasValue(msgID) && !processQueueHasResult,
 *     staleTime: 0,
 *     cacheTime: 0,
 *     refetchInterval: 3000, // Auto refetch every 3 seconds
 *   }
 * });
 *
 * @example <caption>Basic Mutation Example</caption>
 * const {
 *   mutate: addChangesToProcessQueue,
 *   mutationError: addChangesToProcessQueueError,
 *   isLoading: isMutating,
 *   isMutationSuccess,
 * } = useORDS({
 *   queryKey: ['add-changes/'],
 *   mutationFunction: (payload) => sendRequestToProcessQueue(baseURL, payload),
 *   options: {
 *     enabled: rutils.hasValue(baseURL),
 *     staleTime: 0,
 *     cacheTime: 0,
 *     mutationOptions: {
 *       onSuccess: (data) => {
 *         const { result, message_id } = data;
 *         if (result === 'SUCCESS') setMsgID(message_id);
 *       },
 *     },
 *   }
 * });
 *
 * @returns {Object} - Returns query and mutation utilities, including `data`, `error`, `isLoading`, and `mutate`.
 */

const useRestAPI = ({
  queryKey,
  fetchFunction,
  mutationFunction,
  options = {},
}) => {
  const queryClient = useQueryClient();

  // Destructure options for ease of use

  const {
    enabled = true,
    staleTime = 0,
    cacheTime = 1 * 60 * 1000, // ! 1 minute
    mutationCallbacks = {},
    queryCallbacks = {},
    retry = 1, //!  Meaning that it will fetch data 2 times (usual call and 1 retry)
    refetchInterval = 0, // ! Auto Refetch 0 ms by default
  } = options;

  // * Data Fetching
  const { data, error, isLoading, isError, isSuccess, isFetching, refetch } =
    useQuery({
      queryKey,
      queryFn: fetchFunction,
      enabled,
      staleTime,
      cacheTime,
      retry,
      refetchInterval,
      onSuccess: (data) => {
        if (queryCallbacks.onSuccess) queryCallbacks.onSuccess(data);
      },
      onError: (error) => {
        if (queryCallbacks.onError) queryCallbacks.onError(error);
      },
    });

  // Data Mutation

  const {
    data: mutateData,
    mutate,
    isLoading: isMutating,
    error: mutationError,
    isError: isMutationError,
    isSuccess: isMutationSuccess,
  } = useMutation({
    mutationFn: mutationFunction,
    ...mutationCallbacks,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries(queryKey);
      if (mutationCallbacks.onSuccess) {
        mutationCallbacks.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      if (mutationCallbacks.onError) {
        mutationCallbacks.onError(error, variables, context);
      }
    },
  });

  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
    isFetching,
    refetch,
    mutateData,
    mutate,
    isMutating,
    mutationError,
    isMutationError,
    isMutationSuccess,
  };
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
  getLocalStorageItem: getLocalStorageItem,
  setLocalStorageItem: setLocalStorageItem,
  watchLocalStorageKey: watchLocalStorageKey,
  useDebounce: useDebounce,
  useRestAPI: useRestAPI,
};

export default rutils;
