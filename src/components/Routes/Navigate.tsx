import React, { FC, CSSProperties } from "react";
import { Link } from "react-router-dom";

const style: CSSProperties = { textDecoration: "none", color: "inherit" };

interface NavigateProps {
    to: string;
}

export const Navigate: FC<NavigateProps> = ({ to, children }) => (
    <Link to={to} style={style}>
        {children}
    </Link>
);
