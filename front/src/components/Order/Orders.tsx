import { useState } from "react";
import OrderDTO from "../../DTO/OrderDTO";
import Articles from "../Article/Articles";
import Alert from "../Alert";
import { RiArticleFill } from "react-icons/ri";
import { BsBoxSeam } from "react-icons/bs";

interface Props {
  orders: OrderDTO[];
  cancelOrder?: (id: number) => void;
  ordersType: "new" | "previous" | "all";
}

const Orders = ({ orders, cancelOrder, ordersType }: Props) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const isCancellable = (date: string) => {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + 1);
    if (new Date() < newDate && localStorage.getItem("role") === "Customer" && ordersType === 'new') {
      return true;
    } else {
      return false;
    }
  };

  let isDelivered = (date: string) => {
    const newDate = new Date(date);
    if (new Date() > newDate) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <div className="container-fluid text-center">
        <br />
        <div className="row">
          <div className="col-sm-3">
            <div className="container-fluid">
              {ordersType === "new" && (
                <h3 style={{ color: "#ffcc00" }}>
                  Nova porudzbina
                </h3>
              )}
              {ordersType === "previous" && (
                <h3 style={{ color: "#ffcc00" }}>
                  Prethodne porudzbine
                </h3>
              )}
              {ordersType === "all" && (
                <h3 style={{ color: "#ffcc00" }}>
                  Porudzbina
                </h3>
              )}
              <hr />
              <div
                id="list-example"
                className="list-group"
                style={{ overflowY: "scroll", height: "750px" }}
              >
                {orders.map((order) => (
                  <a
                    style={{
                      color: "white",
                      borderStyle: "solid",
                      borderColor: "#ffcc00",
                      borderWidth: "3px",
                    }}
                    id={order.id.toString()}
                    key={order.id}
                    className={
                      selectedIndex === order.id
                        ? "list-group-item bg-warning"
                        : "list-group-item bg-secondary"
                    }
                    onClick={() => {
                      setSelectedIndex(order.id);
                    }}
                    href={"#list-item-" + order.id}
                  >
                    <p>Porudzbina #{order.id}</p>
                    <hr />
                    <p></p>
                    <p>Kupac: {order.customer.username}</p>
                    <hr />
                    <p>
                      Vreme porudzbine: {order.startTime}
                      <br /> Vreme dostave: {order.endTime}
                    </p>
                    <hr />
                    <p>
                      Adresa: {order.address}
                      <hr />
                      {"Cena: €"}
                      {order.price}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="col-sm-9 text-center">
            <h3 style={{ color: "#ffcc00" }}>
              Naruceni proizvodi
            </h3>
            <hr />
            <div
              data-bs-spy="scroll"
              data-bs-target="#list-example"
              data-bs-smooth-scroll="true"
              className="overflow-auto"
              style={{ overflowY: "scroll", height: "750px" }}
            >
              {orders.map((order) => (
                <div key={order.id}>
                  <h4 id={"list-item-" + order.id}>
                    <div className="accordion" id="accordionExample">
                      <div className="accordion-item">
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button bg-dark"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#collapseOne"
                            aria-expanded="true"
                            aria-controls="collapseOne"
                            style={{
                              color: "#ffcc00",
                            }}
                          >
                            Porudzbina # {order.id} - Klikni za vise informacija
                          </button>
                        </h2>
                        <div
                          id="collapseOne"
                          className="accordion-collapse collapse show"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body bg-dark">
                            <table className="table table-dark">
                              <thead>
                                <tr>
                                  <th scope="col">Ime kupca</th>
                                  <th scope="col">Korisnicko ime kupca</th>
                                  <th scope="col">Vreme porudzbine</th>
                                  <th scope="col">Vreme dostave</th>
                                  <th scope="col">Adresa</th>
                                  <th scope="col">Cena</th>
                                  <th scope="col">Komentar</th>
                                </tr>
                              </thead>
                              <tbody className="table-group-divider">
                                <tr>
                                  <td>{order.customer.name}</td>
                                  <td>{order.customer.username}</td>
                                  <td>{order.startTime}</td>
                                  <td>{order.endTime}</td>
                                  <td>{order.address}</td>
                                  <td>€{order.price}</td>
                                  <td>{order.comment}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    {order.status === "Cancelled" && (
                      <Alert color="alert-danger" status={order.status} />
                    )}
                    {order.status === "Processing" &&
                      isDelivered(order.endTime) && (
                        <Alert color="alert-success" status={"Dostavljeno"} />
                      )}
                    {order.status === "Processing" &&
                      !isDelivered(order.endTime) && (
                        <Alert color="alert-warning" status={"Dostavlja se"} />
                      )}
                    {isCancellable(order.startTime) && (
                      <p>
                        <button
                          className="btn btn-lg btn-dark"
                          style={{ marginTop: "2%" }}
                          onClick={() => cancelOrder(order.id)}
                        >
                          Cancel
                        </button>
                      </p>
                    )}
                  </h4>
                  <Articles articles={order.articles} articleButtons="none" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Orders;
