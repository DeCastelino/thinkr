const Login = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>Login</h1>
            <form
                action="/login"
                method="POST"
                className="flex items-center flex-col space-y-4"
            >
                <div>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                    />
                </div>
                <div>
                    <button type="submit">Log In</button>
                </div>
            </form>
        </div>
    );
};

export default Login;
