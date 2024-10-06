import { Footer } from "../_components/footer";
import { Navbar } from "../_components/navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="h-screen w-full items-center flex flex-col justify-between bg-amber-950/30"
    >
      <Navbar />
      <div className="flex flex-grow w-full bg-white px-32">{children}</div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
