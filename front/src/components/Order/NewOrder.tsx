import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ArticleDTO from "../../DTO/ArticleDTO";
import Articles from "../Article/Articles";
import { ImCart } from "react-icons/im";
import { BsFillFileEarmarkPlusFill, BsFillXCircleFill } from "react-icons/bs";
import Order from "../../model/Order";
import orderService from "../../services/order-service";
import { useNavigate } from "react-router-dom";
import articleService from "../../services/article-service";
import { CanceledError } from "../../services/api-client";
import authGuardService from "../../services/auth-guard-service";

const NewOrder = () => {
  let [cart, setCart] = useState<ArticleDTO[]>([]);
  let [articles, setArticles] = useState<ArticleDTO[]>([]);
  const [order, setOrder] = useState<Order>({
    customerId: localStorage.getItem("id"),
    address: "",
    articles: [],
    comment: "",
    price: 0,
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (!authGuardService.isUserLoggedIn()) navigate("/login");
    if (!authGuardService.isCustomer()) navigate("/profile");
    const { request, cancel } = articleService.getAll<ArticleDTO>();
    request
      .then((response) => {
        setArticles(response.data);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return () => cancel;
      });
  }, []);

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
    setOrder({
      ...order,
      articles: cart.filter((item) => item.id !== id),
      price: cart
        .filter((item) => item.id !== id)
        .reduce((acc, item) => item.price * item.quantity + 3, 0),
    });
  };

  const refreshPageContent = () => {
    const { request, cancel } = articleService.getAll<ArticleDTO>();
    request
      .then((response) => {
        setArticles(response.data);
      })
      .catch((error) => {
        if (error instanceof CanceledError) return () => cancel;
      });
  };

  const submitOrder = () => {
    if (cart.length === 0) {
      Swal.fire({
        icon: "error",
        title: "No items in cart !",
        showConfirmButton: false,
        timer: 1500,
      });
    } else if (order.address.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Please, add address for delivery.",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      orderService
        .create(order)
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "Your order has been sent.",
            showConfirmButton: false,
            timer: 1500,
          });
          document.getElementById("cartClose")?.click();
          refreshPageContent();
          setCart([]);
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title:
              "Your order has not been sent. Please, refresh and try again.",
            showConfirmButton: false,
            timer: 1500,
          });
        });
    }
  };

  const addToCart = (id: number, wantedAmount: number) => {
    if (!isNaN(wantedAmount)) {
      const isFound = cart.some((element) => {
        if (element.id === id) {
          return true;
        }
        return false;
      });
      if (isFound) {
        Swal.fire({
          icon: "error",
          title:
            "Item already exists in cart ! If you want to change quantity, remove the item and add it again with a wanted quantity.",
          showConfirmButton: false,
          timer: 3000,
        });
      } else {
        let item = { ...articles.find((article) => article.id === id) };
        if (item!.quantity < wantedAmount || wantedAmount <= 0) {
          Swal.fire({
            icon: "error",
            title: "Invalid quantity.",
            showConfirmButton: false,
            timer: 3000,
          });
        } else {
          item!.quantity = wantedAmount;
          setCart((cart) => [...cart, item]);
          setOrder({
            ...order,
            articles: [...cart, item],
            price: [...cart, item].reduce(
              (acc, item) => item.price * item.quantity + 3,
              0
            ),
          });
          Swal.fire({
            icon: "success",
            title: "Item added to cart.",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Please, input wanted quantity.",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <>
      <br />
      <br />
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-3"></div>
          <div className="col-sm-6">
            <b>
              <h1 style={{ color: "#ffcc00" }}>
                Nova porudzbina
              </h1>
            </b>
          </div>
          <br />
          <div className="col-sm-3">
            <button
              className="btn btn-lg btn-dark position-relative"
              data-bs-toggle="modal"
              data-bs-target="#cart"
              style={{ width: "65%" }}
            >
              <h1 style={{ color: "#ffcc00" }}>
                Naruci
              </h1>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning">
                {cart.length}
                <span className="visually-hidden">neprocitana poruka</span>
              </span>
            </button>
          </div>
        </div>
      </div>{" "}
      {
        <Articles
          articles={articles}
          articleButtons="shopping"
          addToCart={addToCart}
        />
      }
      <div
        className="modal modal-xl fade"
        id="cart"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-dark">
              <h1
                className="modal-title fs-5"
                style={{ color: "white" }}
                id="exampleModalLabel"
              >
                Kolica
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="cartClose"
              ></button>
            </div>
            <div className="modal-body bg-dark">
              <table className="table text-center table-dark align-middle table-borderless table-striped">
                <thead>
                  <tr>
                    <th>Ime</th>
                    <th>Opis</th>
                    <th>Kolicina</th>
                    <th>Cena</th>
                    <th>Izbrisi</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.description}</td>
                      <td>{item.quantity}</td>
                      <td>€{item.price}</td>
                      <td width="24%">
                        <button
                          className="btn btn-danger"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <BsFillXCircleFill size="30" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="row">
                <div className="col-sm-6">
                  <textarea
                    style={{ color: "white" }}
                    value={order.comment}
                    onChange={(event) => {
                      setOrder({
                        ...order,
                        comment: event.target.value,
                      });
                    }}
                    id="comment"
                    className="form-control bg-dark"
                    placeholder="komentar"
                  />
                </div>
                <div className="col-sm-6">
                  <textarea
                    style={{ color: "white" }}
                    value={order.address}
                    onChange={(event) => {
                      setOrder({
                        ...order,
                        address: event.target.value,
                      });
                    }}
                    id="address"
                    className="form-control bg-dark"
                    placeholder="adresa"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer bg-dark">
              <h4 style={{ marginRight: "12%", color: "white" }}>
                Ukupno: €
                {cart
                  .reduce((acc, item) => item.price * item.quantity + 3, 0)
                  .toFixed(2)}{" "}
                + 3€ (Dostava)
              </h4>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Izadji
              </button>
              <button
                type="button"
                className="btn btn-warning"
                onClick={submitOrder}
              >
                Naruci
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewOrder;
