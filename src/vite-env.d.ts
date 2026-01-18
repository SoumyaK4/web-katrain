/// <reference types="vite/client" />

declare module '*.sgf?raw' {
  const content: string;
  export default content;
}
