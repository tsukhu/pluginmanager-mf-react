import React from "react";
import ReactDOM from "react-dom";
import { ChakraProvider, Heading } from "@chakra-ui/react";

import Slider from "jherr-mf-slider/slider";
import Footer from "tsukhu-mf-footer/footer";

import "./index.css";

const App = () => (
  <ChakraProvider>
    <Heading>Starter Host</Heading>
    <Slider />
    <Footer />
  </ChakraProvider>
);

ReactDOM.render(<App />, document.getElementById("app"));
