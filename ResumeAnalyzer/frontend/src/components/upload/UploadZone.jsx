import { useRef, useState } from "react";
import { FileUp } from "lucide-react";
import "./UploadZone.css";

function UploadZone({ file, setFile }) {
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");

  const handleFile = (selectedFile) => {
    setError("");

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setFile(null);
      setError("Please upload a PDF file only.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(null);
      setError("File size must be less than 5 MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleInputChange = (event) => {
    handleFile(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files[0]);
  };

  const removeFile = () => {
    setFile(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="upload-section">
      <h2>Upload Your Resume</h2>

      <div
        className="upload-zone"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="upload-icon">
          <FileUp size={26} />
        </div>

        <h3>{file ? "Resume selected" : "Drop your resume here"}</h3>

        <p>{file ? file.name : "or click to browse from your computer"}</p>

        <span>PDF only • Maximum 5 MB</span>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleInputChange}
          hidden
        />
      </div>

      {file && (
        <div className="file-preview">
          <div>
            <strong>{file.name}</strong>
            <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              removeFile();
            }}
          >
            Remove
          </button>
        </div>
      )}

      {error && <p className="upload-error">{error}</p>}
    </div>
  );
}

export default UploadZone;
