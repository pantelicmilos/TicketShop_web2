import { ChangeEvent, useEffect, useState } from "react";
import { RiFileUserFill } from "react-icons/ri";
import User from "../../model/User";
import validator from "validator";
import userService from "../../services/user-service";
import { useNavigate } from "react-router-dom";
import authGuardService from "../../services/auth-guard-service";
import Swal from "sweetalert2";
import { FaUserPlus } from "react-icons/fa";

const Registration = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (authGuardService.isUserLoggedIn()) navigate("/profile");
  }, []);

  const [registerErrors, setRegisterErrors] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    name: false,
    dateOfBirth: false,
    address: false,
    role: false,
    image: false,
  });

  const handleFileChange = (event: ChangeEvent) => {
    try {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        setRegisterInfo({ ...registerInfo, image: event.target.result });
      };
    } catch {
      setRegisterInfo({ ...registerInfo, image: "" });
    }
  };

  const [registerInfo, setRegisterInfo] = useState<User>({
    id: 0,
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    dateOfBirth: "",
    address: "",
    role: "",
    image: "",
  });

  const validateRegister = () => {
    let usernameError = false;
    let emailError = false;
    let passwordError = false;
    let confirmPasswordError = false;
    let nameError = false;
    let dateOfBirthError = false;
    let addressError = false;
    let roleError = false;
    let imageError = false;
    if (registerInfo.username.trim().length < 3) {
      usernameError = true;
    }
    if (!validator.isEmail(registerInfo.email)) {
      emailError = true;
    }
    if (registerInfo.password.trim().length < 6) {
      passwordError = true;
    }
    if (registerInfo.confirmPassword !== registerInfo.password) {
      confirmPasswordError = true;
    }
    if (registerInfo.name.trim().length === 0) {
      nameError = true;
    }
    if (registerInfo.dateOfBirth.length < 10) {
      dateOfBirthError = true;
    }
    if (registerInfo.address.trim().length < 6) {
      addressError = true;
    }
    if (registerInfo.role.length === 0) {
      roleError = true;
    }
    if (registerInfo.image.length === 0) {
      imageError = true;
    }
    setRegisterErrors({
      username: usernameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      name: nameError,
      dateOfBirth: dateOfBirthError,
      address: addressError,
      role: roleError,
      image: imageError,
    });

    if (
      usernameError ||
      emailError ||
      passwordError ||
      confirmPasswordError ||
      nameError ||
      dateOfBirthError ||
      addressError ||
      roleError ||
      imageError
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateRegister()) {
      userService
        .create(registerInfo)
        .then((response) => {
          navigate("/login");
          Swal.fire({
            icon: "success",
            title: "Registration successful.",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: error.response.data,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    } else {
      console.log("NOT OK");
    }
  };

  return (
    <>
      <div className="container text-center">
        <div className="row justify-content-md-center">
          <div className="col-sm-1"></div>
          <div className="col-sm-10">
            <div className="container">
              <br />
              <br />

              <h1 style={{ color: "#ffcc00" }}>
                Registracija
              </h1>
              <br />
              <br />
              <br />
            </div>
            <div className="row">
              <div className="col-sm-5">
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text w-25" id="basic-addon3">
                      Korisnicko ime
                    </span>
                    <input
                      value={registerInfo.username}
                      onChange={(event) => {
                        setRegisterInfo({
                          ...registerInfo,
                          username: event.target.value,
                        });
                      }}
                      id="username"
                      type="text"
                      className="form-control"
                      placeholder="korisnicko ime"
                    />
                  </div>
                  {registerErrors.username && (
                    <p className="text-danger">
                      Korisnicko ime mora imati bar 3 slova
                    </p>
                  )}
                </div>
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text w-25" id="basic-addon3">
                      Email
                    </span>
                    <input
                      value={registerInfo.email}
                      onChange={(event) => {
                        setRegisterInfo({
                          ...registerInfo,
                          email: event.target.value,
                        });
                      }}
                      id="email"
                      type="email"
                      className="form-control"
                      placeholder="email"
                    />
                  </div>
                  {registerErrors.email && (
                    <p className="text-danger">Email nije validan</p>
                  )}
                </div>
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text w-25" id="basic-addon3">
                      Sifra
                    </span>
                    <input
                      value={registerInfo.password}
                      onChange={(event) => {
                        setRegisterInfo({
                          ...registerInfo,
                          password: event.target.value.trim(),
                        });
                      }}
                      id="password"
                      type="password"
                      className="form-control"
                      placeholder="sifra"
                    />
                  </div>
                  {registerErrors.password && (
                    <p className="text-danger">
                      Sifra mora imati 6 znakova
                    </p>
                  )}
                </div>
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text w-25" id="basic-addon3">
                      Potvrdite
                    </span>
                    <input
                      value={registerInfo.confirmPassword}
                      onChange={(event) => {
                        setRegisterInfo({
                          ...registerInfo,
                          confirmPassword: event.target.value.trim(),
                        });
                      }}
                      id="confirmPassword"
                      type="password"
                      className="form-control"
                      placeholder="potvrdi sifru"
                    />
                  </div>
                  {registerErrors.confirmPassword && (
                    <p className="text-danger">Sifre se ne poklapaju</p>
                  )}
                </div>
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text w-25" id="basic-addon3">
                      Ime
                    </span>
                    <input
                      value={registerInfo.name}
                      onChange={(event) => {
                        setRegisterInfo({
                          ...registerInfo,
                          name: event.target.value,
                        });
                      }}
                      id="name"
                      type="text"
                      className="form-control"
                      placeholder="ime"
                    />
                  </div>
                  {registerErrors.name && (
                    <p className="text-danger">Ime je potrebno</p>
                  )}
                </div>
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text w-25" id="basic-addon3">
                      Datum rodjenja
                    </span>
                    <input
                      value={registerInfo.dateOfBirth}
                      onChange={(event) => {
                        setRegisterInfo({
                          ...registerInfo,
                          dateOfBirth: event.target.value.trim(),
                        });
                      }}
                      id="dateOfBirth"
                      type="date"
                      className="form-control"
                    />
                  </div>
                  {registerErrors.dateOfBirth && (
                    <p className="text-danger">Potrebno je uneti datum rodjenja</p>
                  )}
                </div>
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text w-25" id="basic-addon3">
                      Address
                    </span>
                    <input
                      value={registerInfo.address}
                      onChange={(event) => {
                        setRegisterInfo({
                          ...registerInfo,
                          address: event.target.value,
                        });
                      }}
                      id="address"
                      type="text"
                      className="form-control"
                      placeholder="Adresa"
                    />
                  </div>
                  {registerErrors.address && (
                    <p className="text-danger">
                      Adresa mora imati bar 6 znakova!
                    </p>
                  )}
                </div>
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text w-25" id="basic-addon3">
                      Role
                    </span>
                    <select
                      value={registerInfo.role}
                      onChange={(event) => {
                        setRegisterInfo({
                          ...registerInfo,
                          role: event.target.value.trim(),
                        });
                      }}
                      className="form-select"
                      aria-label=".form-select example"
                    >
                      <option value="">Odaberi</option>
                      <option value="admin">Administrator</option>
                      <option value="salesman">Prodavac</option>
                      <option value="customer">Kupac</option>
                    </select>
                  </div>
                  {registerErrors.role && (
                    <p className="text-danger">Izaberi ulogu</p>
                  )}
                </div>
              </div>
              <div className="col-sm-2"></div>
              <div className="col-sm-5">
                <br />
                <img
                  src={registerInfo.image}
                  className="rounded mx-auto d-block"
                  alt="IMAGE"
                  height="300"
                  width="300"
                  style={{
                    borderStyle: "solid",
                    borderWidth: "5px",
                    borderColor: "#ffcc00",
                  }}
                ></img>
                <br />
                <br />
                <div className="mb-3">
                  <div className="input-group">
                    <span className="input-group-text w-25" id="basic-addon3">
                      Photo
                    </span>
                    <input
                      className="form-control"
                      type="file"
                      id="file"
                      accept="image/png, image/jpeg, image/gif"
                      onChange={handleFileChange}
                    />
                  </div>
                  {registerErrors.image && (
                    <p className="text-danger">Ucitaj svoju sliku</p>
                  )}
                </div>
                <br />
                <br />
                <br />
                <div className="mb-3">
                  <button
                    className="btn btn-lg btn-warning"
                    onClick={handleSubmit}
                  >
                    Registracija
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-1"></div>
        </div>
      </div>
    </>
  );
};

export default Registration;
