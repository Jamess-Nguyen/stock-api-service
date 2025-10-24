type ResponseBoxProps = {
  data : string | object
  title: string
  maxHeight?: string
}

export function ResponseBox({data, title, maxHeight = "50vh"}: ResponseBoxProps) {
  return (
    <section 
      aria-label={title} 
      style={{ maxHeight }}
      className="rounded-2xl border border-gray-200 bg-gray-100 p-4 shadow-sm overflow-auto text-sm"
    >
      { typeof data === "string" ? (
        <p className="text-black-300 text-center">{data}</p>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </section>
  );
}