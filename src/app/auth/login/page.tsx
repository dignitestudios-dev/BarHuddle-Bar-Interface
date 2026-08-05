"use client"
import Login from "@/features/auth/components/Login";
import { SignUp } from "@/features/auth/components/SignUp";
import { useState } from "react";

export default function LoginPage() {
    const [showLogin, setShowLogin] = useState(false);
    return showLogin ? <Login setShowLogin={setShowLogin} /> : <SignUp setShowLogin={setShowLogin} />;
}