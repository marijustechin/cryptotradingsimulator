import { ReactNode, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

const isZalgoText = (text: string): boolean => {
  const zalgoRegex =
    /([\u0300–\u036F\u1AB0–\u1AFF\u1DC0–\u1DFF\u20D0–\u20FF\uFE20–\uFE2F\u0483-\u0486\u05C7\u0610-\u061A\u0656-\u065F\u0670\u06D6-\u06ED\u0711\u0730-\u073F\u0743-\u074A\u0F18-\u0F19\u0F35\u0F37\u0F72-\u0F73\u0F7A-\u0F81\u0F84\u0e00-\u0eff\uFC5E-\uFC62]{2,})/gim;
  // /[\u0300-\u036F\u0483-\u0489\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF]+/g;
  return zalgoRegex.test(text);
};

const removeZalgo = (text: string): string => {
  return text.normalize('NFD').replace(
    /([\u0300–\u036F\u1AB0–\u1AFF\u1DC0–\u1DFF\u20D0–\u20FF\uFE20–\uFE2F\u0483-\u0486\u05C7\u0610-\u061A\u0656-\u065F\u0670\u06D6-\u06ED\u0711\u0730-\u073F\u0743-\u074A\u0F18-\u0F19\u0F35\u0F37\u0F72-\u0F73\u0F7A-\u0F81\u0F84\u0e00-\u0eff\uFC5E-\uFC62]{2,})/gim,
    //  /[\u0300-\u036F\u0483-\u0489\u1AB0-\u1AFF\u1DC0-\u1DFF\u20D0-\u20FF]+/g,
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
