// Flight tracking system with real-time simulation
// Safari compatibility ensured
class FlightTracker {
    constructor() {
        this.flightData = {
            flightNumber: 'AA 8247',
            departure: {
                airport: 'ACC',
                time: '11:45 AM GMT',
                date: '2025-10-03'
            },
            arrival: {
                airport: 'SDF',
                time: '7:30 PM EST',
                date: '2025-10-03'
            },
            status: 'Scheduled',
            progress: 0,
            gate: null,
            currentLocation: null
        };
        
        this.statusUpdates = [
            { time: 0, status: 'Scheduled', message: 'Flight scheduled and confirmed' },
            { time: 10, status: 'Check-in Open', message: 'Online check-in is now available' },
            { time: 20, status: 'Gate Assigned', message: 'Gate A12 assigned for departure' },
            { time: 30, status: 'Boarding', message: 'Boarding has commenced' },
            { time: 40, status: 'Departed', message: 'Flight has departed from ACC' },
            { time: 60, status: 'In Flight', message: 'Cruising at 35,000 feet' },
            { time: 80, status: 'Approaching', message: 'Beginning descent to SDF' },
            { time: 100, status: 'Landed', message: 'Flight has arrived at SDF' }
        ];
        
        this.isTracking = false;
        this.trackingInterval = null;
        this.simulationSpeed = 2000; // 2 seconds per update
        
        this.init();
    }
    
    init() {
        this.updateLastUpdated();
        this.generateUniqueReferences();
        
        // Update status based on current date/time
        this.updateFlightStatus();
        
        // Set up periodic updates
        setInterval(() => {
            this.updateLastUpdated();
            this.updateFlightStatus();
        }, 30000); // Update every 30 seconds
    }
    
    generateUniqueReferences() {
        // Generate unique confirmation code and booking reference
        const confirmationCode = this.generateCode(8);
        const bookingReference = this.generateCode(8, true);
        
        document.getElementById('confirmationCode').textContent = confirmationCode;
        document.getElementById('bookingReference').textContent = bookingReference;
    }
    
    generateCode(length, includeNumbers) {
        if (typeof includeNumbers === 'undefined') includeNumbers = false;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const charset = includeNumbers ? chars + numbers : chars;
        let result = '';
        
        for (let i = 0; i < length; i++) {
            result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        
        return result;
    }
    
    updateLastUpdated() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const lastUpdatedElement = document.getElementById('lastUpdated');
        if (lastUpdatedElement) {
            lastUpdatedElement.textContent = timeString;
        }
    }
    
    updateFlightStatus() {
        const now = new Date();
        const flightDate = new Date('2025-10-03T11:45:00Z');
        const timeDiff = flightDate.getTime() - now.getTime();
        const hoursUntilFlight = timeDiff / (1000 * 60 * 60);
        
        // Update status based on time until flight
        if (hoursUntilFlight > 24) {
            this.updateStatusItem('checkinStatus', 'Check-in Opens 24h Before', false);
            this.updateStatusItem('departureStatus', 'Flight scheduled and confirmed', true);
        } else if (hoursUntilFlight > 2) {
            this.updateStatusItem('checkinStatus', 'Check-in Available', true);
            this.updateStatusItem('departureStatus', 'Flight scheduled and confirmed', true);
        } else if (hoursUntilFlight > 0) {
            this.updateStatusItem('checkinStatus', 'Check-in Closing Soon', true);
            this.updateStatusItem('departureStatus', 'Boarding Soon', true);
        } else {
            this.updateStatusItem('departureStatus', 'Departed', true);
            this.updateStatusItem('arrivalStatus', 'In Transit', true);
        }
    }
    
    updateStatusItem(elementId, text, isActive) {
        const element = document.getElementById(elementId);
        if (element) {
            element.querySelector('span').textContent = text;
            if (isActive) {
                element.classList.add('active');
            } else {
                element.classList.remove('active');
            }
        }
    }
    
    startLiveTracking() {
        if (this.isTracking) return;
        
        this.isTracking = true;
        let currentStep = 0;
        
        this.trackingInterval = setInterval(() => {
            if (currentStep < this.statusUpdates.length) {
                const update = this.statusUpdates[currentStep];
                this.updateLiveStatus(update.status, update.message, update.time);
                currentStep++;
            } else {
                // Flight completed, stop tracking
                this.stopLiveTracking();
            }
        }, this.simulationSpeed);
    }
    
    stopLiveTracking() {
        if (this.trackingInterval) {
            clearInterval(this.trackingInterval);
            this.trackingInterval = null;
        }
        this.isTracking = false;
    }
    
    updateLiveStatus(status, message, progress) {
        // Update status badge
        const statusBadge = document.getElementById('liveStatus');
        if (statusBadge) {
            statusBadge.textContent = status;
            statusBadge.className = 'status-badge';
            
            // Color coding for different statuses
            if (status.includes('Departed') || status.includes('In Flight')) {
                statusBadge.style.background = '#007bff';
            } else if (status.includes('Landed')) {
                statusBadge.style.background = '#28a745';
            } else if (status.includes('Boarding')) {
                statusBadge.style.background = '#ffc107';
            }
        }
        
        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        
        // Update current status
        const currentStatus = document.getElementById('currentStatus');
        if (currentStatus) {
            currentStatus.textContent = message;
        }
        
        // Update gate info
        const gateInfo = document.getElementById('gateInfo');
        if (gateInfo && progress >= 20) {
            gateInfo.textContent = 'Gate A12';
        }
        
        this.updateLastUpdated();
    }
}

// Initialize flight tracker
const flightTracker = new FlightTracker();

// Global functions for button interactions
function trackFlight() {
    const modal = document.getElementById('trackingModal');
    modal.classList.add('active');
    
    // Start live tracking simulation
    flightTracker.startLiveTracking();
}

function closeTracking() {
    const modal = document.getElementById('trackingModal');
    modal.classList.remove('active');
    
    // Stop live tracking
    flightTracker.stopLiveTracking();
}

function downloadTicket() {
    // Create a downloadable ticket with Safari compatibility
    const ticketContent = generateTicketContent();
    
    // Safari-compatible download approach
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // IE/Edge
        const blob = new Blob([ticketContent], { type: 'text/html' });
        window.navigator.msSaveOrOpenBlob(blob, 'AA8247_E-Ticket_Roseanne_Ronald.html');
    } else {
        // Modern browsers including Safari
        const blob = new Blob([ticketContent], { type: 'text/html' });
        const url = (window.URL || window.webkitURL).createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'AA8247_E-Ticket_Roseanne_Ronald.html';
        a.style.display = 'none';
        document.body.appendChild(a);
        
        // Safari requires a slight delay
        setTimeout(function() {
            a.click();
            document.body.removeChild(a);
            (window.URL || window.webkitURL).revokeObjectURL(url);
        }, 100);
    }
    
    // Show success message
    showNotification('E-Ticket downloaded successfully!', 'success');
}

function addToCalendar() {
    // Create calendar event
    const startDate = new Date('2025-10-03T11:45:00Z');
    const endDate = new Date('2025-10-03T19:30:00Z');
    
    const eventDetails = {
        title: 'Flight AA 8247 - Accra to Louisville',
        start: startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
        end: endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z',
        description: 'American Airlines Flight AA 8247\nPassenger: Roseanne Ronald\nFrom: Kotoka International Airport (ACC)\nTo: Louisville International Airport (SDF)\nConfirmation: ' + document.getElementById('confirmationCode').textContent,
        location: 'Kotoka International Airport, Accra, Ghana'
    };
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.description)}&location=${encodeURIComponent(eventDetails.location)}`;
    
    window.open(calendarUrl, '_blank');
    showNotification('Calendar event created!', 'success');
}

function generateTicketContent() {
    const confirmationCode = document.getElementById('confirmationCode').textContent;
    const bookingReference = document.getElementById('bookingReference').textContent;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <title>American Airlines E-Ticket</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .ticket { border: 2px solid #C41E3A; border-radius: 10px; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #C41E3A; padding-bottom: 20px; margin-bottom: 20px; }
        .logo { color: #C41E3A; font-size: 24px; font-weight: bold; }
        .flight-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .section { margin-bottom: 20px; }
        .label { font-weight: bold; color: #666; }
        .value { color: #333; }
        .barcode { text-align: center; font-family: 'Courier New', monospace; font-size: 24px; letter-spacing: 3px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="ticket">
        <div class="header">
            <div class="logo">AMERICAN AIRLINES</div>
            <h2>Electronic Ticket</h2>
        </div>
        
        <div class="flight-info">
            <div class="section">
                <div class="label">Passenger Name:</div>
                <div class="value">RONALD/ROSEANNE</div>
            </div>
            <div class="section">
                <div class="label">Confirmation Number:</div>
                <div class="value">${confirmationCode}</div>
            </div>
        </div>
        
        <div class="flight-info">
            <div class="section">
                <div class="label">Flight:</div>
                <div class="value">AA 8247</div>
            </div>
            <div class="section">
                <div class="label">Date:</div>
                <div class="value">03 OCT 2025</div>
            </div>
        </div>
        
        <div class="flight-info">
            <div class="section">
                <div class="label">From:</div>
                <div class="value">ACC - Kotoka International Airport</div>
                <div class="value">Departure: 11:45 AM GMT</div>
            </div>
            <div class="section">
                <div class="label">To:</div>
                <div class="value">SDF - Louisville International Airport</div>
                <div class="value">Arrival: 7:30 PM EST</div>
            </div>
        </div>
        
        <div class="section">
            <div class="label">Class:</div>
            <div class="value">Economy</div>
        </div>
        
        <div class="section">
            <div class="label">Amount Paid:</div>
            <div class="value">$1,850.00</div>
        </div>
        
        <div class="barcode">
            ||||| |||| | |||| ||||| | |||| ||||||
            ${bookingReference}
        </div>
        
        <div style="text-align: center; font-size: 12px; color: #666;">
            Please arrive at the airport at least 3 hours before international departure.
        </div>
    </div>
</body>
</html>
    `;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('trackingModal');
    if (event.target === modal) {
        closeTracking();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeTracking();
    }
});

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to status items
    const statusItems = document.querySelectorAll('.status-item');
    statusItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Add loading animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
});

// Simulate real-time updates
setInterval(() => {
    // Random small updates to make it feel more live
    const elements = document.querySelectorAll('.loading');
    elements.forEach(el => {
        el.style.opacity = Math.random() > 0.5 ? '1' : '0.7';
    });
}, 5000);

console.log('Flight Tracking System Initialized - AA 8247');
console.log('Passenger: Roseanne Ronald');
console.log('Route: ACC → SDF');
console.log('Date: October 3, 2025');
console.log('System ready for tracking...');