import { useState, useRef, useEffect } from "react";
import musicFile from "./music.mp3";
import playIcon from "./play.png";
import pauseIcon from "./pause.png";


const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      // @ts-ignore
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="music-player ml-4">
      <audio ref={audioRef} src={musicFile} autoPlay loop />
      <button onClick={togglePlayPause} className="play-pause-button">
        <img
          src={isPlaying ? pauseIcon : playIcon}
          alt={isPlaying ? "Pause" : "Play"}
          className="w-6 h-6"
        />
      </button>
    </div>
  );
};

export default MusicPlayer;
