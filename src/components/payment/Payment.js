import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckoutProduct from "../checkout/CheckoutProduct";
import { useStateValue } from "../StateProvider";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { getBasketTotal } from "../reducer";
import CurrencyFormat from "react-currency-format";
import "./Payment.css";
import axios from "../../axios";
import { db } from "../../Firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { utils } from "near-api-js";
import moment from "moment";

const BN = require("bn.js");

function Payment() {
  const navigate = useNavigate();
  const [{ basket, user }, dispatch] = useStateValue();
  const stripe = useStripe();
  const elements = useElements();

  const [succesded, setSuccesded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clint_secert, setClintSecret] = useState("");


  useEffect(() => {
    const getClinetSecret = async () => {
      const response = await axios({
        method: "post",
        url: `/payment/create?total=${Math.round(getBasketTotal(basket) * 100)}`,
      });
      console.log("response", response.data.clientSecret);
      console.log('total', getBasketTotal(basket) * 100);
      setClintSecret(response.data.clientSecret);
    };

    getClinetSecret();

  }, [basket]);

  useEffect(() => {

    console.log("useEffect");

    console.log(window.location.href);
    console.log(window.location.pathname);
    console.log(window.location.search);

    const cryptoPaymentCheck = async () => {

      if (window.location.search) {
        let a = window.location.search.split(/[?&=]+/);
        if (a[1] === 'transactionHashes') {

          const basketLS = window.localStorage.getItem('basket');
          const amountLS = window.localStorage.getItem('amount');
          const timestampLS = window.localStorage.getItem('timestamp');

          if (basketLS && amountLS && timestampLS) {
            const ref = doc(db, "users", window.walletConnection.isSignedIn() ? window.accountId : user ? user.email : "guest", "orders", a[2]);
            await setDoc(ref, {
              basket: JSON.parse(basketLS),
              amount: parseInt(JSON.parse(amountLS)),
              created: parseInt(JSON.parse(timestampLS)),
            })
          }

          dispatch({
            type: "EMPTY_BASKET",
          });
          navigate("/orders");

        } else {
          alert("Transaction Failed!")
          navigate("/");
        }

        window.localStorage.removeItem('basket');
        window.localStorage.removeItem('amount');
        window.localStorage.removeItem('timestamp');
      }

    }

    cryptoPaymentCheck();
  }, []);

  //console.log("clint", clint_secert);

  const handleCryptoPayment = async (e) => {
    e.preventDefault();
    let amountInINR = getBasketTotal(basket);
    let amountInNEAR = amountInINR / 300;
    let amountInYoctoNEAR = utils.format.parseNearAmount(amountInNEAR.toString());
    console.log(amountInYoctoNEAR);
    window.localStorage.setItem('basket', JSON.stringify(basket));
    window.localStorage.setItem('amount', JSON.stringify(getBasketTotal(basket) * 100));
    window.localStorage.setItem('timestamp', JSON.stringify(moment().unix()));
    await window.account.sendMoney("e-kart.testnet", new BN(amountInYoctoNEAR.toString()));
  }

  const handleSubmit = async (e) => {

    e.preventDefault();
    setProcessing(true);
    console.log('total', getBasketTotal(basket) * 100);
    // Confirm payment with stripe
    const result = await stripe
      .confirmCardPayment(clint_secert, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      .then(({ paymentIntent }) => {
        const ref = doc(db, "users", window.walletConnection.isSignedIn() ? window.accountId : user ? user.email : "guest", "orders", paymentIntent.id);
        setDoc(ref, {
          basket: basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created,
        })

        // if (result.error) {
        //   // Show error to your customer (for example, payment details incomplete)
        //   console.log(result.error.message);
        // }

        // console.log("success");

        setSuccesded(true);
        setError(null);
        setProcessing(false);
        dispatch({
          type: "EMPTY_BASKET",
        });
        navigate("/orders");

      }).catch((e) => {
        setSuccesded(false);
        setError(e.error ? e.error.message : "");
        setProcessing(false);
        alert("Transaction Failed!")
      });;
  };

  const handleChange = (e) => {
    setDisabled(e.empty);
    setError(e.error ? e.error.message : "");
  };

  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout (<Link to="/checkout">{basket?.length} items</Link>){" "}
        </h1>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Delivery Address</h3>
          </div>
          <div className="payment__address">
            <p>{window.walletConnection.isSignedIn() ? window.accountId : user?.email}</p>
            <p>4, Diamond Harbour Road</p>
            <p>Kolkata, West Bengal</p>
          </div>
        </div>

        <div className="payment__section">
          <div className="payment__title">
            <h3>Review items and delivery</h3>
          </div>
          <div className="payment__items">
            {basket.map((item) => (
              <CheckoutProduct
                key={item.id}
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
              />
            ))}
          </div>
        </div>

        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment Methods</h3>
          </div>
          <div className="payment__details">
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />
              <div className="payment__priceContainer">
                <CurrencyFormat
                  renderText={(value) => (
                    <>
                      <h3>Order Total: {value} or {(getBasketTotal(basket) / 300).toFixed(2)} NEAR</h3>
                    </>
                  )}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"₹"}
                />
                <button disabled={processing || disabled || succesded}>
                  <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                </button>
              </div>
              {error && <div>{error}</div>}
            </form>
            <button onClick={handleCryptoPayment}>
              Pay with crypto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
