"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Autoplay,
  FreeMode,
  Pagination,
  Thumbs,
  Navigation,
  Zoom,
} from "swiper";

import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/zoom";
import classes from "./styles.module.css";

const ProductGallery = ({ gallery }) => {
  const [navigationEnabled, setNavigationEnabled] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [modal, setModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const swiperModalRef = useRef(null);

  useEffect(() => {
    setNavigationEnabled(gallery?.length >= 4);
  }, [gallery?.length]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        if (modal && swiperModalRef.current) {
          swiperModalRef.current.swiper.slidePrev();
        } else if (swiperRef.current) {
          swiperRef.current.swiper.slidePrev();
        }
      } else if (event.key === "ArrowRight") {
        if (modal && swiperModalRef.current) {
          swiperModalRef.current.swiper.slideNext();
        } else if (swiperRef.current) {
          swiperRef.current.swiper.slideNext();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [modal]);

  // ✅ BLOKIRANJE SCROLLA KADA JE MODAL AKTIVAN
  useEffect(() => {
    if (modal) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
      document.body.style.width = "100%";

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.overflow = "";
        document.body.style.width = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [modal]);

  const productImage = gallery?.map((image, index) => (
    <SwiperSlide
      key={index}
      onClick={() => {
        setActiveIndex(index);
        setModal(true);
      }}
    >
      <Image src={image?.image} width={2000} height={2000} alt="Nimaco" />
    </SwiperSlide>
  ));

  const thumbImage = gallery?.map((image, index) => (
    <SwiperSlide key={index}>
      <Image
        src={image?.image}
        width={2000}
        height={2000}
        alt="Nimaco"
        className="cursor-pointer max-md:hidden"
      />
    </SwiperSlide>
  ));

  const modalImage = gallery?.map((image, index) => (
    <SwiperSlide key={index}>
      <div className="swiper-zoom-container w-[90vw] h-[90vh] relative">
        <Image
          src={image?.image}
          alt="Nimaco"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
    </SwiperSlide>
  ));

  return (
    <div className="col-span-2 max-md:col-span-4 md:flex md:flex-row-reverse gap-5 md:max-h-[380px] lg:max-h-[550px] xl:max-h-[680px] 2xl:max-h-[720px] 3xl:max-h-[700px]">
      <Swiper
        ref={swiperRef}
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper }}
        pagination={true}
        navigation={true}
        modules={[FreeMode, Thumbs, Pagination, Navigation]}
        className={`${classes.mySwiper2} mySwiper2 select-none`}
        breakpoints={{
          320: {
            direction: "horizontal",
            slidesPerView: 1,
            pagination: {
              clickable: true,
              enabled: true,
            },
            navigation: {
              enabled: false,
            },
          },
          768: {
            direction: "horizontal",
            slidesPerView: 1,
            pagination: {
              enabled: false,
            },
            navigation: {
              enabled: navigationEnabled,
            },
          },
        }}
      >
        {productImage}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={0}
        modules={[Navigation]}
        autoplay={true}
        navigation={navigationEnabled}
        breakpoints={{
          320: {
            enabled: false,
            navigation: {
              enabled: false,
            },
          },
          768: {
            direction: "vertical",
            slidesPerView: 4.3,
            enabled: true,
            modules: [FreeMode, Thumbs, Navigation],
            navigation: {
              enabled: gallery?.length > 4.3,
            },
          },
        }}
        freeMode={true}
        watchSlidesProgress={true}
        className={`${classes.mySwiper} mySwiper max-md:hidden select-none`}
      >
        {thumbImage}
      </Swiper>

      {modal && (
        <>
          <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-[1000]"></div>
          <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-[1000]">
            <div className="h-full py-5 flex items-center justify-center relative mt-auto">
              <Swiper
                ref={swiperModalRef}
                spaceBetween={10}
                slidesPerView={1}
                zoom={true}
                modules={[Navigation, Zoom]}
                navigation={true}
                initialSlide={activeIndex}
                className="mySwiper3 relative select-none"
              >
                {modalImage}
                <i
                  className="absolute z-[10000] top-2 right-8 fa-solid fa-times text-xl cursor-pointer hover:text-red-500"
                  onClick={() => setModal(false)}
                ></i>
              </Swiper>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductGallery;
