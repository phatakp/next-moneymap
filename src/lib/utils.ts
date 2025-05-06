import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(str: string) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim leading/trailing white space
  str = str.toLowerCase(); // convert string to lowercase
  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens
  return str;
}

export function capitalize(str: string | undefined) {
  return str
    ?.split(" ")
    .map((val) => val.charAt(0).toUpperCase() + val.slice(1))
    .join(" ");
}

export function amountFormatter(val: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    currencyDisplay: "code",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .formatToParts(val)
    .map((p) => (p.type != "literal" && p.type != "currency" ? p.value : ""))
    .join("");
}

export function shortAmount(amt: number, dec?: number) {
  if (amt > 10000000) {
    const num = (amt / 10000000).toFixed(dec ?? 2);
    return num + "Cr";
  }
  if (amt > 100000) {
    const num = (amt / 100000).toFixed(dec ?? 2);
    return num + "L";
  }
  if (amt >= 1000) {
    const num = (amt / 1000).toFixed(dec ?? 2);
    return num + "K";
  }
  return amt?.toFixed() ?? 0;
}

export function acct_number_format(value: string | undefined) {
  if (!value) return value;

  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const parts = [];

  for (let i = 0; i < v.length; i += 4) {
    parts.push(v.slice(i, i + 4));
  }

  return parts.length > 1 ? parts.join("-") : value;
}
export function masked_acct(value: string | undefined) {
  if (!value || value.includes("Cash")) return value;
  const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  return "XXXX-" + v.slice(-4);
}
