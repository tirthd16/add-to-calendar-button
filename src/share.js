import { atcb_secure_url } from "./atcb-util";
function formatEventMessage(event) {
  const startDate = new Date(event.startDate);
  const formattedDate = startDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const startTime = event.startTime.slice(0, 5);
  const endTime = event.endTime.slice(0, 5);

  let message = `${event.name}\n\n`;
  message += `${event.desc}\n\n`;
  message += `📅 ${formattedDate}\n`;
  message += `⏰ ${startTime} - ${endTime}\n`;
  message += `📍 ${event.location}, ${event.city}\n`;
  message += `💵 ${event.price} EUR\n\n`;
  message += `For more events - Visit https://www.example.org`;
  
  return message;
}

function openSecureLink(url) {
  if (atcb_secure_url(url)) {
    const newTab = window.open(url, "_blank");
    if (newTab) {
      newTab.focus();
    }
  }
}

function shareOnWhatsApp(event) {
  const message = formatEventMessage(event);
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  openSecureLink(url);
}

function shareOnFacebook(event, pageUrl) {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
  openSecureLink(url);
}

function shareOnTwitter(event, pageUrl) {
  const message = `${event.title} - ${event.startDate} at ${event.location}, ${event.city}. For more events - Visit https://www.example.org`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(pageUrl)}`;
  openSecureLink(url);
}

function shareByEmail(event) {
  const subject = `Join me at ${event.title} on ${event.startDate}`;
  const body = formatEventMessage(event);
  const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  openSecureLink(url);
}

async function copyToClipboard(event) {
  const message = formatEventMessage(event);

  try {
    await navigator.clipboard.writeText(message);
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);

    const textArea = document.createElement('textarea');
    textArea.value = message;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      console.error('Fallback copy failed: ', err);
      document.body.removeChild(textArea);
      return false;
    }
  }
}

export {
  shareByEmail,
  shareOnTwitter,
  shareOnFacebook,
  shareOnWhatsApp,
  copyToClipboard
};
