import "./App.css";
import { useState, useEffect } from "react";
import { FormControl, InputGroup, Container, Button } from "react-bootstrap";

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    let authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret,
    };
    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((result) => result.json())
      .then((data) => {
        setAccessToken(data.access_token);
      });
  }, []);

  async function search() {
    let playlistParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };
  
    // Get Playlists based on mood input
    const playlists = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=playlist",
      playlistParams
    )
      .then((result) => result.json())
      .then((data) => {
        return data.playlists.items; // returns array of playlist objects
      });
      setPlaylists(playlists);
      console.log("Fetched playlists:", playlists);

  }
  

  return (
    <Container>
  <InputGroup>
    <FormControl
      placeholder="Search Playlists based off your mood"
      type="input"
      aria-label="Search Playlists based off your mood"
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          search();
        } // search function
      }}
      onChange={(event) => setSearchInput(event.target.value)} // setSearch
      style={{
        width: "300px",
        height: "35px",
        borderWidth: "0px",
        borderStyle: "solid",
        borderRadius: "5px",
        marginRight: "10px",
        paddingLeft: "10px",
      }}
    />

    <Button onClick={search}>Search</Button>
  </InputGroup>
  <div className="playlist-container" style={{ marginTop: "30px" }}>
  {playlists.map((playlist) => (
    <div
      key={playlist.id}
      className="playlist-card"
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        marginBottom: "20px",
        maxWidth: "400px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}
    >
      <img
  src={playlist.images.length > 0 ? playlist.images[0].url : "default_image_url"}
  alt="playlist cover"
  style={{ width: "100%", borderRadius: "10px" }}
/>

      <h3>{playlist.name}</h3>
      <p style={{ fontSize: "0.9em", color: "#666" }}>
        {playlist.description || "No description"}
      </p>
      <p style={{ fontSize: "0.85em", fontStyle: "italic" }}>
        By {playlist.owner.display_name}
      </p>
      <a
        href={playlist.external_urls.spotify}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "inline-block",
          marginTop: "10px",
          padding: "8px 12px",
          backgroundColor: "#1DB954",
          color: "white",
          textDecoration: "none",
          borderRadius: "5px",
        }}
      >
        Open in Spotify
      </a>
    </div>
  ))}
</div>
</Container>
  );
}
export default App;
