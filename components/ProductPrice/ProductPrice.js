"use client";
import { currencyFormat } from "@/helpers/functions";
import { usePathname } from "next/navigation";


const ProductPrice = ({ price, inventory, className, handlePrice }) => {
  const pathname = usePathname();
  switch (true) {
    case price?.price_defined && inventory?.amount !== null:
      handlePrice ? handlePrice(price?.price?.original) : null;
      return (
        <div className={`flex items-center gap-3`}>
          {price?.price?.discount !== null ? (

            <div className="group relative">
              <span className="z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition bg-[#044e7b] text-white p-[6px] rounded absolute -top-[50px] left-0 text-[10px]">
                Cena sa popustom
                <svg className="absolute z-50 w-6 h-6 text-[#044e7b] transform left-[45%] -translate-x-1/2 -translate-y-[2px] fill-current stroke-current" width="8" height="8">
                  <rect x="12" y="-10" width="8" height="8" transform="rotate(45)" />
                </svg>
              </span>
              <div className={`${className}`}>
               {currencyFormat(price?.price?.discount)}
              </div>
            </div>

          ) : (
            <div className={className}>{currencyFormat(price?.price?.original)}</div>
          )}
        </div>

      );

    case price?.price_defined && inventory?.amount === null:
      handlePrice ? handlePrice(price?.price?.original) : null;
      return (
        <>
          {price?.price?.discount !== null ? (

            <div className="group relative inline-block">
              <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition bg-[#044e7b] text-white p-[6px] rounded absolute -top-[50px] left-[15%] text-[10px] font-normal">
                Cena sa popustom
                <svg className="absolute z-50 w-6 h-6 text-[#044e7b] transform left-[45%] -translate-x-1/2 -translate-y-[2px] fill-current stroke-current" width="8" height="8">
                  <rect x="12" y="-10" width="8" height="8" transform="rotate(45)" />
                </svg>
              </span>
              <div className={`${className}`}>

                {currencyFormat(price?.price?.discount)}
              </div>
            </div>
          ) : (
            <>
              {" "}
              <div className={className}>{currencyFormat(price?.price?.original)}</div>
            </>
          )}
        </>
      );

    case !price?.price_defined && inventory?.amount !== null:
      handlePrice ? handlePrice("Cena na upit") : null;
      return <h1 className={className}>Cena na upit</h1>;

    case !price?.price_defined && inventory?.amount === null:
      handlePrice ? handlePrice("Cena na upit") : null;

      return <h1 className={className}>Cena na upit</h1>;

    default:
      return null;
  }
};

export default ProductPrice;
