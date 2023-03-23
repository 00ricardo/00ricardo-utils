// * Method 
// ! Returns Boolean
// ? Function that receives a value and checks its 
// ? type, and returns a boolean indicating whether 
// ? it has a value.
const hasValue = (parameter) => {
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
}

// * Method 
// ! Returns Array
// ? Function that receives an array and removes an specific 
// ? element by its index and return a new array
const removeElement = (arr, index) => {
    arr.splice(index, 1);
    return arr;
}

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
            value: undefined
        });
        delete obj[property];
    }
    return obj;
}

// * Method 
// ! Returns Boolean
// ? Function that checks if an object has a specific property
const hasProperty = (obj, property) => {
    return obj.hasOwnProperty(property)
};


// * Method 
// ! Returns Object
// ? Function that reads a file and give useful information 
// ? like the name, type, size and Base64 Encode
const readFileInfo = file => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = () => {
            resolve({
                name: file.name,
                type: file.type,
                size: file.size,
                base64: reader.result
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
const removeEmptyElements = arr => {
    return arr.filter(Boolean);
}

// * Method 
// ! Returns Array
// ? Function that returns unique values from array
const getUniqueValues = (arr) => {
    return [...new Set(arr)]
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
    console.log()
    return arr1.map(p => {
        const map = arr2.find(_p => _p[arr2Prop] === p[arr1Prop]);
        return {
            ...p, [arr2PropValue]: hasValue(map)
                ? map[arr2PropValue]
                : undefined,
            disabled: !hasValue(map)
        };
    });
}


// * Method 
// ! Returns Array
// ? Function that returns all words from a String.
const getWords = (str) => {
    const words = str.split(/\s+/);

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
    }

    return removeEmptyElements(words);
}


// * Method 
// ! Returns Array
// ? Function that returns all instances from an Array based on filtering properties
// ! For Simple Arrays (Strings, Numbers) no filter should be used.
const searchFiltering = (array, query, filters) => {
    const words = getWords(query)

    var result = [];

    if (hasValue(filters)) {
        filters.forEach(propFilter => {
            words.forEach(w => {
                try {
                    result = [...result, ...array.filter(e => (e[propFilter].toLowerCase()).includes(w.toLowerCase()))]
                } catch (error) {
                    console.warn("[00ricardo-utils] - This operation is not possible. Probably you're filtering based on a wrong Filter.")
                    console.warn("[00ricardo-utils] - Please check the right properties.")
                }
            });
        });
    }
    else {
        try {
            words.forEach(w => {
                result = [...result, ...array.filter(e => (e.toLowerCase()).includes(w.toLowerCase()))]
            });
        } catch (error) {
            console.warn("[00ricardo-utils] - This operation is not possible. Probably you're filtering an array of Objects and you must specify the filtering property.")
            console.warn("[00ricardo-utils] - Example: Title")
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
    }, {})
};

// * Method 
// ! Returns Object
// ? Function that aggregates an array of objects by a property
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

// * Method 
// ! Returns Bollean
// ? Function that validates an email
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// * Method 
// ! Returns Object
// ? Function that calculates the Time Zones (TZ) and their date times
const convertTimezone = (fromTimeZone, toTimeZone) => {
    const now = new Date();
    const fromOffset = -1 * now.getTimezoneOffset() * 60000; // in milliseconds
    const toOffset = moment.tz.zone(toTimeZone).utcOffset(now) * 60000; // in milliseconds
    const fromTime = now.getTime() + fromOffset;
    const toTime = fromTime + toOffset;
    const fromDateTime = new Date(fromTime).toLocaleString("en-US", { timeZone: fromTimeZone });
    const toDateTime = new Date(toTime).toLocaleString("en-US", { timeZone: toTimeZone });
    const hourDifference = Math.abs(moment.tz(fromTimeZone).utcOffset() - moment.tz(toTimeZone).utcOffset()) / 60;
    const result = {
        originTZ: fromTimeZone,
        offsetTZ: toTimeZone,
        hourDifference: hourDifference,
        originDateTime: fromDateTime,
        offsetDateTime: toDateTime
    }
    return result
}

// * Developer @00ricardo
// ? Created 14/01/23
// ! Portugal 
export default {
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
    convertTimezone: convertTimezone
};