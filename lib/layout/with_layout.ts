import { Helmet, renderSSR } from "#/deps.ts";

// deno-lint-ignore no-explicit-any
export function withLayout(component: any) {
  const html = renderSSR(component);
  const { body, head, footer, attributes } = Helmet.SSR(html);
  return `<!DOCTYPE html>
  <html ${attributes.html.toString()}>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        html, body {
          margin: 0;
          padding: 0;
        }
      </style>
      ${head.join("\n")}
    </head>
    <body ${attributes.body.toString()}>${body}${footer.join("\n")}</body>
  </html>`;
}
