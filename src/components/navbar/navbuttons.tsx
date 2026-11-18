import Link from "next/link";

const NavButtons = () => {
  return (
    <>
      <Link className="nav-sign-in" href="/signin">
        Sign in
      </Link>
      <Link className="nav-sign-up gradient-surface" href="/signup">
        Sign up
      </Link>
    </>
  );
};

export default NavButtons;
