import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import typescript from "rollup-plugin-typescript2";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";

/* eslint-disable import/no-default-export */
const config = {
  input: "./src/index.ts",
  output: {
    name: "GhImgUploader",
    sourcemap: !process.env.MINIFY
  },
  external: [], // eslint-disable-line global-require
  plugins: [
    typescript({
      tsconfig: "tsconfig.prod.json"
    }),
    json(),
    resolve({
      preferBuiltins: true
    }),
    commonjs(),
    babel({ babelHelpers: "bundled" }),
    replace({
      preventAssignment: true,
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    })
  ]
};

if (process.env.MINIFY) {
  config.plugins.push(terser());
}

export default config;
