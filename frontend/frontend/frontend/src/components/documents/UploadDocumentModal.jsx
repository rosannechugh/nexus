import Modal from "@/components/ui/Modal";
import DocumentUploader from "@/components/documents/DocumentUploader";

export default function UploadDocumentModal({ open, onClose, uploadDocument, onUploaded }) {
  return (
    <Modal open={open} onClose={onClose} title="Upload research paper">
      <DocumentUploader uploadDocument={uploadDocument} onUploaded={onUploaded} />
    </Modal>
  );
}
