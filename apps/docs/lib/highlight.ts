import { codeToHtml } from "shiki";

export async function highlightCode(code: string, lang = "tsx"): Promise<string> {
  return codeToHtml(code, {
    lang,
    themes: {
      light: "github-light",
      dark: "github-dark",
    },
    defaultColor: false,
    transformers: [
      {
        line(node, line) {
          node.properties.class = "line";
          node.properties["data-line"] = String(line);
        },
      },
    ],
  });
}
