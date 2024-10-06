import { Footer } from "../_components/footer";
import { Navbar } from "../_components/navbar";

const MarketingLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div className="h-full">
            <Navbar />
            <div className="h-full pt-40">
                {children}
            </div>
            <Footer />
        </div>
    );
};

export default MarketingLayout;