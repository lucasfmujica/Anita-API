import pluginJs from "@eslint/js";
import globals from "globals";


export default [
  {
    files: ["clinic-booking.js"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
];
