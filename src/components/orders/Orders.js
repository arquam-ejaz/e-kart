import React, { useEffect, useState } from "react";
import { db } from "../../Firebase";
import { useStateValue } from "../StateProvider";
import Order from "./Order";
import "./Orders.css";
import { query, collection, onSnapshot, orderBy, doc } from 'firebase/firestore'


function Orders() {
  const [{ basket, user }, dispatch] = useStateValue();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    try {
      const ref = collection(db, "users", window.walletConnection.isSignedIn() ? window.accountId : user ? user.email : "guest", "orders");
      const orderedOrders = query(ref, orderBy('created', 'desc'))
      onSnapshot(orderedOrders, snapshot => {
        setOrders(snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      })
      //setOrders([]);
    }
    catch {
      console.log("something goes wrong")
      setOrders([]);
    }

    console.log('orders', orders);
  }, [user]);

  return (
    <div className="orders">
      <h1>Your orders history</h1>
      <div className="orders__order">
        {
          orders?.map((order, index) => (
            <Order key={index} order={order} />
          ))
        }
      </div>
    </div>
  );
}

export default Orders;
