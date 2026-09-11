/**
 * MANABS Real-time Notification Engine
 * Supports Webhook Dispatch, In-app Chime & Browser Push Alerts
 */

// Web Audio API synthesized notification chime (Zero external audio asset dependency)
export const playNotificationChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    // Friendly two-tone ping
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.46);
  } catch (e) {
    console.debug('Audio chime skipped:', e);
  }
};

// Dispatch Email or Webhook Alert to configured destinations
export const dispatchNotificationAlert = async (type, data, settings = {}) => {
  console.log(`[MANABS NOTIFICATION] Dispatching alert [${type}]:`, data);

  // Play audio cue
  playNotificationChime();

  // Try Browser native notification if permission granted
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      const title = type === 'inquiry' 
        ? `🚨 New Client Lead: ${data.name || 'Visitor'}` 
        : `📄 New Job Application: ${data.fullName || 'Candidate'}`;
      new Notification(title, {
        body: `Service/Role: ${data.service || data.jobTitle || 'General'}\nContact: ${data.phone || 'N/A'}`,
        icon: '/favicon.ico'
      });
    } catch (e) {
      console.debug('Browser notification error:', e);
    }
  }

  // If Webhook URL is configured in Admin Settings
  if (settings.webhookUrl && settings.webhookUrl.trim().startsWith('http')) {
    try {
      await fetch(settings.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'MANABS Enterprise Portal',
          event: type,
          timestamp: new Date().toISOString(),
          payload: data
        })
      });
    } catch (err) {
      console.warn('Webhook dispatch failed:', err);
    }
  }

  return { success: true, timestamp: new Date().toISOString() };
};
