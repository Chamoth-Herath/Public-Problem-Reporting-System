import { SignUp } from "@clerk/clerk-react";

const RegisterPage = () => {
    return (
        <main className="flex justify-center items-center min-h-screen">
            <SignUp />
        </main>
    );
};

export default RegisterPage;