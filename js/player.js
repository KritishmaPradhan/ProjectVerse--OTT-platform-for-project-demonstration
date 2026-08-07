/* player.js - Custom Cinematic Video Player Implementation */

document.addEventListener('DOMContentLoaded', () => {
  initializePlayer();
});

function initializePlayer() {
  const modal = document.getElementById('videoModal');
  const video = document.getElementById('customPlayerVideo');
  const playPauseBtn = document.getElementById('playerPlayPause');
  const muteBtn = document.getElementById('playerMute');
  const progressTimeline = document.getElementById('progressTimeline');
  const progressPlayhead = document.getElementById('progressPlayhead');
  const timeDisplay = document.getElementById('playerTimeDisplay');
  const customPlayerFrame = document.querySelector('.custom-player');

  if (!modal || !video) return;

  // Global triggers
  window.openVideoModal = (videoUrl) => {
    // If running in local filesystem (file://), absolute videos path might break. Let's make it relative or dummy.
    // Also, if videoUrl is unavailable or blank, we set a default static video or show alert
    video.src = videoUrl || '';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Play video
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        updatePlayPauseIcon(true);
      }).catch(error => {
        console.log("Auto-play prevented or video source missing, showing paused controls.", error);
        updatePlayPauseIcon(false);
      });
    }
  };

  window.closeVideoModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    video.pause();
    video.src = '';
    updatePlayPauseIcon(false);
  };

  // Play & Pause controls
  const togglePlay = () => {
    if (video.paused) {
      video.play().then(() => updatePlayPauseIcon(true));
    } else {
      video.pause();
      updatePlayPauseIcon(false);
    }
  };

  // Click on the movie screen itself
  video.addEventListener('click', togglePlay);

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', togglePlay);
  }

  function updatePlayPauseIcon(isPlaying) {
    if (!playPauseBtn) return;
    if (isPlaying) {
      playPauseBtn.innerHTML = '⏸';
      if (customPlayerFrame) customPlayerFrame.classList.remove('paused');
    } else {
      playPauseBtn.innerHTML = '▶';
      if (customPlayerFrame) customPlayerFrame.classList.add('paused');
    }
  }

  // Double click for fullscreen
  video.addEventListener('dblclick', () => {
    toggleFullscreen();
  });

  const btnFullscreen = document.getElementById('playerFullscreen');
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFullscreen();
    });
  }

  const btnBack = document.getElementById('playerBack');
  if (btnBack) {
    btnBack.addEventListener('click', (e) => {
      e.stopPropagation();
      window.closeVideoModal();
    });
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (customPlayerFrame.requestFullscreen) {
        customPlayerFrame.requestFullscreen();
      } else if (customPlayerFrame.webkitRequestFullscreen) {
        customPlayerFrame.webkitRequestFullscreen();
      } else if (customPlayerFrame.msRequestFullscreen) {
        customPlayerFrame.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  // Track progress loading updates
  video.addEventListener('timeupdate', () => {
    if (video.duration) {
      const percentage = (video.currentTime / video.duration) * 100;
      if (progressPlayhead) progressPlayhead.style.width = `${percentage}%`;
      updateTimer();
    }
  });

  // Track total duration when metadata is read
  video.addEventListener('loadedmetadata', () => {
    updateTimer();
  });

  function updateTimer() {
    if (!timeDisplay) return;
    const current = formatVideoTime(video.currentTime);
    const duration = formatVideoTime(video.duration || 0);
    timeDisplay.textContent = `${current} / ${duration}`;
  }

  function formatVideoTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }

  // Seeking on progressTimeline click
  if (progressTimeline) {
    progressTimeline.addEventListener('click', (e) => {
      const rect = progressTimeline.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      video.currentTime = clickPosition * video.duration;
    });
  }

  // Volume / Mute checks
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      muteBtn.innerHTML = video.muted ? '🔇' : '🔊';
    });
  }
}
