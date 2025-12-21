import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to My Projects page where the create modal is
    navigate("/app/my-projects?action=create", { replace: true });
  }, [navigate]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
        {/* Spinner */}
        <div
          className="
            h-10 w-10 rounded-full animate-spin
            border-2 border-emerald-400 border-t-transparent
            dark:border-emerald-300 dark:border-t-transparent
          "
        />

        {/* Helper text */}
        <p className="font-medium">
          Redirecting to <span className="text-emerald-500 dark:text-emerald-400">My Challenges</span>…
        </p>
      </div>
    </div>
  );
};

export default CreateProjectPage;
