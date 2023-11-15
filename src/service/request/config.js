let BASE_URL = "";
const TIME_OUT = 30000;
// import.meta.env.MODE == 'development' ? import.meta.env.VITE_PLUGIN_HOST : PLUGIN_HOST
if (process.env.NODE_ENV === "development") {
  BASE_URL = HOST_API;
  // BASE_URL = "/api";
} else if (process.env.NODE_ENV === "production") {
  BASE_URL = HOST_API;
} else if (process.env.NODE_ENV === "test") {
  BASE_URL = "";
}

export { BASE_URL, TIME_OUT };
