import { FileText, X } from "lucide-react";

function FilePreview({ file, onRemove }) {
  if (!file) return null;

  return (
    <div className="file-preview">
      <div className="file-preview-info">
        <FileText size={20} />
        <div>
          <strong>{file.name}</strong>
          <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      </div>
      <button
        type="button"
        aria-label="Remove selected file"
        onClick={onRemove}
      >
        <X size={17} />
      </button>
    </div>
  );
}

export default FilePreview;
