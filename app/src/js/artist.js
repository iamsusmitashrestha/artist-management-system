import { API_BASE_URL, ROLES } from "../constants/common.js";

const userRole = localStorage.getItem("userRole");

document.addEventListener("DOMContentLoaded", function () {
  const exportButton = document.getElementById("exportArtistsBtn");
  const importInput = document.getElementById("importArtistsInput");

  if (userRole != ROLES.ARTIST_MANAGER) {
    exportButton.style.display = "none";
    importInput.style.display = "none";
  }

  // Add event listeners for export and import buttons
  exportButton.addEventListener("click", exportArtistsToCSV);
  importInput.addEventListener("change", importArtistsFromCSV);

  // Function to export artists to CSV
  async function exportArtistsToCSV() {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/artists`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const csvData = [
        [
          "Name",
          "Address",
          "Email",
          "DOB",
          "Gender",
          "First Release Year",
          "No. of Albums Released",
        ],
        ...data.data.map((artist) => [
          artist.name,
          artist.address || "N/A",
          artist.email || "N/A",
          artist.dob || "N/A",
          artist.gender || "N/A",
          artist.firstReleaseYear || "N/A",
          artist.noOfAlbumsReleased || "N/A",
        ]),
      ]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

      const blob = new Blob([csvData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "artists.csv";
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting artists:", error);
      alert("Failed to export artists.");
    }
  }

  // Function to import artists from CSV
  async function importArtistsFromCSV(event) {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async function (e) {
      const csvContent = e.target.result;

      // Use PapaParse to parse the CSV content
      const parsedData = Papa.parse(csvContent, {
        header: true, // Use the first row as the header
        skipEmptyLines: true, // Skip empty rows
      });

      const artists = parsedData.data.map((row) => ({
        name: row["Name"].trim(),
        address: row["Address"].trim(),
        email: row["Email"].trim(),
        dob: new Date(row["DOB"]).toISOString().split("T")[0],
        gender: row["Gender"].trim(),
        firstReleaseYear: parseInt(row["First Release Year"].trim(), 10),
        noOfAlbumsReleased: parseInt(row["No. of Albums Released"].trim(), 10),
      }));

      try {
        const authToken = localStorage.getItem("authToken");

        await axios.post(`${API_BASE_URL}/artists/import`, artists, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        alert("Artists imported successfully!");
        window.location.reload();
      } catch (error) {
        console.error("Error importing artists:", error);
        alert("Failed to import artists.");
      }
    };

    reader.readAsText(file);
  }
});
