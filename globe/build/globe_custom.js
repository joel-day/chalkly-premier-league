// Create the Hexasphere instance
var hexasphere = new Hexasphere(radius, divisions, tileSize);

// Convert to JSON
var jsonData = hexasphere.toJson();

// Download it as a file
function downloadJson(data, filename = 'hexasphere.json') {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url); // cleanup
}

// Call the download function
downloadJson(jsonData);