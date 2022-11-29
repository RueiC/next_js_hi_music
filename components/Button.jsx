const Button = ({ styles }) => {
  return (
    <button
      className={`${styles} bg-blue-gradient font-medium  text-primary rounded-[10px] px-10 py-3 text-[17px] outline-none hover:scale-105 duration-300 transition-all ease-in-out`}
      type="button"
    >
      立即開始
    </button>
  );
};

export default Button;
