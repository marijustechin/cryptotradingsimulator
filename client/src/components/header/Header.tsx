import { Link } from 'react-router';
import { mainNavLinks } from './mainNavLinks';

export const Header = () => {
  return (
    <header className="flex justify-center gap-2">
      <div>Kas sukurs headeri su MainNavigation?</div>
      {mainNavLinks.map((link) => (
        <div key={link.title}>
          <Link to={link.href}>{link.title}</Link>
        </div>
      ))}
    </header>
  );
};
