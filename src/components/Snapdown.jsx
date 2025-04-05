import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Download, 
  Search, 
  Grid, 
  List, 
  Image, 
  Video, 
  Globe, 
  Settings, 
  Moon, 
  Sun,
  Github,
  Twitter,
  Send,
  Coffee,
  Bug
} from 'lucide-react';
import VideoPlayerComponent from "./VideoPlayerComponent";

const Snapdown = () => {
  const [username, setUsername] = useState("");
  const [stories, setStories] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Effect to apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.body.classList.add('light-mode');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [isDarkMode]);

  const fetchStories = async () => {
    if (!username) {
      setError("Please enter a username");
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
        setError("No stories found for this username");
      }
    } catch (error) {
      console.error("Error fetching stories:", error);
      setError("Failed to fetch stories. Please try again.");
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
      alert("Failed to download story");
    }
  };

  const openExternalLink = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="snapdown-container">
      <div className="settings-gear">
        <button onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
          <Settings size={24} />
        </button>
      </div>

      {isSettingsOpen && (
        <div className="settings-modal">
          <div className="settings-header">
            <h2><Settings size={20} /> Settings</h2>
            <button onClick={() => setIsSettingsOpen(false)} className="close-button">×</button>
          </div>
          
          <div className="settings-option">
            <span>Dark Mode</span>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
              />
              <span className="slider round"></span>
            </label>
          </div>
          
          <div className="settings-section">
            <h3>Connect</h3>
            <div className="social-links">
              <button 
                className="social-button" 
                onClick={() => openExternalLink('https://github.com/AfterMath9')}
                title="GitHub"
              >
                <Github size={20} />
              </button>
              <button 
                className="social-button" 
                onClick={() => openExternalLink('https://twitter.com/amrmafalani')}
                title="Twitter"
              >
                <Twitter size={20} />
              </button>
              <button 
                className="social-button" 
                onClick={() => openExternalLink('https://t.me/Amr1sy')}
                title="Telegram"
              >
                <Send size={20} />
              </button>
              <button 
                className="social-button" 
                onClick={() => openExternalLink('https://www.buymeacoffee.com/aftermath9')}
                title="Buy Me Coffee"
              >
                <Coffee size={20} />
              </button>
              <button 
                className="social-button" 
                onClick={() => window.location.href = 'mailto:amrmafalani@yahoo.com?subject=SnapDown Bug Report'}
                title="Bug Report"
              >
                <Bug size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

<h1>
  <Download size={40} /> Snapdown
</h1>

      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Enter Snapchat username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="search-button" onClick={fetchStories}>
          <Search size={20} /> Search
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="view-filter-container">
        <button 
          className={`filter-button ${viewMode === 'list' ? 'active' : ''}`} 
          onClick={() => setViewMode("list")}
        >
          <List size={16} /> List View
        </button>
        <button 
          className={`filter-button ${viewMode === 'grid' ? 'active' : ''}`} 
          onClick={() => setViewMode("grid")}
        >
          <Grid size={16} /> Grid View
        </button>
        
        <button 
          className={`filter-button ${filter === 'all' ? 'active' : ''}`} 
          onClick={() => setFilter("all")}
        >
          <Globe size={16} /> All
        </button>
        <button 
          className={`filter-button ${filter === 'images' ? 'active' : ''}`} 
          onClick={() => setFilter("images")}
        >
          <Image size={16} /> Images
        </button>
        <button 
          className={`filter-button ${filter === 'videos' ? 'active' : ''}`} 
          onClick={() => setFilter("videos")}
        >
          <Video size={16} /> Videos
        </button>
      </div>

      <div className={viewMode === "list" ? "list-view" : "grid-view"}>
        {stories
          .filter((story) => {
            if (filter === "images") return story.isImage;
            if (filter === "videos") return story.isVideo;
            return true;
          })
          .map((story, index) => (
            <div key={index} className="story-item">
              {story.isVideo ? (
                <VideoPlayerComponent url={story.url} />
              ) : (
                <img src={story.url} alt={`Story ${index}`} />
              )}
              <button 
                className="download-button" 
                onClick={() => downloadStory(story.url)}
              >
                <Download size={16} /> Download
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Snapdown;