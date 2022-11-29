import { getProviders, getSession } from "next-auth/react";
import {
  Navbar,
  Hero,
  Stats,
  Business,
  Testimonials,
  CTA,
  Footer,
  RegistrationForm,
} from "../components/index";

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/browse",
      },
    };
  }

  const providers = await getProviders();

  return {
    props: { providers },
  };
};

export default function Home({ providers }) {
  return (
    <>
      <div className="bg-primary w-full overflow-hidden">
        <div
          className={
            "flex justify-center items-center px-[4rem] md:px-[10rem] sm:px-[12rem] lg:px-[15rem]"
          }
        >
          <div className={"xl:max-w-[1280px] w-full"}>
            <Navbar />
          </div>
        </div>

        <div
          className={
            "flex justify-center items-start px-[4rem] md:px-[10rem] sm:px-[12rem] lg:px-[15rem] bg-primary"
          }
        >
          <div className={"xl:max-w-[1280px] w-full"}>
            <Hero />
          </div>
        </div>

        <div
          className={
            "flex justify-center items-start px-[4rem] md:px-[10rem] sm:px-[12rem] lg:px-[15rem] bg-primary"
          }
        >
          <div className={"xl:max-w-[1280px] w-full"}>
            <Stats />
            <Business />
            <Testimonials />
            <CTA />
            <Footer />
          </div>
        </div>
      </div>

      <RegistrationForm providers={providers} />
    </>
  );
}
