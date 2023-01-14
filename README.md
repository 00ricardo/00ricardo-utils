# 00ricardo-utils
## Javascript Package for utilities

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

This is a lightweight package without any dependency for development purposes. 
It has several utility fuctions for:
- Array Management
- Object Management
- Variable and values validation without TypeScript

## Installation

00ricardo-utils doesn't requires any specific version of [Node.js] to run because it hasn't dependency modules.

```sh
npm i 00ricardo-utils --save-dev 
```
## Available functions

| Functions | Description | Parameters | Return |
| ------ | ------ | ------ | ------ |
| hasValue | Function that receives a value and checks its type, and returns a boolean indicating whether it has a value. | Variable (Object, Array, String, Number, etc) | Boolean |
| removeElement | Function that receives an array and removes an specific element by its index and return a new array. | Array, Index | Array |
| removeProperty | Function that receives an object and removes an specific property by its name and return a new Object. | Object, Property (String) | Object |
| hasProperty | Function that checks if an object has a specific property. | Object, Property (String) | Boolean |
| readFileInfo | Function that reads a file and give useful information like the name, type, size and Base64 Encode. | File | Object |
| removeEmptyElements | Function that cleans an array. It removes all NULL, undefined and empty strings from the array. | Array | Array |

## Development

Looking forward to optimize solutions and add new utility functions.

## License

MIT

**© Ricardo Briceño - Portugal**

