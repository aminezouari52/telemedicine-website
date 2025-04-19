// HOOKS
import { useEffect } from "react";
import { useDispatch } from "react-redux";

// FUNCTIONS
import { setUser } from "@/reducers/userReducer";
import { getCurrentUser } from "@/services/authService";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getLocalStorage } from "@/utils/localStorage";

// COMPONENTS
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthLayout, DoctorLayout, PatientLayout } from "@/components/layout";
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import DoctorPatients from "@/pages/doctor/DoctorPatients.jsx";
import DoctorHome from "@/pages/doctor/DoctorHome";
import DoctorProfile from "@/pages/doctor/DoctorProfile";
import DoctorConsultations from "@/pages/doctor/DoctorConsultations";
import PatientHome from "@/pages/patient/PatientHome";
import PatientConsultations from "@/pages/patient/PatientConsultations";
import PatientDoctors from "@/pages/patient/PatientDoctors";
import DoctorDetails from "@/pages/patient/DoctorDetails";
import BookConsultation from "@/pages/consultation/BookConsultation";
import Chat from "@/pages/consultation/Chat";
import NotFound from "@/components/NotFound";

const demoAccounts = ["freddie24@yahoo.com", "christop_hagenes21@gmail.com"];

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        await authUser.reload();

        const idTokenResult = await authUser.getIdTokenResult();
        try {
          const res = await getCurrentUser(idTokenResult.token);
          if (!res.data) {
            throw new Error("User not found or token expired");
          }

          const storedUser = getLocalStorage("user") || res.data;

          if (
            !demoAccounts.includes(storedUser.email) &&
            !authUser.emailVerified
          ) {
            throw new Error("Email not verified. Please verify your email.");
          }

          dispatch(setUser({ ...storedUser, token: idTokenResult.token }));
        } catch (error) {
          console.log(error);
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
          <Route path="doctors" element={<PatientDoctors />} />
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
