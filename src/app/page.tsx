import Image from "next/image";
import { ResponseBox } from "./components/ui/ResponseBox";
export default function Home() {
  return (
    <main>
      <ResponseBox data="sup!" title="title"/>
    </main>
  );
}
