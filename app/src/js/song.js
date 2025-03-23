import { API_BASE_URL } from "../constants/common.js";

const token = localStorage.getItem("authToken");
const userRole = localStorage.getItem("userRole");

// Function to get artist ID from URL
function getArtistIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("artistId");
}

// Function to fetch songs
async function fetchSongs() {
  const artistId = getArtistIdFromURL();
  if (!artistId) {
    alert("Artist ID not found!");
    return;
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}/songs?artistId=${artistId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    renderSongsTable(response.data.data);
  } catch (error) {
    console.error("Error fetching songs:", error);
  }
}

// Function to render songs in a table
function renderSongsTable(songs) {
  const container = document.getElementById("songsContainer");
  container.innerHTML = "";

  if (songs.length === 0) {
    container.innerHTML = "<p>No songs found for this artist.</p>";
    return;
  }

  const table = document.createElement("table");
  table.classList.add("songs-table");

  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th>Title</th>
      <th>Album Name</th>
      <th>Genre</th>
      <th>Actions</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  songs.forEach((song) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${song.title}</td>
      <td>${song.albumName || "N/A"}</td>
      <td>${song.genre || "N/A"} mins</td>
      <td>
        <button id="deleteSongBtn" data-id="${song.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

// Function to go back
function goBack() {
  window.history.back();
}

// Fetch songs when page loads
document.addEventListener("DOMContentLoaded", fetchSongs);
