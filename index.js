// * Developer @00ricardo
// ? Created 14/01/23
// ! Portugal 

export default rutils = '00ricardo'

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
}

// * Method 
// ! Returns Array
// ? Function that receives an array and removes an specific 
// ? element by its index and return a new array
export const removeElement = (arr, index) => {
    arr.splice(index, 1);
    return arr;
}

// * Method 
// ! Returns Object
// ? Function that receives an object and removes an specific 
// ? property by its name and return a new Object
export const removeProperty = (obj, key) => {
    if (obj.hasOwnProperty(key)) {
        Object.defineProperty(obj, key, {
            configurable: true,
            enumerable: true,
            writable: true,
            value: undefined
        });
        delete obj[key];
    }
    return obj;
}

// * Method 
// ! Returns Boolean
// ? Function that checks if an object has a specific property
export const hasProperty = (obj, property) => {
    obj.hasOwnProperty(property)
};


// * Method 
// ! Returns Object
// ? Function that reads a file and give useful information 
// ? like the name, type, size and Base64 Encode
export const readFileInfo = file => {
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
export const removeEmptyElements = arr => {
    return arr.filter(Boolean);
}