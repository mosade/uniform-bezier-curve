import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
// import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
import { babel } from "@rollup/plugin-babel";
import pkg from "./package.json";
const production = !process.env.ROLLUP_WATCH;
const extensions = [".ts", ".js", ".json"];
const babelRuntimeVersion = pkg.devDependencies["@babel/runtime"].replace(
  /^[^0-9]*/,
  ""
);
export default [
  {
    input: "src/index.js",
    output: {
      name: "uniformBezier",
      file: "dist/uniform-bezier.iife.js",
      format: "umd", // immediately-invoked function expression — suitable for <script> tags
      sourcemap: true,
    },
    plugins: [
      resolve(), // tells Rollup how to find date-fns in node_modules
      commonjs(), // converts date-fns to ES modules
      babel({
        extensions,
        babelHelpers: "runtime",
        presets: [
          [
            "@babel/preset-env",
            {
              targets: "> 0.25%, not dead",
            },
          ],
        ],
        plugins: [["@babel/plugin-transform-runtime", { useESModules: true }]],
      }),
      terser()
      // production && terser() // minify, but only in production
    ],
  },
  {
    input: "src/index.js",
    output: {
      file: "dist/uniform-bezier.esm.js",
      format: "esm", // immediately-invoked function expression — suitable for <script> tags
      sourcemap: true,
    },
    plugins: [
        resolve(), // tells Rollup how to find date-fns in node_modules
        commonjs(), // converts date-fns to ES modules
        babel({
          extensions,
          babelHelpers: "runtime",
          presets: [
            [
              "@babel/preset-env",
              {
                targets: "> 0.25%, not dead",
              },
            ],
          ],
          plugins: [["@babel/plugin-transform-runtime", { useESModules: true }]],
        }),
        // production && terser() // minify, but only in production
      ],
  },
];
