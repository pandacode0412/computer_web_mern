import React from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
export default function ClientLayout(props) {
  return (
    <div>
      <Header />
      {props.children}
      <Footer />
    </div>
  );
}
