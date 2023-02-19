declare module '00ricardo-utils' {
    export interface Utils {
        hasValue(parameter: any): Boolean;
        removeElement(arr: Array<any>, index: Number): Array<any>;
        removeProperty(obj: Object, property: String): Object;
        hasProperty(obj: Object, property: String): Boolean;
        readFileInfo(file: File): Promise<{ name: String, type: String, size: Number, base64: String }>;
        removeEmptyElements(arr: Array<any>): Array<any>;
        joinMapping(arr1: Array<Object>, arr1Prop: String, arr2: Array<Object>, arr2Prop: String, returnedProp: String): Array<Object>;
        searchFiltering(array: Array<any>, query: String, filters: Array<String>): Array<any>;
        getUniqueValues(array: Array<any>): Array<any>;
    }
    const utils: Utils;
    export default utils;
}