import { Routes, Route, Navigate } from "react-router-dom";

function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate to="/startup" replace />}
            />

            <Route
                path="/startup"
                element={<div>Startup</div>}
            />
        </Routes>
    );
}

export default AppRoutes;