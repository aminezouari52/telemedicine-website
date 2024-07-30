// HOOKS
import { useEffect } from "react";
import { useDispatch } from "react-redux";

// FIREBASE
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

// FUNCTIONS
import { setLoggedInUser } from "./reducers/userReducer";
import { currentUser } from "./functions/auth";

// COMPONENTS
import { Routes, Route, Navigate } from "react-router-dom";
import AdminRoute from "./components/routes/AdminRoute";
import DoctorRoute from "./components/routes/DoctorRoute";
import PatientRoute from "./components/routes/PatientRoute";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Patient from "./pages/Patient/Patient";
import Consultations from "./pages/Patient/Consultations";
import Doctors from "./pages/Patient/Doctors";
import DoctorDetails from "./pages/Patient/DoctorDetails";
import VideoCall from "./pages/Patient/VideoCall";

import NotFound from "./components/NotFound";
import AllPatient from "./pages/admin/patient/allPatient";
import Consultation from "./pages/consultation/Consultation.jsx";
import Doctor from "./pages/Doctor";
import AllUsers from "./pages/admin/users/AllUsers";
import AllDoctors from "./pages/admin/doctors/allDoctors";
import Dashboard from "./pages/admin/dashboard/dashboard";
import Rdv from "./pages/admin/rdv/rdv";
import DoctorProfile from "./pages/doctor/doctorProfile.jsx";
import ListConsultation from "./pages/doctor/ListConsultation.jsx";
import PatientList from "./pages/doctor/PatientList.jsx";
import PatientProfile from "./pages/doctor/PatientProfile.jsx";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        try {
          const res = await currentUser(idTokenResult.token);
          dispatch(
            setLoggedInUser({
              name: res.data.name,
              email: res.data.email,
              token: idTokenResult.token,
              role: res.data.role,
              _id: res.data._id,
            })
          );
        } catch (err) {
          console.log(err);
        }
      }
    });
    // cleanup
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/*" element={<AdminRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="allUsers" element={<AllUsers />} />
          <Route path="allDoctors" element={<AllDoctors />} />
          <Route path="allPatients" element={<AllPatient />} />
          <Route path="allRdv" element={<Rdv />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" />} />
        </Route>

        <Route path="/patient/*" element={<PatientRoute />}>
          <Route path="home" element={<Patient />} />
          <Route path="consultation/:id" element={<Consultation />} />
          <Route path="consultations" element={<Consultations />} />
          <Route path="doctors" element={<Doctors />} />{" "}
          <Route path="doctors/:id" element={<DoctorDetails />} />
          <Route path="call" element={<VideoCall />} />
          <Route path="*" element={<Navigate to="/patient/home" />} />
        </Route>

        <Route path="/doctor/*" element={<DoctorRoute />}>
          <Route path="home" element={<Doctor />} />
          <Route path="profile" element={<DoctorProfile />} />
          <Route path="consultations" element={<ListConsultation />} />
          <Route path="patients" element={<PatientList />} />
          <Route path="patientDetails" element={<PatientProfile />} />
          <Route path="*" element={<Navigate to="/doctor/home" />} />
        </Route>

        <Route path="*" element={<NotFound />} />

        <Route path="/admin/*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
