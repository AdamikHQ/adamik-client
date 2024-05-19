import { FaGithub } from "react-icons/fa";
import { FiBookOpen } from "react-icons/fi";

export function SiteFooter() {
  return (
    <footer className="flex flex-col items-center py-4 bg-transparent text-foreground border-t border-border">
      <p className="mb-4 text-center">
      Explore the open-source Adamik Demo Application and start building in minutes.
      </p>
      <div className="flex space-x-4">
        <a
          href="https://github.com/AdamikHQ/adamik-client"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 hover:text-primary"
        >
          <FaGithub size={20} />
          <span>GitHub</span>
        </a>
        <a
          href="https://docs.adamik.io"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 hover:text-primary"
        >
          <FiBookOpen size={20} />
          <span>Documentation</span>
        </a>
      </div>
    </footer>
  );
}