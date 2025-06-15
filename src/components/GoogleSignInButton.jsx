import './GoogleSignInButton.css'
export const GoogleSignInButton = () => {
  const handleClick = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
   
      <img
        src="/googleLogo.png"
        alt="Google sign in"
        onClick={handleClick}
        className="google-icon"
        width={40}
      />
  );
};
