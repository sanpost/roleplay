import { Navbar } from "./_components/navbar";

const DashboardLayout = (
    { children }: { children: React.ReactNode }
) => {
    return (
        <div className="h-full">
            <div className="h-full pt-40">
                <Navbar />
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;