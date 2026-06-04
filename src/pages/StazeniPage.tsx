import { SharedNav } from "../components/SharedNav";
import { DownloadSection } from "../screens/Container/sections/DownloadSection";

export const StazeniPage = (): JSX.Element => {
  return (
    <div className="flex min-h-screen flex-col bg-[#f2f4f7]">
      <SharedNav />
      <main className="flex flex-1 flex-col items-center justify-center">
        <DownloadSection />
      </main>
    </div>
  );
};
