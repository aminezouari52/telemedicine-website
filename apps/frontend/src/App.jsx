// HOOKS
import { useEffect } from "react";
import { useDispatch } from "react-redux";

// FUNCTIONS
import { setUser } from "@/reducers/userReducer";
import { getCurrentUser } from "@/modules/auth/functions/auth";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

// COMPONENTS
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout, DoctorLayout, PatientLayout } from "@/components/layout";
import Home from "@/components/Home";
import Login from "@/modules/auth/components/Login";
import Register from "@/modules/auth/components/Register";
import ForgotPassword from "@/modules/auth/components/ForgotPassword";
import DoctorPatients from "@/modules/doctor/components/DoctorPatients.jsx";
import DoctorHome from "@/modules/doctor/components/DoctorHome";
import DoctorProfile from "@/modules/doctor/components/DoctorProfile";
import DoctorConsultations from "@/modules/doctor/components/DoctorConsultations";
import PatientHome from "@/modules/patient/components/PatientHome";
import PatientConsultations from "@/modules/patient/components/PatientConsultations";
import Doctors from "@/modules/patient/components/Doctors";
import DoctorDetails from "@/modules/patient/components/DoctorDetails";
import BookConsultation from "@/modules/consultation/components/BookConsultation";
import Chat from "@/modules/consultation/components/Chat";
import NotFound from "@/components/NotFound";
import { getLocalStorage } from "./utils";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const idTokenResult = await authUser.getIdTokenResult();
        try {
          const res = await getCurrentUser(idTokenResult.token);
          if (!res.data) {
            throw new Error("user not found");
          }
          const storedUser = getLocalStorage("user") || res.data;
          dispatch(setUser({ ...storedUser, token: idTokenResult.token }));
        } catch (err) {
          console.log(err);
        }
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />

        <Route path="/auth/*" element={<AuthLayout />}>
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>

        <Route path="/patient/*" element={<PatientLayout />}>
          <Route path="home" element={<PatientHome />} />
          <Route path="consultation/:id" element={<BookConsultation />} />
          <Route path="consultations" element={<PatientConsultations />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="doctors/:id" element={<DoctorDetails />} />
          <Route path="*" element={<Navigate to="/patient/home" />} />
        </Route>

        <Route path="/doctor/*" element={<DoctorLayout />}>
          <Route path="home" element={<DoctorHome />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="consultations" element={<DoctorConsultations />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="*" element={<Navigate to="/doctor/home" />} />
        </Route>

        <Route path="/:consultationId" element={<Chat />} />

        <Route path="*" element={<NotFound />} />

        <Route path="/admin/*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
