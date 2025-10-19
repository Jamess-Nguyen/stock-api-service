type ResponseBoxProps = {
  data : string 
  title: string
  maxHeight?: string
}

export function ResponseBox({data, title, maxHeight = "50vh"}: ResponseBoxProps) {
  return (
    <section aria-label={title} style={{ maxHeight }}>
      <p>{data}</p>
    </section>
  );
}