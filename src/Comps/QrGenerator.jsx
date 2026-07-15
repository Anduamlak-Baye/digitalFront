import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Link } from "react-router-dom";

function QrGenerator() {
  const qrRef = useRef();
  const restaurantId = localStorage.getItem('restaurantId')
  // 1. Build the production or local URL pointing to your Items page
  // In production, change this to your actual deployed domain (e.g., https://mymenu.com/menu/)
  const menuUrl = `https://front2323.netlify.app/menu/${restaurantId}`; 

  // 2. Function to download the QR code as a PNG file
  const downloadQRCode = () => {
    const svg = qrRef.current.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    
    // Create an image element to convert SVG to PNG canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      // Set canvas size (increase for higher resolution print quality)
      canvas.width = 500;
      canvas.height = 500;
      
      // Draw a white background (so it scans easily on dark backgrounds)
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the QR code onto the canvas
      ctx.drawImage(img, 25, 25, 450, 450);
      
      // Trigger download
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `Menu-QR-${restaurantId}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div style={{ 
      textAlign: "center", 
      padding: "20px", 
      border: "1px solid #ddd", 
      borderRadius: "8px",
      maxWidth: "300px",
      margin: "20px auto",
      backgroundColor: "#fff"
    }}>
      <Link to="/admin-panel" className="back-link">← Cancel and return</Link>

      <h3>Your Digital Menu QR</h3>
      <p style={{ fontSize: "12px", color: "#666" }}>Scan to view live menu</p>
      
      {/* Container used by useRef to capture the SVG element */}
      <div ref={qrRef} style={{ margin: "20px 0" }}>
        <QRCodeSVG 
          value={menuUrl} 
          size={200}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
          level={"H"} // High error correction capability (handles scratches/dirt when printed)
          includeMargin={true}
        />
      </div>

      <button 
        onClick={downloadQRCode}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Download PNG for Print
      </button>
      
      <div style={{ marginTop: "10px", fontSize: "11px", color: "#999", wordBreak: "break-all" }}>
        Links to: <br/> <code>{menuUrl}</code>
      </div>
    </div>
  );
}

export default QrGenerator;