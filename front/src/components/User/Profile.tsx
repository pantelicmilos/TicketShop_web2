import { ChangeEvent, useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import Alert from "../Alert";
import UserDTO from "../../DTO/UserDTO";
import Swal from "sweetalert2";
import userService from "../../services/user-service";
import authGuardService from "../../services/auth-guard-service";
import { useNavigate } from "react-router";

const Profile = () => {
  const [editErrors, setEditErrors] = useState({
    name: false,
    username: false,
    address: false,
    password: false,
    dateOfBirth: false,
  });

  const [user, setUser] = useState<UserDTO>({
    id: 0,
    username: "",
    password: "",
    name: "",
    dateOfBirth: "",
    address: "",
    image: "",
    status: "",
  });

  const navigate = useNavigate();
  useEffect(() => {
    if (!authGuardService.isUserLoggedIn()) {
      navigate("/login");
    }
    userService
      .getById(parseInt(localStorage.getItem("id")))
      .then((response) => {
        setUser({
          id: response.data.id,
          username: response.data.username,
          password: "",
          name: response.data.name,
          dateOfBirth: response.data.dateOfBirth.slice(0, 10),
          address: response.data.address,
          image: response.data.image,
          status: response.data.status,
        });
      });
  }, []);

  const handleSubmit = () => {
    if (validateEdit()) {
      userService
        .update(user)
        .then((response) => {
          setUser({
            id: response.data.id,
            username: response.data.username,
            password: "",
            name: response.data.name,
            dateOfBirth: response.data.dateOfBirth.slice(0, 10),
            address: response.data.address,
            image: response.data.image,
            status: response.data.status,
          });
          Swal.fire({
            icon: "success",
            title: "Personal information is updated successfully.",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((error) => console.log(error.response.data));
    } else {
      console.log("BAD");
    }
  };

  const validateEdit = () => {
    let nameError = false;
    let usernameError = false;
    let passwordError = false;
    let dateError = false;
    let addressError = false;
    if (user.name.trim().length === 0) {
      nameError = true;
    }
    if (user.username.trim().length < 3) {
      usernameError = true;
    }
    if (user.password.trim().length < 6 && user.password.trim().length > 0) {
      passwordError = true;
    }
    if (user.dateOfBirth.trim().length === 0) {
      dateError = true;
    }
    if (user.address.trim().length < 6) {
      addressError = true;
    }
    setEditErrors({
      name: nameError,
      username: usernameError,
      password: passwordError,
      dateOfBirth: dateError,
      address: addressError,
    });

    if (
      nameError ||
      usernameError ||
      passwordError ||
      dateError ||
      addressError
    ) {
      return false;
    }
    return true;
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    var reader = new FileReader();
    try {
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        setUser({ ...user, image: event.target.result });
      };
    } catch {
      setUser({ ...user, image: "" });
    }
  };

  return (
    <>
      <div className="container-fluid text-center">
        <br />
        <br />
        <h1 style={{ color: "#ffcc00" }}>
          Profil
        </h1>
        <br />
        <br />
        <div className="row">
          <div className="col-sm-5">
            <br />
            <div className="mb-5">
              <div className="input-group">
                <span className="input-group-text w-25" id="basic-addon3">
                  Korisnicko ime
                </span>
                <input
                  value={user.username}
                  onChange={(event) =>
                    setUser({ ...user, username: event.target.value })
                  }
                  id="username"
                  type="text"
                  className="form-control"
                  placeholder="korisnicko ime"
                />
              </div>
              {editErrors.username && (
                <p className="text-danger">
                  Korisnicko ime mora imati 3 slova
                </p>
              )}
            </div>
            <div className="mb-5">
              <div className="input-group">
                <span className="input-group-text w-25" id="basic-addon3">
                  Sifra
                </span>
                <input
                  value={user.password}
                  onChange={(event) =>
                    setUser({ ...user, password: event.target.value })
                  }
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder="sifra"
                />
              </div>
              {editErrors.password && (
                <p className="text-danger">
                  Sifra mora imati 6 znakova
                </p>
              )}
            </div>
            <div className="mb-5">
              <div className="input-group">
                <span className="input-group-text w-25" id="basic-addon3">
                  Ime
                </span>
                <input
                  value={user.name}
                  onChange={(event) =>
                    setUser({ ...user, name: event.target.value })
                  }
                  id="name"
                  type="text"
                  className="form-control"
                  placeholder="Name"
                />
              </div>
              {editErrors.name && (
                <p className="text-danger">Ime je neophodno</p>
              )}
            </div>

            <div className="mb-5">
              <div className="input-group">
                <span className="input-group-text w-25" id="basic-addon3">
                  Rodjenje
                </span>
                <input
                  value={user.dateOfBirth}
                  onChange={(event) =>
                    setUser({ ...user, dateOfBirth: event.target.value })
                  }
                  id="dateOfBirth"
                  type="date"
                  className="form-control"
                />
                {editErrors.dateOfBirth && (
                  <p className="text-danger">Izabri datum rodjenja</p>
                )}
              </div>
            </div>
            <div className="mb-5">
              <div className="input-group">
                <span className="input-group-text w-25" id="basic-addon3">
                  Adresa
                </span>
                <input
                  value={user.address}
                  onChange={(event) =>
                    setUser({ ...user, address: event.target.value })
                  }
                  id="address"
                  type="text"
                  className="form-control"
                  placeholder="Address"
                />
              </div>
              {editErrors.address && (
                <p className="text-danger">
                  Adresa mora imati 6 znakova
                </p>
              )}
            </div>
          </div>
          <div className="col-sm-2"></div>
          <div className="col-sm-5">
            {user.status === "Denied" && (
              <Alert color="alert-danger" status="Odbijen" />
            )}
            {user.status === "Approved" && (
              <Alert color="alert-success" status="Odobren" />
            )}
            {user.status === "Processing" && (
              <Alert color="alert-warning" status="U obradi" />
            )}
            <img
              src={user.image}
              className="rounded mx-auto d-block"
              alt="..."
              height="300"
              width="300"
            ></img>
            <br />
            <br />

            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text w-25" id="basic-addon3">
                  Slika
                </span>
                <input
                  className="form-control"
                  type="file"
                  id="file"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className="container-fluid text-center">
          <div className="row">
            <div className="col-sm-4"></div>
            <div className="col-sm-4">
              <button className="btn btn-lg btn-warning" onClick={handleSubmit}>
                Sacuvaj promene
              </button>
            </div>
            <div className="col-sm-4"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
