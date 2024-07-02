import { useParams } from "react-router-dom";

const DoctorDetails = () => {
  const params = useParams();
  return <div>doctor details {params.id}</div>;
};

export default DoctorDetails;
