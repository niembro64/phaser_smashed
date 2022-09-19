import { Link } from "react-router-dom";

function Start() {
  return (
    <>
      <Link to={"/play"}>
        <button className="btn btn-primary px-4">
        <span>Start</span>
        </button>
      </Link>
    </>
  );
}

export default Start;
