import React from "react";
import { Link } from "react-router-dom";
import { Fragment } from "react";

function GetStartedBtn() {
  return (
    <Fragment>
      <Link to={"/signup"}>
        <button className="hidden lgss:flex lgss:px-5 px-3 py-3 bg-primary text-white capitalize rounded-[8px]">
          create an account
        </button>
      </Link>
    </Fragment>
  );
}

export default GetStartedBtn;
