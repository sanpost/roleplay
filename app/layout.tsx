import "bootstrap/dist/css/bootstrap.css";
import ProvidersWrapper from "./ProvidersWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <head> */}
      <head />
      <body>
        <ProvidersWrapper>{children}</ProvidersWrapper>
      </body>
    </html>
  );
}
