function H1Text({ h2Text, pText, className = "" }) {
  return (
    <div className="flex flex-col gap-2 text-center">
      <h2 className={`font-semibold text-2xl lgss:text-3xl ${className}`}>
        {h2Text}
      </h2>
      {pText && <p className="font-medium">{pText}</p>}
    </div>
  );
}

export default H1Text;
