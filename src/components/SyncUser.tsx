"use client";

import { useEffect } from "react";
import { useGetMeMutation } from "@/features/auth/api/auth.mutations";
import { useAppDispatch } from "@/store";
import { updateUser } from "@/store/slices/auth.slice";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { usePathname } from "next/navigation";

export function SyncUser() {
    const { mutateAsync: getMe } = useGetMeMutation();
    const dispatch = useAppDispatch();
    const token = useSelector((state: RootState) => state.auth.accessToken);
    const pathname = usePathname();

    useEffect(() => {
        if (!token) return;

        const fetchProfile = async () => {
            try {
                const response = await getMe();
                if (response?.user) {
                    dispatch(updateUser(response.user));
                } else if (response?.data?.user) {
                    dispatch(updateUser(response.data.user));
                } else if (response?.data) {
                    dispatch(updateUser(response.data));
                }
            } catch (error) {
                console.error("Failed to sync user profile:", error);
            }
        };

        fetchProfile();
    }, [pathname, token]); // Intentionally omitting getMe and dispatch to avoid unnecessary re-renders if their reference changes

    return null;
}
