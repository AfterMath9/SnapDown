import React, { useState, useEffect } from "react";
import axios from "axios";
import VideoPlayerComponent from "./VideoPlayerComponent";
import { Settings, Moon, Sun, Github, Twitter, Send, Coffee, Bug } from 'lucide-react';

const Snapdown = () => {
  const [username, setUsername] = useState("");
  const [stories, setStories] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Effect to apply dark mode
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  const fetchStories = async () => {
    if (!username) {
      setError("⚠️ Please enter a username.");
      return;
    }

    try {
      console.log("Fetching stories for:", username);
      const response = await axios.get(
        `https://lucky-shadow-8a00.aeyaalli00963.workers.dev/?username=${username}`
      );

      console.log("API Response:", response.data);

      if (response.data.stories && response.data.stories.length > 0) {
        const mediaUrls = response.data.stories.map((url) => ({
          url,
          isVideo: url.includes(".mp4"),
          isImage: !url.includes(".mp4"),
        }));

        setStories(mediaUrls);
        setError("");
      } else {
        setError("⚠️ No stories found for this username.");
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
      setError("❌ Failed to fetch stories. Please try again.");
    }
  };

  const downloadStory = async (url) => {
    try {
      const response = await axios.get(url, { responseType: "blob" });

      const mimeType = response.headers["content-type"];
      const fileExtension = mimeType.includes("image") ? ".jpg" : ".mp4";

      const blob = new Blob([response.data], { type: mimeType });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);

      link.download = `snapdown_story${fileExtension}`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading story:", error);
      alert("❌ Failed to download story.");
    }
  };

  const openExternalLink = (url) => {
    window.open(url, '_blank');
  };

  const SettingsModal = () => (
    <div className="settings-modal">
      <h2>🔧 Settings</h2>
      <div className="dark-mode-toggle">
        <label>
          Dark Mode
          {isDarkMode ? (
            <Sun onClick={() => setIsDarkMode(false)} />
          ) : (
            <Moon onClick={() => setIsDarkMode(true)} />
          )}
        </label>
      </div>
      <div className="external-links">
        <h3>Connect</h3>
        <div className="button-container">
          <button 
            className="button" 
            onClick={() => openExternalLink('https://github.com/aeyaalli')}
          >
            <Github className="icon" />
          </button>
          <button 
            className="button" 
            onClick={() => openExternalLink('https://x.com/yourusername')}
          >
            <Twitter className="icon" />
          </button>
          <button 
            className="button" 
            onClick={() => openExternalLink('https://t.me/yourusername')}
          >
            <Send className="icon" />
          </button>
          <button 
            className="button" 
            onClick={() => openExternalLink('https://buymeacoffee.com/yourusername')}
          >
            <Coffee className="icon" />
          </button>
          <button 
            className="button" 
            onClick={() => window.location.href = 'mailto:amrmafalani@yahoo.com?subject=SnapDown Bug Report'}
          >
            <Bug className="icon" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`snapdown-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <h1>📸 Snapdown</h1>
      
      <div className="settings-gear">
        <button onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
          <Settings />
        </button>
      </div>
      
      {isSettingsOpen && <SettingsModal />}
      
      <div id="poda">
        <div className="white"></div>
        <div className="border"></div>
        <div className="darkBorderBg"></div>
        <div className="glow"></div>
        <input
          className="input"
          type="text"
          placeholder="Enter Snapchat username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="button" onClick={fetchStories}>🔍 Search</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="button-container">
        <button className="button" onClick={() => setViewMode("list")}>📜 List View</button>
        <button className="button" onClick={() => setViewMode("grid")}>🔲 Grid View</button>
        <button className="button" onClick={() => setFilter("all")}>🌍 All</button>
        <button className="button" onClick={() => setFilter("images")}>🖼️ Images</button>
        <button className="button" onClick={() => setFilter("videos")}>📹 Videos</button>
      </div>

      <div className={viewMode === "list" ? "list-view" : "grid-view"}>
        {stories
          .filter((story) => {
            if (filter === "images") return story.isImage;
            if (filter === "videos") return story.isVideo;
            return true;
          })
          .map((story, index) => (
            <div key={index} style={{ margin: "10px" }}>
              {story.isVideo ? (
                <VideoPlayerComponent url={story.url} />
              ) : (
                <img
                  src={story.url}
                  alt={`Story ${index}`}
                  style={{ maxWidth: "100%" }}
                />
              )}
              <button className="button" onClick={() => downloadStory(story.url)}>⬇️ Download</button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Snapdown;