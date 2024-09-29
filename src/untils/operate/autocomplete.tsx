export const autocompleteList = [
  { label: "hc", value: "hecong" },
  { label: "hgc", value: "heghicong" },
  { label: "hdc", value: "hedencong" },
  { label: "hcc", value: "hecaycong" },
  { label: "hca", value: "hecay" },
  { label: "hd", value: "heden" },
  { label: "hg", value: "heghi" },
  { label: "hh", value: "hech" },
  { label: "td", value: "tudien" },
  { label: "hge", value: "heghiech" },
  { label: "gb", value: "gocbon" },
  { label: "tr", value: "timranh" },
  { label: "trc", value: "trucong" },
  { label: "md", value: "mepduong" },
  { label: "mdc", value: "mepduongcong" },
  { label: "dk", value: "dinhke" },
  { label: "mpn", value: "mepnuoc" },
  { label: "bm", value: "bomuong" },
  { label: "hgb", value: "hegocbon" },
  { label: "hcvc", value: "hecong > trucong" },
];
export const autocompleteString = (str: string) => {
  let checkStr = autocompleteList.find(
    (item) => item.label === str.toLocaleLowerCase()
  );
  if (checkStr === undefined) {
    return str;
  } else {
    return checkStr.value;
  }
};
