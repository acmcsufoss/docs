export function PageHeading(props: { title: string }) {
  return (
    <h1>
      <a href="https://acmcsuf.com/teams#oss">
        <strong style="color: #21d19f;">Open Source Software</strong>
      </a>{" "}
      {props.title}
    </h1>
  );
}
