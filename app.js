// Main Application Logic
const mainApp = document.getElementById('main-app');
const authSection = document.getElementById('auth-section');

// Auth State Listener
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        authSection.classList.add('hidden');
        mainApp.classList.remove('hidden');
        renderMainApp();
    } else {
        // User is signed out
        authSection.classList.remove('hidden');
        mainApp.classList.add('hidden');
    }
});

function renderMainApp() {
    mainApp.innerHTML = `
        <div class="max-w-4xl mx-auto">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Emergency Services</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Ambulance Service Card -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden border border-red-100">
                    <div class="p-6">
                        <div class="flex items-center mb-4">
                            <i class="fas fa-ambulance text-red-500 text-2xl mr-3"></i>
                            <h3 class="text-lg font-medium text-gray-900">Ambulance Service</h3>
                        </div>
                        <p class="text-gray-600 mb-4">Request immediate medical assistance with our 10-minute response guarantee.</p>
                        <button id="request-ambulance" class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition duration-150">
                            Request Ambulance
                        </button>
                    </div>
                </div>

                <!-- Blood Delivery Card -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden border border-red-100">
                    <div class="p-6">
                        <div class="flex items-center mb-4">
                            <i class="fas fa-tint text-red-500 text-2xl mr-3"></i>
                            <h3 class="text-lg font-medium text-gray-900">Blood Delivery</h3>
                        </div>
                        <p class="text-gray-600 mb-4">Get urgent blood supply delivered to your location within 10 minutes.</p>
                        <button id="request-blood" class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition duration-150">
                            Request Blood
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add event listeners for service buttons
    document.getElementById('request-ambulance').addEventListener('click', showAmbulanceForm);
    document.getElementById('request-blood').addEventListener('click', showBloodForm);
}

function showAmbulanceForm() {
    mainApp.innerHTML = `
        <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div class="flex items-center mb-6">
                <button id="back-to-services" class="mr-3 text-gray-500 hover:text-gray-700">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h3 class="text-lg font-medium text-gray-900">Ambulance Request</h3>
            </div>

            <form id="ambulance-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Emergency Type</label>
                    <select id="emergency-type" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500">
                        <option value="">Select emergency type</option>
                        <option value="heart-attack">Heart Attack</option>
                        <option value="accident">Accident</option>
                        <option value="stroke">Stroke</option>
                        <option value="respiratory">Respiratory Emergency</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Location</label>
                    <div class="mt-1 flex rounded-md shadow-sm">
                        <input type="text" id="location-input" required
                               class="flex-1 rounded-l-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                               placeholder="Enter address or click to use current location">
                        <button type="button" id="get-location" 
                                class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100">
                            <i class="fas fa-location-arrow"></i>
                        </button>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Additional Notes</label>
                    <textarea id="emergency-notes" rows="3"
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                              placeholder="Any additional information about the emergency"></textarea>
                </div>

                <div class="flex items-center">
                    <input id="critical-case" type="checkbox" 
                           class="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500">
                    <label for="critical-case" class="ml-2 block text-sm text-gray-700">
                        This is a critical/life-threatening emergency
                    </label>
                </div>

                <button type="submit" 
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Request Ambulance
                </button>
            </form>
        </div>
    `;

    // Back button functionality
    document.getElementById('back-to-services').addEventListener('click', renderMainApp);

    // Location button functionality
    document.getElementById('get-location').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    document.getElementById('location-input').value = `${latitude}, ${longitude}`;
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    alert('Could not get your location. Please enter it manually.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser. Please enter your location manually.');
        }
    });

    // Form submission
    document.getElementById('ambulance-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const emergencyType = document.getElementById('emergency-type').value;
        const location = document.getElementById('location-input').value;
        const notes = document.getElementById('emergency-notes').value;
        const isCritical = document.getElementById('critical-case').checked;

        // Create ambulance request in Firestore
        db.collection('ambulance_requests').add({
            userId: auth.currentUser.uid,
            emergencyType,
            location,
            notes,
            isCritical,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then((docRef) => {
            console.log('Ambulance request created with ID: ', docRef.id);
            showRequestTracking(docRef.id, 'ambulance');
        })
        .catch((error) => {
            console.error('Error creating ambulance request: ', error);
        });
    });
}

function showBloodForm() {
    mainApp.innerHTML = `
        <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div class="flex items-center mb-6">
                <button id="back-to-services" class="mr-3 text-gray-500 hover:text-gray-700">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h3 class="text-lg font-medium text-gray-900">Blood Delivery Request</h3>
            </div>

            <form id="blood-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Blood Type</label>
                    <select id="blood-type" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500">
                        <option value="">Select blood type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Quantity (units)</label>
                    <input type="number" id="blood-quantity" min="1" max="10" required
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Location</label>
                    <div class="mt-1 flex rounded-md shadow-sm">
                        <input type="text" id="blood-location" required
                               class="flex-1 rounded-l-md border-gray-300 focus:border-red-500 focus:ring-red-500"
                               placeholder="Enter hospital or delivery address">
                        <button type="button" id="get-blood-location" 
                                class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100">
                            <i class="fas fa-location-arrow"></i>
                        </button>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Patient Details</label>
                    <input type="text" id="patient-name"
                           class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                           placeholder="Patient name (optional)">
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700">Urgency Level</label>
                    <select id="urgency-level" required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500">
                        <option value="normal">Normal (within 1 hour)</option>
                        <option value="urgent">Urgent (within 30 minutes)</option>
                        <option value="critical">Critical (10-minute delivery)</option>
                    </select>
                </div>

                <button type="submit" 
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Request Blood Delivery
                </button>
            </form>
        </div>
    `;

    // Back button functionality
    document.getElementById('back-to-services').addEventListener('click', renderMainApp);

    // Location button functionality
    document.getElementById('get-blood-location').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    document.getElementById('blood-location').value = `${latitude}, ${longitude}`;
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    alert('Could not get your location. Please enter it manually.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser. Please enter your location manually.');
        }
    });

    // Form submission
    document.getElementById('blood-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const bloodType = document.getElementById('blood-type').value;
        const quantity = document.getElementById('blood-quantity').value;
        const location = document.getElementById('blood-location').value;
        const patientName = document.getElementById('patient-name').value;
        const urgency = document.getElementById('urgency-level').value;

        // Create blood request in Firestore
        db.collection('blood_requests').add({
            userId: auth.currentUser.uid,
            bloodType,
            quantity: parseInt(quantity),
            location,
            patientName,
            urgency,
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then((docRef) => {
            console.log('Blood request created with ID: ', docRef.id);
            // Will implement tracking view in next step
        })
        .catch((error) => {
            console.error('Error creating blood request: ', error);
        });
    });
}

// Logout functionality
function logout() {
    auth.signOut().then(() => {
        console.log('User signed out');
    }).catch((error) => {
        console.error('Logout error:', error);
    });
}

function showRequestTracking(requestId, requestType) {
    const collectionName = `${requestType}_requests`;
    const serviceName = requestType === 'ambulance' ? 'Ambulance' : 'Blood Delivery';
    const icon = requestType === 'ambulance' ? 'fa-ambulance' : 'fa-tint';
    
    mainApp.innerHTML = `
        <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
            <div class="flex items-center mb-6">
                <button id="back-to-services" class="mr-3 text-gray-500 hover:text-gray-700">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h3 class="text-lg font-medium text-gray-900">${serviceName} Tracking</h3>
            </div>

            <div class="text-center">
                <i class="fas ${icon} text-red-500 text-5xl mb-4"></i>
                <h4 class="text-xl font-semibold mb-2">Your ${serviceName.toLowerCase()} is on the way!</h4>
                <p class="text-gray-600 mb-6">Estimated arrival in: <span id="countdown" class="font-bold">10:00</span></p>
                
                <div class="bg-gray-100 rounded-lg p-4 mb-6">
                    <div class="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Request ID:</span>
                        <span class="font-medium">${requestId}</span>
                    </div>
                    <div class="flex justify-between text-sm text-gray-600">
                        <span>Status:</span>
                        <span id="request-status" class="font-medium text-red-600">Pending</span>
                    </div>
                </div>

                <div id="map-placeholder" class="h-48 bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
                    <p class="text-gray-500">Map view will appear here</p>
                </div>

                <button id="cancel-request" class="text-sm text-red-600 hover:text-red-800">
                    <i class="fas fa-times-circle mr-1"></i> Cancel Request
                </button>
            </div>
        </div>
    `;

    // Back button functionality
    document.getElementById('back-to-services').addEventListener('click', renderMainApp);

    // Cancel request functionality
    document.getElementById('cancel-request').addEventListener('click', () => {
        if (confirm('Are you sure you want to cancel this request?')) {
            db.collection(collectionName).doc(requestId).update({
                status: 'cancelled',
                cancelledAt: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                alert('Request cancelled successfully');
                renderMainApp();
            })
            .catch((error) => {
                console.error('Error cancelling request:', error);
            });
        }
    });

    // Start countdown timer (10 minutes)
    let minutes = 10;
    let seconds = 0;
    const countdownElement = document.getElementById('countdown');
    
    const countdown = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(countdown);
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }
        
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);

    // Listen for status updates
    db.collection(collectionName).doc(requestId).onSnapshot((doc) => {
        const status = doc.data().status;
        document.getElementById('request-status').textContent = status.charAt(0).toUpperCase() + status.slice(1);
        
        if (status === 'completed' || status === 'cancelled') {
            clearInterval(countdown);
        }
    });
}
