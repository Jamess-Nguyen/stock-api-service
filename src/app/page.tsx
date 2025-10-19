import Image from "next/image";
import { ResponseBox } from "./components/ui/ResponseBox";
export default function Home() {
  return (
    <main>
      <div className="w-1/2 mx-auto min-w-1/2">
        <ResponseBox data="sup!" title="title"/>
      </div>
    </main>
  );
}
