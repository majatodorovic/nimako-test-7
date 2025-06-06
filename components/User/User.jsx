"use client";
import {useContext, useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";
import { post } from "@/app/api/api";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ToastContainer, toast } from "react-toastify";

import hide from "@/assets/Icons/hide-password.png";
import show from "@/assets/Icons/show-password.png";

import Registration from "../Registration/Registration";
import { userContext } from "@/context/userContext";

const UserPage = () => {
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(userContext);

  const handleOpenModal = () => {
    setIsOpen(true);
  };
  const handleCloseModal = () => {
    setIsOpen(false);
  };
  const toggleLoginPasswordVisibility = () => {
    setShowLoginPassword((prevShowLoginPassword) => !prevShowLoginPassword);
  };
  const [type, setType] = useState("password");

  const [formData, setFormData] = useState({
    email: "",
    email1: "",
    password: "",
  });

  const required = ["email", "password"];

  const [errors, setErrors] = useState([]);

  const formChangeHandler = ({ target }) => {
    setFormData({ ...formData, [target.name]: target.value });
  };
  const formSubmitHandler = () => {
    const err = [];
    if (err.length > 0) {
      setErrors(err);
      console.log(err);
    } else {
      const ret = {
        email: formData.email,
        password: formData.password,
      };
      post("/customers/sign-in/login", ret)
        .then((response) => {
          if (response?.code === 200) {
            setIsLoggedIn(true);
            sessionStorage.setItem("loggedIn", true);
            Cookies.set("customer_token", response.payload.customer_token, {
              expires: 365,
            });
            router.push("/customer-profil");
          } else {
            setErrors("Greška pri logovanju.");
            toast.error(
              "Greška pri logovanju. Proverite da li ste uneli ispravne podatke.",
              {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
              }
            );
          }
          if (response?.code === 500 || response?.code === 400) {
            setErrors(
              "Došlo je do nepoznate greške pri obrađivanju Vašeg zahteva."
            );
            toast.error(
              "Greška pri logovanju. Proverite da li ste uneli ispravne podatke.",
              {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
              }
            );
          }
        })
        .catch((error) => console.warn(error));
    }
  };

  const changePasswordHandler = () => {
    const err = [];
    if (err.length > 0) {
      setErrors(err);
      console.log(err);
    } else {
      const ret = {
        email: formData.email1,
      };
      post("/customers/sign-in/forgot-password", ret)
        .then((response) => {
          if (response?.code === 200) {
            toast.success(
              "Uspešno ste poslali zahtev. Očekujte mail sa daljim instrukcijama.",
              {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              }
            );
          } else {
            setErrors("Greška pri logovanju.");
            toast.error(
              "Greška pri logovanju. Proverite da li ste uneli ispravne podatke.",
              {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
              }
            );
          }
          if (response?.code === 500 || response?.code === 400) {
            setErrors(
              "Došlo je do nepoznate greške pri obrađivanju Vašeg zahteva."
            );
            toast.error(
              "Greška pri logovanju. Proverite da li ste uneli ispravne podatke.",
              {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
              }
            );
          }
        })
        .catch((error) => console.warn(error));
    }
  };

    ;

  return (
    <>
      <ToastContainer />
      <div className="mx-auto">
        <div className="mx-auto grid grid-cols-6 gap-y-3 gap-x-3 sm:mt-8 ">
          <div className="col-span-6 p-1 sm:col-span-3 px-8 bg-[#f0f0f080] rounded-lg py-[9rem] md:ml-[2rem] max-md:mx-[1rem] max-md:mt-[1rem] mb-[2rem]">
            <div className="h-[100%] flex flex-col items-center">
              <div className="loginHolder">
                <h3 className="font-semibold text-xl underline">
                  POSEDUJETE PROFIL?
                </h3>
                <p className="mb-[2rem] mt-[0.4rem] font-thin text-[#4b4b4b]">
                  Ulogujte se.
                </p>
                <form className="flex flex-col">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={formChangeHandler}
                    placeholder="E-mail:"
                    className="lg:w-[24rem] bg-white rounded-lg border-0 py-[0.6rem]"
                  />

                  <div className="flex relative">
                    <input
                      name="password"
                      type={showLoginPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={formChangeHandler}
                      id="password"
                      placeholder="Lozinka*"
                      className="mt-[0.6rem] block lg:w-[24rem] bg-white rounded-lg border-0 py-[0.6rem] lg:mr-[0.6em] w-full"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleLoginPasswordVisibility();
                      }}
                      className="max-lg:absolute max-lg:-right-[2rem] lg:right-[2rem] top-[1rem]"
                    >
                      {showLoginPassword ? (
                        <Image
                          src={hide}
                          alt="hide password"
                          width={22}
                          height={22}
                        />
                      ) : (
                        <Image
                          src={show}
                          alt="show password"
                          width={22}
                          height={22}
                        />
                      )}
                    </button>
                  </div>
                </form>
                <div className="flex justify-between mt-[2rem] align-center">
                  <button
                    onClick={handleOpenModal}
                    className="underline lg:ml-[0.6rem] font-thin block text-sm"
                  >
                    Zaboravili ste lozinku?
                  </button>
                  {isOpen && (
                    <div
                      className={`max-md:z-[20000] fixed max-md:mx-auto max-md:overflow-y-scroll scale-100 transition-all duration-500 z-[101] top-0 left-0 w-screen h-screen flex items-center justify-center popup`}
                    >
                      <div
                        className={`
                        bg-white max-md:overflow-y-scroll  p-[40px] flex flex-col relative borderThin`}
                      >
                        <h3 className="font-semibold text-xl underline">
                          ZABORAVILI STE LOZINKU?
                        </h3>
                        <p className="mb-[2rem] mt-[0.4rem] font-thin text-[#4b4b4b]">
                          Unesite e-mail adresu da biste poništili lozinku.
                        </p>
                        <form>
                          <input
                            name="email1"
                            type="email"
                            autoComplete="off"
                            placeholder="E-mail:"
                            value={formData.email1}
                            onChange={formChangeHandler}
                            className="lg:w-[24rem] rounded-lg bg-[#f5f5f6] border-0 py-[0.6rem] w-full"
                          />
                        </form>
                        <button
                          onClick={changePasswordHandler}
                          className="bg-croonus-3 rounded-lg text-white py-[0.7rem] px-[1.3rem] text-sm hover:bg-opacity-70 w-fit mt-[0.6rem] ml-auto"
                        >
                          RESETUJ LOZINKU
                        </button>
                        <button
                          onClick={handleCloseModal}
                          className="absolute top-2 right-3"
                        >
                          X
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={formSubmitHandler}
                    className="bg-croonus-3 rounded-lg text-white py-[0.7rem] px-[1.3rem] text-sm hover:bg-opacity-70 lg:mr-[2rem] max-lg:ml-[2rem] max-md:whitespace-nowrap"
                  >
                    PRIJAVI SE
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-6 p-1 sm:col-span-3 px-8 bg-[#f0f0f080] rounded-lg py-[9rem] md:mr-[2rem] max-md:mx-[1rem] max-md:mt-[1rem] mb-[2rem]">
            <Registration />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPage;
