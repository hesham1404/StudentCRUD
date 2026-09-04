import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Student Management",
  description: "Student CRUD Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}