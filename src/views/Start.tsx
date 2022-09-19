import { Link } from "react-router-dom";

function Start() {
  return (
    <>
      <Link to={"/play"}>
        <button className="btn btn-dark px-4">
          <big>Start</big>
        </button>
      </Link>
    </>
  );
}

export default Start;
