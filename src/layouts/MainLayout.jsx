// src/layouts/MainLayout.jsx
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const MainLayout = () => {
  return (
    <>
      <Header />
      <Container style={{ paddingLeft: "8rem", paddingRight: "8rem" }}>
        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;
