declare module '00ricardo-utils' {
  export function hasValue(parameter: any): Boolean;
  export function removeElement(arr: Array<any>, index: Number): Array<any>;
  export function removeProperty(obj: Object, property: String): Object;
  export function hasProperty(obj: Object, property: String): Boolean;
  export function readFileInfo(
    file: File
  ): Promise<{ name: String; type: String; size: Number; base64: String }>;
  export function removeEmptyElements(arr: Array<any>): Array<any>;
  export function joinMapping(
    arr1: Array<Object>,
    arr1Prop: String,
    arr2: Array<Object>,
    arr2Prop: String,
    arr2PropValue: String
  ): Array<Object>;
  export function getWords(phrase: String): Array<String>;
  export function searchFiltering(
    array: Array<any>,
    query: String,
    filters: Array<String>
  ): Array<any>;
  export function getUniqueValues(array: Array<any>): Array<any>;
  export function renameProperty(
    obj: Object,
    oldProp: String,
    newProp: String
  ): Object;
  export function groupBy(
    array: Array<Object>,
    groupByProperty: String
  ): Object;
  export function aggregateData(
    array: Array<Object>,
    _key: String,
    propToAggregate: String
  ): Object;
  export function validateEmail(email: String): Boolean;
  export function convertTimezone(
    originTimeZone: String,
    offsetTimeZone: String,
    dateTime: String
  ): Object;
  export function sortArray(array: String, direction: String): Array<any>;
  export function sortObjectsArrayByProperty(
    array: String,
    direction: String
  ): Array<any>;
  export function getLocalStorageItem(key: String, value: any): any;
  export function setLocalStorageItem(key: String, value: any): any;
  export function watchLocalStorageKey(key: String, callback: Function): any;
  export function useDebounce(debouncedFn: Function, delay: Number): Object;
  export function useRestAPI(
    queryKey: Array<String>,
    fetchFunction: Function,
    mutationFunction: Function,
    options: Object
  ): any;
}
