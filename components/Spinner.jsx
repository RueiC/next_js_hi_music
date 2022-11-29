import ClipLoader from "react-spinners/ClipLoader";

const Spinner = () => (
  <div className="flex items-center justify-center w-full h-full z-10">
    <ClipLoader color="#00f6ff" size={100} speedMultiplier={0.8} />
  </div>
);

export default Spinner;
