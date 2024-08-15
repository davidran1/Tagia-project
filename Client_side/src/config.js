// defining project constants

export const resultsPerPageAdmin = 10;

export const majors = [
  "מדעי המחשב",
  "מתמטיקה שימושית",
  "הנדסת חשמל",
  "עיצוב",
  "הנדסת תעשיה וניהול",
];

export const years = [1, 2, 3, 4];

export const userNavMenuOptions = [
  {
    value: "personal-space",
    label: "אזור אישי",
    navigateTO: "/user-profile",
  },
];
export const filters = [
  { value: "popular", label: "פופולארי" },
  { value: "location", label: "מיקום" },
  { value: "date", label: "תאריך" },
  { value: "Cost", label: "מחיר" },
];
export const eventManagerNavMenuOptions = [
  {
    value: "event-panel",
    label: "ניהול אירועים",
    navigateTO: "/events-organizer",
  },
  {
    value: "personal-space",
    label: "אזור אישי",
    navigateTO: "/user-profile",
  },
];

export const adminNavMenuOptions = [
  {
    value: "admin-panel",
    label: "אזור מנהלי",
    navigateTO: "/admin-panel",
  },
];
