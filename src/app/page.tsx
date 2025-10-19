import Image from "next/image";
import { ResponseBox } from "./components/ui/ResponseBox";
export default function Home() {
  return (
    <main>
      <div className="w-3/4 mx-auto">
        <ResponseBox data="sup!" title="title"/>
      </div>
    </main>
  );
}
