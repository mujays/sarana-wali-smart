/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Suspense } from "react";
import VerifyPassword from "./_components/verify-password";

function VerifyPasswordPage() {
  return (
    <Suspense>
      <VerifyPassword />
    </Suspense>
  );
}

export default VerifyPasswordPage;
