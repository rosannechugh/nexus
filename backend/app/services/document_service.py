from pathlib import Path

from pypdf import PdfReader


def save_uploaded_file(file, upload_dir: str = "uploads") -> str:
    """
    Save an uploaded file and return its path.
    """

    upload_path = Path(upload_dir)
    upload_path.mkdir(parents=True, exist_ok=True)

    file_path = upload_path / file.filename

    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    return str(file_path)


def extract_text_from_pdf(file_path: str) -> list[dict]:
    """
    Extract text from each page of a PDF.

    Returns a list containing page number and extracted text.
    """

    reader = PdfReader(file_path)

    pages = []

    for page_number, page in enumerate(reader.pages, start=1):
        text = page.extract_text() or ""

        pages.append(
            {
                "page_number": page_number,
                "text": text.strip(),
            }
        )

    return pages
def chunk_text(
    pages: list[dict],
    chunk_size: int = 1000,
    overlap: int = 200,
) -> list[dict]:
    """
    Split extracted page text into overlapping chunks.
    """

    chunks = []

    for page in pages:
        text = page["text"]
        page_number = page["page_number"]

        if not text:
            continue

        start = 0

        while start < len(text):
            end = start + chunk_size

            chunk = text[start:end].strip()

            if chunk:
                chunks.append(
                    {
                        "content": chunk,
                        "page_number": page_number,
                    }
                )

            start += chunk_size - overlap

    return chunks