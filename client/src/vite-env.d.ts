/// <reference types="vite/client" />

declare module 'rollup-plugin-visualizer' {
  import { Plugin } from 'vite';
  export function visualizer(options?: any): Plugin;
}
