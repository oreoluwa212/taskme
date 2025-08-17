import { useNavigate } from "react-router-dom";
import HeaderBg from "../headerText/HeaderBg";
import H1Text from "../headerText/H1Text";
import Button from "../../ui/Button";

function JoinUsSection() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col justify-center items-center h-fit lgss:py-20 mb-10">
      <HeaderBg headerText={"join us"} />
      <div className="w-[80%] lgss:w-[40%]">
        <H1Text
          h2Text={"Join Us"}
          pText={
            "Whether you're a freelancer juggling multiple projects, a small business owner looking to streamline your workflow, TaskMe is here for you."
          }
        />
      </div>
      <Button
        variant="primary"
        size="lg"
        className="my-14"
        onClick={() => navigate("/login")}
      >
        Start your journey for free
      </Button>
    </div>
  );
}

export default JoinUsSection;
