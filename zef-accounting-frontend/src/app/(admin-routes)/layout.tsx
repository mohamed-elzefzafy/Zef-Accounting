"use client"
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const InstructorRoutesLayout = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
  const { userInfo } = useAppSelector((state) => state.auth);

    useEffect(() => {
    if (!userInfo.email || !userInfo.isAccountVerified || userInfo.role !== "admin") {
      return router.push("/");
    }
  }, [router, userInfo.email, userInfo.isAccountVerified, userInfo.role]);
  return (
<>
{children}
</>
  )
}

export default InstructorRoutesLayout;