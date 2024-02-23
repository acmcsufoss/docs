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
      <link rel="stylesheet" type="text/css" href="https://ethanthatonekid.github.io/dropin-minimal-css/min/hack.min.css">
      <style>
        html, body {
          margin: auto 2em;
          padding: 0;
        }
      </style>
      ${head.join("\n")}
    </head>
    <body ${attributes.body.toString()}>${body}${footer.join("\n")}</body>
  </html>`;
}
