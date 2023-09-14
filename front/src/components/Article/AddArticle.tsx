import { ChangeEvent, useEffect, useState } from "react";
import { MdOutlineAddCircle } from "react-icons/md";
import { RiEditCircleFill } from "react-icons/ri";
import Articles from "./Articles";
import ArticleDTO from "../../DTO/ArticleDTO";
import articleService from "../../services/article-service";
import Swal from "sweetalert2";
import authGuardService from "../../services/auth-guard-service";
import { useNavigate } from "react-router-dom";
import { RiArticleFill } from "react-icons/ri";

const AddArticle = () => {
  let [articles, setArticles] = useState<ArticleDTO[]>([]);

  const [editArticleInfo, setEditArticleInfo] = useState<ArticleDTO>({
    id: 0,
    salesmanId: 0,
    quantity: 0,
    description: "",
    image: "",
    name: "",
    price: 1,
  });

  const [addArticleInfo, setAddArticleInfo] = useState<ArticleDTO>({
    id: 0,
    salesmanId: parseInt(localStorage.getItem("id")),
    quantity: 0,
    description: "",
    image: "",
    name: "",
    price: 1,
  });

  const [editErrors, setEditErrors] = useState({
    name: false,
    price: false,
    description: false,
    quantity: false,
    image: false,
  });

  const [addErrors, setAddErrors] = useState({
    name: false,
    price: false,
    description: false,
    quantity: false,
    image: false,
  });

  const navigate = useNavigate();
  useEffect(() => {
    if (!authGuardService.isUserLoggedIn()) navigate("/login");
    if (!authGuardService.isSalesman() || !authGuardService.isApproved())
      navigate("/profile");

    articleService
      .getById(parseInt(localStorage.getItem("id")))
      .then((response) => {
        setArticles(response.data);
      })
      .catch((error) => {
        console.log(error.response.data);
      });
  }, []);

  const editArticle = (id: number) => {
    const article = articles.find((a) => {
      return a.id === id;
    });
    setEditArticleInfo({
      id: article?.id,
      price: article?.price,
      name: article?.name,
      quantity: article?.quantity,
      description: article?.description,
      image: article?.image,
    });
    document.getElementById("edit")?.click();
  };

  const deleteArticle = (id: number) => {
    articleService
      .delete(id)
      .then((response) => {
        if (response.data === true) {
          setArticles(articles.filter((a) => a.id !== id));
          Swal.fire({
            icon: "success",
            title: "Article has been deleted successfully.",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            icon: "error",
            title:
              "Someone is currently accessing this article, probably a customer. Page will refresh and you can try again.",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    try {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        setAddArticleInfo({ ...addArticleInfo, image: event.target.result });
      };
    } catch {
      setAddArticleInfo({ ...addArticleInfo, image: "" });
    }
  };

  const handleEditFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    var reader = new FileReader();
    try {
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        setEditArticleInfo({ ...editArticleInfo, image: event.target.result });
      };
    } catch {
      setEditArticleInfo({ ...editArticleInfo, image: "" });
    }
  };

  const validateAdd = () => {
    let nameError = false;
    let descriptionError = false;
    let priceError = false;
    let quantityError = false;
    let imageError = false;
    if (addArticleInfo.name.trim().length === 0) {
      nameError = true;
    }
    if (addArticleInfo.description.trim().length === 0) {
      descriptionError = true;
    }
    if (addArticleInfo.price <= 0) {
      priceError = true;
    }
    if (addArticleInfo.quantity < 0) {
      quantityError = true;
    }
    if (addArticleInfo.image.length === 0) {
      imageError = true;
    }
    setAddErrors({
      name: nameError,
      description: descriptionError,
      price: priceError,
      quantity: quantityError,
      image: imageError,
    });

    if (
      nameError ||
      descriptionError ||
      priceError ||
      quantityError ||
      imageError
    ) {
      return false;
    }
    return true;
  };

  const validateEdit = () => {
    let nameError = false;
    let descriptionError = false;
    let priceError = false;
    let quantityError = false;
    let imageError = false;
    if (editArticleInfo.name.trim().length === 0) {
      nameError = true;
    }
    if (editArticleInfo.description.trim().length === 0) {
      descriptionError = true;
    }
    if (editArticleInfo.price <= 0) {
      priceError = true;
    }
    if (editArticleInfo.quantity < 0) {
      quantityError = true;
    }
    if (editArticleInfo.image.length === 0) {
      imageError = true;
    }
    setEditErrors({
      name: nameError,
      description: descriptionError,
      price: priceError,
      quantity: quantityError,
      image: imageError,
    });

    if (
      nameError ||
      descriptionError ||
      priceError ||
      quantityError ||
      imageError
    ) {
      return false;
    }
    return true;
  };

  const handleEditSubmit = () => {
    if (validateEdit()) {
      articleService
        .update(editArticleInfo)
        .then((response) => {
          const updatedArticles = articles.map((obj) => {
            // 👇️ if id equals 2, update country property
            if (obj.id === editArticleInfo.id) {
              return {
                id: response.data.id,
                price: response.data.price,
                name: response.data.name,
                quantity: response.data.quantity,
                description: response.data.description,
                image: response.data.image,
              };
            }
            // 👇️ otherwise return the object as is
            return obj;
          });
          setArticles(updatedArticles);
          Swal.fire({
            icon: "success",
            title: "Article has been updated successfully.",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((error) => {
          console.log(error);
          if (error.code == "ERR_BAD_RESPONSE")
            Swal.fire({
              icon: "error",
              title:
                "Someone is currently accessing this article, probably a customer. Page will refresh and you can try again.",
              showConfirmButton: false,
              timer: 2500,
            });
        });
      document.getElementById("editClose")?.click();
    } else {
      console.log("NOT OK");
    }
  };

  const handleAddSubmit = () => {
    if (validateAdd()) {
      articleService
        .create(addArticleInfo)
        .then((response) => {
          setArticles((articles) => [...articles, response.data]);
          Swal.fire({
            icon: "success",
            title: "Article has been added successfully.",
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((error) => console.log(error));
      document.getElementById("addClose")?.click();
    } else {
      console.log("NOT OK");
    }
  };

  return (
    <>
      <div className="container-fluid">
        <br />
        <br />
        <div className="row">
          <div className="col-sm-3"></div>
          <div className="col-sm-6">
            <h1 style={{ color: "#ffcc00" }}>
              Proizvodi
            </h1>
          </div>
          <div className="col-sm-3">
            <button
              type="button"
              className="btn btn-lg btn-dark"
              data-bs-toggle="modal"
              data-bs-target="#newModal"
              id="new"
              style={{ width: "65%" }}
            >
              <h1 style={{ color: "#ffcc00" }}>
                Dodaj 
              </h1>
            </button>
            <button
              type="button"
              className="btn btn-dark"
              data-bs-toggle="modal"
              data-bs-target="#editModal"
              id="edit"
              hidden
            >
              Novi proizvod
            </button>
          </div>
        </div>
      </div>
      <Articles
        articles={articles}
        articleButtons="edit-delete"
        deleteArticle={deleteArticle}
        editArticle={editArticle}
      />
      <div
        className="modal fade"
        id="newModal"
        aria-labelledby="newModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <MdOutlineAddCircle size="10%" color="#ffcc00" />
              <h1 style={{ marginLeft: "3%" }} className="modal-title fs-5">
                Novi prozivod
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="addClose"
              ></button>
            </div>
            <div className="modal-body">
              <div className="container text-center">
                <div className="row justify-content-md-center">
                  <div className="col-sm-12">
                    <div className="container"></div>
                    <div className="row">
                      <div className="mb-1">
                        <label htmlFor="name" className="form-label">
                          Ime
                        </label>
                        <input
                          value={addArticleInfo.name}
                          onChange={(event) =>
                            setAddArticleInfo({
                              ...addArticleInfo,
                              name: event.target.value,
                            })
                          }
                          id="name"
                          type="text"
                          className="form-control"
                          placeholder="Ime"
                        />
                        {addErrors.name && (
                          <p className="text-danger">Name is required</p>
                        )}
                      </div>
                      <div className="mb-1">
                        <label htmlFor="price" className="form-label">
                          Cena
                        </label>
                        <input
                          value={addArticleInfo.price}
                          onChange={(event) =>
                            setAddArticleInfo({
                              ...addArticleInfo,
                              price: parseInt(event.target.value).toFixed(),
                            })
                          }
                          id="price"
                          type="number"
                          className="form-control"
                          placeholder="Cena"
                          min="1"
                        />
                        {addErrors.price && (
                          <p className="text-danger">
                            Price has to be a positive
                          </p>
                        )}
                      </div>
                      <div className="mb-1">
                        <label htmlFor="quantity" className="form-label">
                          Kolicina
                        </label>
                        <input
                          value={addArticleInfo.quantity}
                          onChange={(event) =>
                            setAddArticleInfo({
                              ...addArticleInfo,
                              quantity: parseInt(event.target.value).toFixed(),
                            })
                          }
                          id="quantity"
                          type="number"
                          className="form-control"
                          placeholder="Kolicina"
                          min="1"
                        />
                        {addErrors.quantity && (
                          <p className="text-danger">
                            Kolicina ne moze biti negativna
                          </p>
                        )}
                      </div>
                      <div className="mb-1">
                        <label htmlFor="description" className="form-label">
                          Opis
                        </label>
                        <textarea
                          value={addArticleInfo.description}
                          onChange={(event) =>
                            setAddArticleInfo({
                              ...addArticleInfo,
                              description: event.target.value,
                            })
                          }
                          id="description"
                          type="text"
                          className="form-control"
                          placeholder="Opis"
                        />
                        {addErrors.description && (
                          <p className="text-danger">Description is required</p>
                        )}
                      </div>
                      <div className="mb-1">
                        <label htmlFor="file" className="form-label">
                          Slika proizvoda
                        </label>
                        <input
                          className="form-control"
                          type="file"
                          id="file"
                          accept="image/png, image/jpeg, image/gif"
                          onChange={handleFileChange}
                        />
                      </div>
                      {addErrors.image && (
                        <p className="text-danger">
                          Ucitajte sliku proizvoda!
                        </p>
                      )}
                      <div className="mb-1">
                        <img
                          style={{
                            marginTop: "3%",
                            borderRadius: "5%",
                            borderColor: "#ffcc00",
                            borderStyle: "solid",
                          }}
                          id="image"
                          src={addArticleInfo.image}
                          className="rounded mx-auto d-block"
                          alt="..."
                          height="300"
                          width="100%"
                        ></img>
                      </div>
                      <br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-dark"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="submit"
                onClick={handleAddSubmit}
                className="btn btn-warning"
              >
                Dodaj proizvod
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="editModal"
        aria-labelledby="newModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <RiEditCircleFill size="10%" color="#ffcc00" />
              <h1 style={{ marginLeft: "3%" }} className="modal-title fs-5">
                Izmeni proizvod
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="container text-center">
                <div className="row justify-content-md-center">
                  <div className="col-sm-12">
                    <div className="container"></div>
                    <div className="row">
                      <div className="mb-1">
                        <label htmlFor="name" className="form-label">
                          Ime
                        </label>
                        <input
                          value={editArticleInfo.name}
                          onChange={(event) =>
                            setEditArticleInfo({
                              ...editArticleInfo,
                              name: event.target.value,
                            })
                          }
                          id="name"
                          type="text"
                          className="form-control"
                          placeholder="Ime"
                        />
                        {editErrors.name && (
                          <p className="text-danger">Name is required</p>
                        )}
                      </div>
                      <div className="mb-1">
                        <label htmlFor="price" className="form-label">
                          Cena
                        </label>
                        <input
                          value={editArticleInfo.price}
                          onChange={(event) =>
                            setEditArticleInfo({
                              ...editArticleInfo,
                              price: parseInt(event.target.value).toFixed(),
                            })
                          }
                          id="price"
                          type="number"
                          className="form-control"
                          placeholder="Cena"
                          min="1"
                        />
                        {editErrors.price && (
                          <p className="text-danger">
                            Cena mora biti pozitivna
                          </p>
                        )}
                      </div>
                      <div className="mb-1">
                        <label htmlFor="quantity" className="form-label">
                          Kolicina
                        </label>
                        <input
                          value={editArticleInfo.quantity}
                          onChange={(event) =>
                            setEditArticleInfo({
                              ...editArticleInfo,
                              quantity: parseInt(event.target.value).toFixed(),
                            })
                          }
                          id="quantity"
                          type="number"
                          className="form-control"
                          placeholder="Kolicina"
                          min="0"
                        />
                      </div>
                      {editErrors.quantity && (
                        <p className="text-danger">
                          Kolicina ne moze biti negativna
                        </p>
                      )}
                      <div className="mb-1">
                        <label htmlFor="description" className="form-label">
                          Opis
                        </label>
                        <textarea
                          value={editArticleInfo.description}
                          onChange={(event) =>
                            setEditArticleInfo({
                              ...editArticleInfo,
                              description: event.target.value,
                            })
                          }
                          id="description"
                          type="text"
                          className="form-control"
                          placeholder="Opis"
                        />
                        {editErrors.description && (
                          <p className="text-danger">Description is required</p>
                        )}
                      </div>
                      <div className="mb-1">
                        <label htmlFor="file" className="form-label">
                          Slika proizvoda
                        </label>
                        <input
                          className="form-control"
                          type="file"
                          id="file"
                          accept="image/png, image/jpeg, image/gif"
                          onChange={handleEditFileChange}
                        />
                      </div>
                      {editErrors.image && (
                        <p className="text-danger">
                          Ucitajte sliku proizvoda!
                        </p>
                      )}
                      <div className="mb-1">
                        <img
                          style={{
                            marginTop: "3%",
                            borderRadius: "5%",
                            borderColor: "#ffcc00",
                            borderStyle: "solid",
                          }}
                          id="image"
                          src={editArticleInfo.image}
                          className="rounded mx-auto d-block"
                          alt="..."
                          height="300"
                          width="100%"
                        ></img>
                      </div>
                      <br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-dark"
                data-bs-dismiss="modal"
                id="editClose"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-warning"
                onClick={handleEditSubmit}
              >
                Izmeni proizvod
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddArticle;
