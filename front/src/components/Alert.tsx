import { BsFillCheckCircleFill, BsFillXCircleFill } from "react-icons/bs";
import { MdPending } from "react-icons/md";

interface Props {
  color: string;
  status: string;
}

function Alert({ color, status }: Props) {
  return (
    <>
      <div className={"alert " + color}>
        {status}
        {color === "alert-danger" && (
          <BsFillXCircleFill style={{ marginLeft: "1%" }} />
        )}
        {color === "alert-success" && (
          <BsFillCheckCircleFill style={{ marginLeft: "1%" }} />
        )}
        {color === "alert-warning" && (
          <MdPending size="30" style={{ marginLeft: "1%" }} />
        )}
      </div>
    </>
  );
}

export default Alert;
