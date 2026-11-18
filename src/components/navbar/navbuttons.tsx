import Link from "next/link";

const NavButtons = () => {
  return (
    <>
      <Link className="nav-sign-in" href="/sign-in">
        Sign in
      </Link>
      <Link className="nav-sign-up gradient-surface" href="/sign-up">
        Sign up
      </Link>
    </>
  );
};

export default NavButtons;
