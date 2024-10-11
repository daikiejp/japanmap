import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import banner2 from 'rollup-plugin-banner2';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.cjs.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'auto',
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
        plugins: [banner2(() => `"use client";\n`)],
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        extensions: ['.css'],
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        useTsconfigDeclarationDir: true,
        sourceMap: true,
      }),
      postcss({
        modules: true,
        extract: false,
        minimize: true,
        sourceMap: true,
      }),
      json(),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];
