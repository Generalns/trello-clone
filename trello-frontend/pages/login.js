import { useState } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { ImCheckmark } from "react-icons/im";
import { GrClose } from "react-icons/gr";
import { useCookies } from "react-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "15px",
};
const Login = () => {
  const { push } = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [cookies, setCookie] = useCookies(["user_name", "email", "user_id"]);
  console.log("Cookies: ", cookies);
  const setCookieHandler = (user_name, email, user_id) => {
    console.log("sa");
    setCookie("user_name", user_name, {
      path: "/",
    });
    setCookie("email", email, {
      path: "/",
    });
    setCookie("user_id", user_id, {
      path: "/",
    });
  };
  useEffect(() => {
    if (cookies.user_id) {
      setTimeout(function () {
        push("/");
      }, 5000);
    }
  }, [cookies]);
  const handleSwitchForm = () => {
    setIsLogin(!isLogin);
  };
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [open, setOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="max-w-sm w-full px-6 py-8 bg-white rounded-lg shadow-xl">
        <div className="flex">
          <button
            className={`w-1/2 px-4 py-2 rounded-tl-lg ${
              isLogin
                ? "bg-gradient-to-r from-blue-900 to-indigo-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
            onClick={handleSwitchForm}>
            Login
          </button>
          <button
            className={`w-1/2 px-4 py-2 rounded-tr-lg ${
              isLogin
                ? "bg-gray-200 text-gray-600"
                : "bg-gradient-to-r from-blue-900 to-indigo-600 text-white"
            }`}
            onClick={handleSwitchForm}>
            Register
          </button>
        </div>
        <div className="mt-6">
          {isLogin ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                axios
                  .post("http://localhost:8080/api/auth/signin", {
                    email: loginEmail,
                    password: loginPassword,
                  })
                  .then((res) => {
                    console.log(res);
                    setOpen(true);
                    setCookieHandler(
                      res.data.username,
                      res.data.email,
                      res.data.id
                    );
                  })
                  .catch((err) => {
                    window.alert("Wrong credentials");
                    console.log("Something went wrong", err);
                  });
              }}>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style} className="relative">
                  <GrClose
                    className="absolute right-4 top-4 text-lg cursor-pointer"
                    onClick={() => {
                      setOpen(false);
                    }}
                  />
                  <p className="text-center text-3xl">Successfull</p>
                  <div className="my-4 w-full flex items-center justify-center">
                    <ImCheckmark className="text-6xl text-green-600" />
                  </div>
                  <p className="text-center text-lg font-light">
                    You are successfully logged in.
                  </p>
                </Box>
              </Modal>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  placeholder="Enter your email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-base font-semibold text-white bg-gradient-to-r from-blue-900 to-indigo-600 rounded-lg hover:bg-gradient-to-r hover:from-blue-800 hover:to-indigo-500 focus:outline-none focus:bg-gradient-to-r focus:from-blue-600 focus:to-indigo-400">
                Login
              </button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                axios
                  .post("http://localhost:8080/api/auth/signup", {
                    username: firstName + " " + lastName,
                    email: email,
                    password: password,
                  })
                  .then(() => {
                    console.log("Successfully registered");
                    handleOpen();
                  })
                  .catch((err) => {
                    console.log("some error occured: ", err);
                  });
              }}>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style} className="relative">
                  <GrClose
                    className="absolute right-4 top-4 text-lg cursor-pointer"
                    onClick={() => {
                      setOpen(false);
                      setIsLogin(true);
                    }}
                  />
                  <p className="text-center text-3xl">Successfull</p>
                  <div className="my-4 w-full flex items-center justify-center">
                    <ImCheckmark className="text-6xl text-green-600" />
                  </div>
                  <p className="text-center text-lg font-light">
                    Account is successfully created please login with your
                    credentials.
                  </p>
                </Box>
              </Modal>
              <div className="mb-4">
                <label
                  htmlFor="firstName"
                  className="block mb-2 text-sm font-medium text-gray-600">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="lastName"
                  className="block mb-2 text-sm font-medium text-gray-600">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-600">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-600">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="passwordConfirm"
                  className="block mb-2 text-sm font-medium text-gray-600">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="passwordConfirm"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                  placeholder="Confirm your password"
                  value={passwordRepeat}
                  onChange={(e) => setPasswordRepeat(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-base font-semibold text-white bg-gradient-to-r from-blue-900 to-indigo-600 rounded-lg hover:bg-gradient-to-r hover:from-blue-800 hover:to-indigo-500 focus:outline-none focus:bg-gradient-to-r focus:from-blue-600 focus:to-indigo-400">
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
