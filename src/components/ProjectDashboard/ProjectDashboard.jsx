import { useSelector } from "react-redux";
import { selectUser } from "../../redux/auth/selectors";
import css from "./ProjectDashboard.module.css";

export default function ProjectDashboard() {
  const user = useSelector(selectUser);

  const projects = [
    { name: "Project Alpha", status: "active" },
    { name: "Project Beta", status: "closed" },
    { name: "Project Gamma", status: "active" },
  ];

  return (
    <div className={css.dashboard}>
      {user.pm && (
        <button className={css.createBtn}>Start New Project</button>
      )}

      <h3 className={css.sectionTitle}>Select Project:</h3>
      <div className={css.projectList}>
        {projects.map((proj, i) => (
          <div key={i} className={css.projectItem}>
            <span>{proj.name}</span>
            <span
              className={
                proj.status === "active" ? css.active : css.closed
              }
            >
              {proj.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
