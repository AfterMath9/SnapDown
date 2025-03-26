import React from "react";
import ReactPlayer from "react-player";

const VideoPlayerComponent = ({ url }) => {
  return (
    <div>
      <ReactPlayer url={url} controls={true} width="100%" height="auto" />
    </div>
  );
};

export default VideoPlayerComponent;
