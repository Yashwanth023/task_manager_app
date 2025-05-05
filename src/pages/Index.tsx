
// This file redirects to App.tsx which handles all the routing
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to root, which will be handled by App.tsx routing
    navigate("/");
  }, [navigate]);
  
  return null;
};

export default Index;
