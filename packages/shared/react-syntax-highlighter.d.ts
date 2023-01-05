declare module "react-syntax-highlighter/dist/cjs/styles/prism" {
  export { default as oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism/one-dark";
  export { default as oneLight } from "react-syntax-highlighter/dist/cjs/styles/prism/one-light";
}

declare module "react-syntax-highlighter/dist/cjs/styles/prism/one-dark" {
  const style: { [key: string]: React.CSSProperties };
  export default style;
}

declare module "react-syntax-highlighter/dist/cjs/styles/prism/one-light" {
  const style: { [key: string]: React.CSSProperties };
  export default style;
}
