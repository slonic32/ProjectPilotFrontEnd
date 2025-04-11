import css from "./ClientCard.module.css";

export default function ClientCard({ name, projects, since }) {
  return (
    <div className={css.card}>
      <div>
        <h3>{name}</h3>
        <p>Projects: {projects}</p>
        <p>Client since: {since}</p>
      </div>
      <button className={css.button}>Access Portfolio</button>
    </div>
  );
}
