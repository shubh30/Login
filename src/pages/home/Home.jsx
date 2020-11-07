import React, { useState } from "react";

// components
import Phone from "../../components/phone/Phone";
import OTP from "../../components/phone/OTP";
import SignUp from "../../components/signUp/SignUp";
import Verification from "../../components/email/EmailVerification";

const Home = () => {
  const [show, setShow] = useState({
    phone: true,
    otp: false,
    signUp: false,
    verification: false,
  });
  return (
    <div>
      {show.phone && <Phone setShow={setShow} />}
      {show.otp && <OTP setShow={setShow} />}
      {show.signUp && <SignUp setShow={setShow} />}
      {show.verification && <Verification setShow={setShow} />}
    </div>
  );
};

export default Home;