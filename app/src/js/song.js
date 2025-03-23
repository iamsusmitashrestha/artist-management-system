import { API_BASE_URL } from "../constants/common.js";

const token = localStorage.getItem("authToken");
const userRole = localStorage.getItem("userRole");

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
      <td>${song.genre || "N/A"}</td>
      <td>
        <button class="edit-song" data-id="${song.id}" data-title="${
      song.title
    }" data-album="${song.albumName}" data-genre="${song.genre}">Edit</button>
        <button class="delete-song" data-id="${song.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  container.appendChild(table);

  document
    .querySelectorAll(".edit-song")
    .forEach((button) => button.addEventListener("click", openEditModal));

  document
    .querySelectorAll(".delete-song")
    .forEach((button) => button.addEventListener("click", deleteSong));
}

// Function to open create song modal
function openCreateModal() {
  document.getElementById("modalTitle").textContent = "Create New Song";
  document.getElementById("songForm").reset();
  document.getElementById("songId").value = "";
  document.getElementById("songModal").style.display = "block";
}

// Function to open edit song modal
function openEditModal(event) {
  const songId = event.target.dataset.id;
  const title = event.target.dataset.title;
  const albumName = event.target.dataset.album;
  const genre = event.target.dataset.genre;

  document.getElementById("modalTitle").textContent = "Edit Song";
  document.getElementById("title").value = title;
  document.getElementById("albumName").value = albumName;
  document.getElementById("genre").value = genre;
  document.getElementById("songId").value = songId;
  document.getElementById("songModal").style.display = "block";
}

// Function to close modal
function closeModal() {
  document.getElementById("songModal").style.display = "none";
}

// Function to create/update song
async function submitSong(event) {
  event.preventDefault();
  if (userRole !== "artist") {
    alert("You do not have permission to perform this action.");
    return;
  }

  const songId = document.getElementById("songId").value;
  const title = document.getElementById("title").value;
  const albumName = document.getElementById("albumName").value;
  const genre = document.getElementById("genre").value;
  const artistId = +getArtistIdFromURL();

  const payload = { title, albumName, genre, artistId };

  try {
    if (songId) {
      await axios.put(`${API_BASE_URL}/songs/${songId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Song updated successfully!");
    } else {
      await axios.post(`${API_BASE_URL}/songs`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Song created successfully!");
    }
    closeModal();
    fetchSongs();
  } catch (error) {
    console.error("Error saving song:", error);
  }
}

// Function to delete song
async function deleteSong(event) {
  const songId = event.target.dataset.id;

  if (!confirm("Are you sure you want to delete this song?")) return;

  try {
    await axios.delete(`${API_BASE_URL}/songs/${songId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("Song deleted successfully!");
    fetchSongs();
  } catch (error) {
    console.error("Error deleting song:", error);
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  fetchSongs();

  if (userRole === "artist") {
    document.getElementById("createSongBtn").style.display = "block";
    document
      .getElementById("createSongBtn")
      .addEventListener("click", openCreateModal);
  }

  document.getElementById("songForm").addEventListener("submit", submitSong);
  document.getElementById("closeModal").addEventListener("click", closeModal);
});
