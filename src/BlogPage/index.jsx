import React from "react";
import About from "./about";
import Contact from "./contact";
import Service from "./service";
import Works from "./works";

export default class BlogPage extends React.Component {
  render() {
    return (
      <>
        <About />
        <Service />
        <Works />
        <Contact />
      </>
    );
  }
}