import { defineConfig } from "orval";

export default defineConfig({
  setmeter: {
    output: {
      mode: "tags-split",
      target: "src/api",
      schemas: "src/models",
      client: "react-query",
      override: {
        mutator: {
          path: "src/utils/axiosInstance.ts",
          name: "customInstance",
        },
      },
    },
    input: {
      target: "http://localhost:8000/openapi.json",
    },
  },
});
