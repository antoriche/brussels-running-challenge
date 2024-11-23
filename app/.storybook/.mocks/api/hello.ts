import { apiUrl } from "./api";
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get(apiUrl("/hello"), () => {
    return HttpResponse.json({ message: `Hello World !` });
  }),
  http.get("http://localhost:3001/dev/abc", () => {
    return HttpResponse.json({ message: `this is abc2` });
  }),
];
