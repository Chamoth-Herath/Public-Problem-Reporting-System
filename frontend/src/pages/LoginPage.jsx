import { SignIn } from "@clerk/clerk-react";

const LoginPage = () => {
    return (
        <main className="flex justify-center items-center min-h-screen">
            <SignIn />
        </main>
    );
};

export default LoginPage