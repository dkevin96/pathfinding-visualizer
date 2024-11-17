import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopyright } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <div className="footer">
      <div className="m-2 text-center">
        <a href="https://github.com/dkevin96/react-pathfinding-visualizer">
          <span className="p-2">
            <FontAwesomeIcon icon={faGithub} size="lg" />
          </span>
          <p className="inline text-xl font-mono">Git Repo</p>
        </a>
      </div>
      <div className="m-2 text-center">
        <span className="p-2">
          <FontAwesomeIcon icon={faCopyright} size="lg" />
        </span>
        <p className="inline text-xl font-mono">2024</p>
      </div>
    </div>
  );
};

export default Footer;
