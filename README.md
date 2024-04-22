# docs

This is a static documentation site for the
[**@acmcsufoss**](https://github.com/acmcsufoss) organization.

The
[Open Source Software team documentation website](https://acmcsufoss.github.io/docs)
(<https://acmcsuf.com/oss-docs>) enables visitors to track active projects, find
contribution opportunities, and access workshop resources.

## Contributing

We welcome contributions from everyone!

### Projects

If you would like to contribute to the projects documentation, the markdown
files are located in the `projects` directory. One markdown file represents one
project. The file name should be a project ID with the `.md` extension.

```md
---
title: "acmcsuf.com"
repository: "https://acmcsuf.com/code"
participants: ["@EthanThatOneKid"]
labels: ["svelte", "typescript"]
---

# acmcsuf.com

## Description

Official website of CSUF's ACM club.
```

### Workshops

If you would like to contribute to the workshops documentation, the markdown
files are located in the `workshops` directory. One markdown file represents one
series of workshops. The file name should be a workshop series ID with the `.md`
extension.

```md
---
workshops:
  - title: "Spring 2024 Open Source Software Kickoff"
    description: "Launch into the vast expanse of collaborative development, exploring new frontiers and innovating together!"
    timestamp: "2024-02-08"
    url: "https://acmcsuf.com/spring24-oss-kickoff"
  - title: "Making First Contributions"
    description: "Make your first open source contribution and learn the basics of Git and GitHub."
    timestamp: "2024-02-15"
    url: "https://acmcsuf.com/1st-slides"
  - title: "How to win FullyHacks"
    description: "How to win a hackathon, and how to win FullyHacks in particular."
    timestamp: "2024-02-22"
    url: "https://acmcsuf.com/winning-fh"
---

# Spring 2024 workshops

Workshops are a great way to learn new skills and meet new people. Here are the
workshops we have hosted during the Spring 2024 semester.
```

## Development

Make sure to install Deno:
<https://deno.land/manual/getting_started/installation>.

Build the project:

```sh
deno task build
```

Build the project in development mode:

```sh
deno task dev
```

Serve the static site:

```sh
deno task serve
```

Format the project:

```sh
deno fmt
```

Check for common errors:

```sh
deno lint
deno task check
```

## References

- <https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax>

---

Maintained with 💚 [**@acmcsufoss**](https://github.com/acmcsufoss)
