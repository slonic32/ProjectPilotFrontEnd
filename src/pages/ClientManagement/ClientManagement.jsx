import ClientCard from "../../components/ClientCard/ClientCard";
import css from "./ClientManagement.module.css";

const dummyClients = [
  { name: "Acme Corp", projects: 5, since: "Jan 2021" },
  { name: "GlobalTech", projects: 3, since: "Mar 2022" },
  { name: "Neon Labs", projects: 7, since: "Dec 2020" },
  { name: "Skyline Ventures", projects: 2, since: "Aug 2023" },
];

export default function ClientManagement() {
  return (
    <div className={css.wrapper}>
      <h2>Client Management</h2>
      <div className={css.cardList}>
        {dummyClients.map((client, idx) => (
          <ClientCard
            key={idx}
            name={client.name}
            projects={client.projects}
            since={client.since}
          />
        ))}
      </div>
    </div>
  );
}
