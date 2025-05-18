import { FC } from "react";
import { useNavigate } from "react-router-dom";

const Home: FC = () => {
    const navigate = useNavigate();
    return (
        <div>
            <h1 onClick={() => navigate("/login")}>Login</h1>
        </div>
    );
};

export default Home;