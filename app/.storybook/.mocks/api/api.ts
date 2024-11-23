const baseUrl = process.env.REACT_APP_API_URL;
export const apiUrl = (endpoint) => `${baseUrl}${endpoint}`;
