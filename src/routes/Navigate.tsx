import React, { FC } from "react";
import { Link } from "react-router-dom";

interface NavigateProps {
    to: string;
}

const navigateStyle = { textDecoration: "none", color: "inherit" };

export const Navigate: FC<NavigateProps> = ({ to, children }) => (
    <Link to={to} style={navigateStyle}>
        {children}
    </Link>
);
