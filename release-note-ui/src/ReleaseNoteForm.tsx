import React, { useState, useEffect } from "react";
import "./ReleaseNoteForm.css";

export default function ReleaseNoteForm() {
  const [devSprint, setDevSprint] = useState("");
  const [supportSprint, setSupportSprint] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Generate Release";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setDownloadUrl(null);

    try {
      const response = await fetch("http://localhost:4000/api/generate-release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ devSprint, supportSprint }),
      });

      if (!response.ok) throw new Error("Error al generar el release");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setMessage("Release generado y enviado correctamente por email.");
    } catch {
      setMessage("Ocurrió un error al generar o enviar el release.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-container">
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
              <span className="spinner"></span> Generando...
            </>
          ) : (
            "Generar y Enviar"
          )}
        </button>

        {message && (
          <div className={message.includes("error") ? "error-message" : "success-message"}>
            {message.includes("error") ? "❌" : "✅"} {message}
          </div>
        )}

        {downloadUrl && (
          <div className="download-link">
            <a href={downloadUrl} download={`release-note-${devSprint}-${supportSprint}.docx`}>
              Descargar Release Note
            </a>
          </div>
        )}
      </form>
    </div>
  );
}
