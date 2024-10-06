import { Footer } from "../_components/footer";
import { Navbar } from "../_components/navbar";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="h-screen w-full bg-cover items-center flex flex-col justify-between"
      style={{ backgroundImage: "url('/wallpaper.jpg')" }}
    >
      <Navbar />
      <div>{children}</div>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
