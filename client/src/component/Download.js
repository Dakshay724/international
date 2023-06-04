import React from "react";

function Download() {
  async function downloadFile(fileUrl, fileExtension) {
    const response = await fetch(fileUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: JSON.parse(localStorage.getItem("AccessToken")),
      },
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `file.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function downloadXlsxHandler() {
    const xlsxUrl = "http://localhost:9000/api/getUserDataByIdInXLSX";
    downloadFile(xlsxUrl, "xlsx");
  }

  function downloadPdfHandler() {
    const pdfUrl = "http://localhost:9000/api/getUserDataByIdInPdf";
    downloadFile(pdfUrl, "pdf");
  }

  return (
    <div>
      <label>
        Download profile in PDF:
        <button onClick={downloadPdfHandler}>PDF</button>
      </label>
      <label>
        Download profile in XLSX:
        <button onClick={downloadXlsxHandler}>XLSX</button>
      </label>
    </div>
  );
}

export default Download;
