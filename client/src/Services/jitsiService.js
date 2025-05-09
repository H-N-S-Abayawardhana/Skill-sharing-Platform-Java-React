// src/services/jitsiService.js
/**
 * Service for handling Jitsi Meet integration
 * Provides methods for initializing the API and managing conference sessions
 */

class JitsiService {
  constructor() {
    this.api = null;
    this.isApiLoaded = false;
    this.domain = 'meet.jit.si';
    this.script = null;
  }

  /**
   * Loads the Jitsi Meet External API script
   * @returns {Promise} - Resolves when the script is loaded
   */
  loadJitsiScript() {
    return new Promise((resolve, reject) => {
      // Only load script once
      if (this.isApiLoaded) {
        resolve();
        return;
      }

      // Check if script already exists in DOM
      if (document.getElementById('jitsi-api-script')) {
        this.isApiLoaded = true;
        resolve();
        return;
      }

      // Create script element
      this.script = document.createElement('script');
      this.script.id = 'jitsi-api-script';
      this.script.src = `https://${this.domain}/external_api.js`;
      this.script.async = true;
      this.script.onload = () => {
        this.isApiLoaded = true;
        console.log('Jitsi Meet API loaded successfully');
        resolve();
      };
      this.script.onerror = (error) => {
        console.error('Error loading Jitsi Meet API:', error);
        reject(error);
      };

      // Add script to document
      document.body.appendChild(this.script);
    });
  }

  /**
   * Initialize and return a Jitsi Meet API instance
   * @param {Object} options - Configuration options
   * @returns {Object} - The Jitsi Meet API instance
   */
  async initJitsiMeet(options) {
    try {
      // Load the script if not already loaded
      await this.loadJitsiScript();

      // Default options
      const defaultOptions = {
        roomName: 'LiveSkillSession',
        width: '100%',
        height: '100%',
        parentNode: document.querySelector('#jitsi-container'),
        configOverwrite: {
          prejoinPageEnabled: false,
          disableDeepLinking: true,
          startWithAudioMuted: true,
          startWithVideoMuted: false,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
            'security'
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          MOBILE_APP_PROMO: false,
        },
        userInfo: {
          displayName: 'Guest User'
        }
      };

      // Merge default options with provided options
      const mergedOptions = { ...defaultOptions, ...options };
      
      // Use the JitsiMeetExternalAPI constructor from the global scope
      if (window.JitsiMeetExternalAPI) {
        // Clean up any existing instance
        if (this.api) {
          this.api.dispose();
        }

        // Create new instance
        this.api = new window.JitsiMeetExternalAPI(this.domain, mergedOptions);
        
        // Add event listeners
        this.setupEventListeners();
        
        return this.api;
      } else {
        throw new Error('Jitsi Meet API not loaded');
      }
    } catch (error) {
      console.error('Failed to initialize Jitsi Meet:', error);
      throw error;
    }
  }

  /**
   * Set up event listeners for the Jitsi Meet API
   */
  setupEventListeners() {
    if (!this.api) return;

    // Listen for events
    this.api.addListener('videoConferenceJoined', () => {
      console.log('User has joined the conference');
    });

    this.api.addListener('videoConferenceLeft', () => {
      console.log('User has left the conference');
    });

    this.api.addListener('participantJoined', (participant) => {
      console.log('Participant joined:', participant);
    });

    this.api.addListener('participantLeft', (participant) => {
      console.log('Participant left:', participant);
    });

    this.api.addListener('readyToClose', () => {
      console.log('Jitsi Meet is ready to close');
    });
  }

  /**
   * Dispose of the Jitsi Meet API instance
   */
  disposeJitsiMeet() {
    if (this.api) {
      this.api.dispose();
      this.api = null;
    }
  }

  /**
   * Generate a unique room name based on the session title
   * @param {string} title - The session title
   * @returns {string} - A URL-friendly room name
   */
  generateRoomName(title) {
    // Create a sanitized room name from the title
    const sanitized = title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
      
    // Add a timestamp to ensure uniqueness
    const timestamp = new Date().getTime().toString(36);
    return `${sanitized}-${timestamp}`;
  }
}

// Export singleton instance
const jitsiService = new JitsiService();
export default jitsiService;