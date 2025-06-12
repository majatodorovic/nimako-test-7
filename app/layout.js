import { CartContextProvider } from "./api/cartContext";
import Script from "next/script";
import Navigation from "@/components/Navigation/Navigation";
import NavigationMobile from "@/components/Navigation/NavigationMobile";
import Footer from "@/components/Footer/Footer";
import TopBar from "@/components/TopBar/TopBar";
import { AppWrapper } from "../context/state";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import "keen-slider/keen-slider.min.css";
import CookieAlert from "@/components/CookieAlert/CookieAlert";
import { QueryProvider } from "@/components/QueryProvider/QueryProvider";
import Newsletter from "@/components/Newsletter/Newsletter";
import { UserProvider } from "@/context/userContext";

export const metadata = {
  title: "Početna | Nimaco",
  description: "Dobrodošli na online prodavnicu Nimaco.",
};

export default function RootLayout({ children }) {
  return (
    <QueryProvider>
      <UserProvider>
        <AppWrapper>
          <CartContextProvider>
            <html lang="en">
              <head>
                <Script
                  dangerouslySetInnerHTML={{
                    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'
https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MVSB85CJ');`,
                  }}
                />
                <link
                  rel={`stylesheet`}
                  href={`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css`}
                />

                <Script
                  src={`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/js/regular.js`}
                ></Script>
              </head>
              <body className="bg-white">
                <noscript>
                  <iframe
                    src="
https://www.googletagmanager.com/ns.html?id=GTM-MVSB85CJ"
                    height="0"
                    width="0"
                    style="display:none;visibility:hidden"
                  ></iframe>
                </noscript>

                <TopBar />
                <Navigation />
                <CookieAlert />
                <NavigationMobile />
                {children}
                <Newsletter />
                <Footer />
                {/* <Credits /> */}
              </body>
            </html>
          </CartContextProvider>
        </AppWrapper>
      </UserProvider>
    </QueryProvider>
  );
}
