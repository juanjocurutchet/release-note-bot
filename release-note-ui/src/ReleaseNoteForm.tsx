import React, { useState } from "react";
import "./ReleaseNoteForm.css";
import { JiraProject } from "./shared/jiraProjects";

export default function ReleaseNoteForm() {
  const [devSprint, setDevSprint] = useState("");
  const [supportSprint, setSupportSprint] = useState("");
  const [selectedProject, setSelectedProject] = useState<JiraProject>(JiraProject.VANZINI);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setDownloadUrl(null);

    try {
      const response = await fetch("http://localhost:4000/api/generate-release", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          devSprint,
          supportSprint,
          projectName: selectedProject,
        }),
      });

      if (!response.ok) throw new Error("Error al generar el release");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setMessage("✅ Release generado y enviado correctamente por email.");
    } catch {
      setMessage("❌ Ocurrió un error al generar o enviar el release.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="release-note-container">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Proyecto</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value as JiraProject)}
          >
            <option value={JiraProject.VANZINI}>Vanzini</option>
            <option value={JiraProject.GENESIS}>Genesis</option>
          </select>
        </div>

        <div>
          <label>Sprint Desarrollo</label>
          <input
            type="text"
            value={devSprint}
            onChange={(e) => setDevSprint(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Sprint Soporte</label>
          <input
            type="text"
            value={supportSprint}
            onChange={(e) => setSupportSprint(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" /> Generando...
            </>
          ) : (
            "Generar y Enviar"
          )}
        </button>
      </form>

      {message && (
        <div className={message.includes("✅") ? "success-message" : "error-message"}>
          {message}
        </div>
      )}

      {downloadUrl && (
        <a
          href={downloadUrl}
          download={`release-note-${devSprint}-${supportSprint}.docx`}
          className="download-link"
        >
          Descargar Release Note
        </a>
      )}
    </div>
  );
}
