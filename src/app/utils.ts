/*
  FuzzySearch provides search capabilities even if words are misspelled.
  This has been modified from the angular-tree-component example
  to search through a list of selected values.
    ref: https://github.com/CirclonGroup/angular-tree-component/blob/master/projects/example-app/src/app/filter/filter.component.ts
*/
export const fuzzySearch = (needles: string[], haystack: string) => {
  return needles.some((needle: string) => {
    const haystackLC = haystack.toLowerCase();
    const needleLC = needle.toLowerCase();

    const hLen = haystack.length;
    const nLen = needleLC.length;

    if (nLen > hLen) {
      return false;
    }
    if (nLen === hLen) {
      return needleLC === haystackLC;
    }
    outer: for (let i = 0, j = 0; i < nLen; i++) {
      const nch = needleLC.charCodeAt(i);

      while (j < hLen) {
        if (haystackLC.charCodeAt(j++) === nch) {
          continue outer;
        }
      }
      return false;
    }
    return true;
  });
};
