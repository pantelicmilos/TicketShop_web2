import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaSignInAlt } from "react-icons/fa";
import authService from "../../services/authentication-service";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import authGuardService from "../../services/auth-guard-service";
import { useEffect } from "react";
import { LoginSocialGoogle } from "reactjs-social-login";
import { GoogleLoginButton } from "react-social-login-buttons";

const schema = z.object({
  email: z.string().email({ message: "E-mail is not valid" }),
  password: z
    .string()
    .min(6, { message: "Password must contain at least 6 characters" }),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (authGuardService.isUserLoggedIn()) navigate("/profile");
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FieldValues) => {
    authService
      .login(data)
      .then((response) => {
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("status", response.data.status);
        window.location.reload();
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: error.response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  const googleLogin = (data: any) => {
    const loginInfo = {
      token: data.access_token,
      email: data.email,
      name: data.name,
      picture: data.picture,
    };
    authService
      .googleLogin(loginInfo)
      .then((response) => {
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("role", response.data.role);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("status", response.data.status);
        window.location.reload();
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: error.response.data,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container text-center">
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <div className="container-fluid text-center">
            <h1 style={{ color: "#ffcc00" }}>
              Logovanje
            </h1>
          </div>
          <br />
          <br />
          <br />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-sm-3"></div>
            <div className="col-sm-6">
              <div className="mb-3 text-center">
                <div className="input-group">
                  <span className="input-group-text w-25" id="basic-addon3">
                    Email
                  </span>
                  <input
                    {...register("email")}
                    id="email"
                    placeholder="email"
                    type="email"
                    className="form-control"
                  />
                </div>
                {errors.email && (
                  <p className="text-danger">{errors.email.message}</p>
                )}
              </div>
              <div className="mb-3 text-center">
                <div className="input-group">
                  <span className="input-group-text w-25" id="basic-addon3">
                    Sifra
                  </span>
                  <input
                    {...register("password")}
                    id="password"
                    placeholder="sifra"
                    type="password"
                    className="form-control"
                  />
                </div>
                {errors.password && (
                  <p className="text-danger">{errors.password.message}</p>
                )}
              </div>
              <br />
              <div className="text-center">
                <button type="submit" className="btn btn-warning btn-lg">
                  Uloguj se
                </button>
              </div>
            </div>
            <div className="col sm-3"></div>
          </div>
        </div>
      </form>
      <br />
      <div className="container-fluid text-center">
        <div className="row">
          <div className="col-sm-4"></div>
          <div className="col-sm-4">
            <LoginSocialGoogle
              client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              scope="openid profile email"
              discoveryDocs="claims_supported"
              access_type="offline"
              onResolve={({ data }) => {
                googleLogin(data);
              }}
              onReject={(error) => {
                Swal.fire({
                  icon: "error",
                  title: error,
                  showConfirmButton: false,
                  timer: 1500,
                });
              }}
            >
              <GoogleLoginButton
                style={{
                  borderStyle: "solid",
                  borderWidth: "3px",
                  borderColor: "#ffcc00",
                }}
              />
            </LoginSocialGoogle>
          </div>
          <div className="col-sm-4"></div>
        </div>
      </div>
    </>
  );
};

export default Login;
