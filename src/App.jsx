import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import ReservationList from "./components/ReservationList";
import CancelPopUp from "./components/CancelPopUp";

function App() {
  return (
    <>
      <ReservationList />
    </>
  );
}

export default App;
