import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <section className="flex items-center justify-center h-screen bg-gray-900">
      <div className="max-w-md w-full px-6 py-12 bg-gray-800 rounded-lg shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-4 text-center">Unauthorized</h1>
        <p className="text-lg text-center mb-6">You do not have access.</p>
        <div className="flex justify-center">
          <button
            onClick={goBack}
            className="px-6 py-3 bg-[#E9522C] text-white rounded-lg hover:bg-[#E9522C]/90 transition duration-300 ease-in-out focus:outline-none"
          >
            Go Back
          </button>
        </div>
      </div>
    </section>
  );
};

export default Unauthorized;
