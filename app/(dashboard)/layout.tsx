import { Footer } from "../_components/footer";
import { Navbar } from "../_components/navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="h-screen w-full items-center flex flex-col justify-between bg-amber-950/30"
    >
      <Navbar />
      <div className="flex flex-grow bg-white/30 m-auto w-4/5 p-3">{children}</div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
