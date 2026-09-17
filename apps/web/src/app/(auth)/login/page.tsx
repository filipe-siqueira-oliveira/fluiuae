import { Suspense } from "react";
import { LoginView } from "@/features/auth/login_view";

const LoginPage = () => (
  <Suspense>
    <LoginView />
  </Suspense>
);

export default LoginPage;
