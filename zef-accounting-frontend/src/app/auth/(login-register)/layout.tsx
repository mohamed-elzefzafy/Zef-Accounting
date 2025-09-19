"use client";
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react'

const RegisterLoginLayout = ({children} : {children : ReactNode}) => {
    const router = useRouter();
    const { userInfo } = useAppSelector((state) => state.auth);


    useEffect(() =>{
      if (userInfo.email) {
        return router.push("/");
      }
    },[router, userInfo.email])
  
  return (
  <>
  {children}
  </>
  )
}

export default RegisterLoginLayout