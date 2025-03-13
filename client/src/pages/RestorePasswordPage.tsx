import { Link } from 'react-router';

export const RestorePasswordPage = () => {
  return (
    <main className="container">
      <h1>Restore password page</h1>
      <p>Will be implemented on Sprint 2</p>
      <p className="text-violet-300 underline">
        <Link to={'/login'}>Back to Login</Link>
      </p>
    </main>
  );
};
