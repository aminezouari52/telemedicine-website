import { useQuery } from "@tanstack/react-query";
import { getFeatures } from "@/services/featureService";

// Every feature counts as on until the backend says otherwise, so a configured
// app never flashes its "not set up" states while this loads.
const ALL_ON = { payments: true, video: true, uploads: true, ai: true };

// Which optional services (Stripe, LiveKit, Cloudinary, Gemini) the backend
// has keys for. See GET /v1/features and docs/configuration.md.
const useFeatures = () => {
  const { data } = useQuery({
    queryKey: ["features"],
    queryFn: async () => (await getFeatures()).data,
    staleTime: Infinity,
  });

  return data ?? ALL_ON;
};

export default useFeatures;
