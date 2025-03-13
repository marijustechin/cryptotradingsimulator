import { ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

const isZalgoText = (text: string): boolean => {
  const zalgoRegex =
    /[\u0300-\u036F\u0483-\u0489\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF]+/g;
  return zalgoRegex.test(text);
};

const removeZalgo = (text: string): string => {
  return text
    .normalize('NFD')
    .replace(
      /[\u0300-\u036F\u0483-\u0489\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF]+/g,
      ''
    );
};

export const ZalgoGuard = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const sanitizedPath = location.pathname
      .split('/')
      .map((segment) => (isZalgoText(segment) ? removeZalgo(segment) : segment))
      .join('/');

    if (sanitizedPath !== location.pathname) {
      navigate(sanitizedPath, { replace: true });
    }
  }, [location, navigate]);

  return <>{children}</>;
};
