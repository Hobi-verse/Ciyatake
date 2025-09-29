import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ brand, brandHref = "/", links = [], action }) => {
  const [isOpen, setIsOpen] = useState(false);
  const items = Array.isArray(links) ? links : [];

  const handleToggle = () => setIsOpen((open) => !open);
  const handleNavigate = () => setIsOpen(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:flex-nowrap">
        <Link
          to={brandHref}
          className="text-xl font-semibold tracking-tight text-slate-900 hover:text-slate-700"
          onClick={handleNavigate}
        >
          {brand}
        </Link>

        <button
          type="button"
          onClick={handleToggle}
          className="inline-flex items-center justify-center rounded md:hidden"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="sr-only">Toggle navigation menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-6 w-6"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <div
          className={`w-full grow basis-full md:grow-0 md:basis-auto md:w-auto ${
            isOpen ? "block" : "hidden md:block"
          }`}
        >
          <ul className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6">
            {items.map((link) => {
              const path = link?.to ?? link?.href ?? "#";
              return (
                <li key={`${link.label}-${path}`}>
                  <Link
                    to={path}
                    onClick={handleNavigate}
                    className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            {action && action.label && (action.to ?? action.href) ? (
              <li className="md:ml-4">
                <Link
                  to={action.to ?? action.href}
                  onClick={handleNavigate}
                  className="inline-flex items-center justify-center rounded-full border border-blue-500 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:border-blue-600 hover:text-blue-700"
                >
                  {action.label}
                </Link>
              </li>
            ) : null}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
