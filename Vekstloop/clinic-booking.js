const environments = {
  development: "https://anitapatientapi-dev.azurewebsites.net",
  production: "https://patientapi.anitadental.no"
};

// Set the environment (change to 'development' for dev environment)
const environment = 'production';
const baseURL = environments[environment];
const clinicId = 24; // Replace with your clinic ID

// Utility function to format date
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Fetch available times
async function fetchAvailableTimes(startDate, endDate) {
  const response = await fetch(`${baseURL}/api/appointments/availabletimes/week?startDate=${startDate}T00:00:00.000Z&endDate=${endDate}T23:00:00.000Z&clinicId=${clinicId}`);
  const data = await response.json();
  return data.data;
}

// Fetch appointment types
async function fetchAppointmentTypes() {
  const response = await fetch(`${baseURL}/api/appointments/appointmenttypes/${clinicId}`);
  const data = await response.json();
  return data.data;
}

// Fetch dentists
async function fetchDentists() {
  const response = await fetch(`${baseURL}/api/dictionary/dentists?clinicId=${clinicId}`);
  const data = await response.json();
  return data.data;
}

// Display available times
async function displayAvailableTimes() {
  const startDate = formatDate(new Date());
  const endDate = formatDate(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000));
  const availableTimes = await fetchAvailableTimes(startDate, endDate);

  const timesContainer = document.getElementById('available-times');
  timesContainer.innerHTML = '';

  availableTimes.forEach(day => {
    const date = day.date;
    const timeranges = day.timeranges;

    if (timeranges.length > 0) {
      timeranges.forEach(slot => {
        const timeSlotDiv = document.createElement('div');
        timeSlotDiv.textContent = `${date} - ${slot.times}`;
        timesContainer.appendChild(timeSlotDiv);
      });
    }
  });
}

// Display appointment types
async function displayAppointmentTypes() {
  const appointmentTypes = await fetchAppointmentTypes();
  const typesContainer = document.getElementById('appointment-types');
  typesContainer.innerHTML = '';

  appointmentTypes.forEach(type => {
    const typeDiv = document.createElement('div');
    typeDiv.textContent = `${type.name} - ${type.price} NOK`;
    typesContainer.appendChild(typeDiv);
  });
}

// Display dentists
async function displayDentists() {
  const dentists = await fetchDentists();
  const dentistsContainer = document.getElementById('dentists');
  dentistsContainer.innerHTML = '';

  dentists.forEach(dentist => {
    const dentistDiv = document.createElement('div');
    dentistDiv.textContent = `${dentist.name} - ${dentist.title}`;
    dentistsContainer.appendChild(dentistDiv);
  });
}

// Register a new patient
async function registerPatient(patientDetails) {
  const response = await fetch(`${baseURL}/api/patients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Clinicid': clinicId
    },
    body: JSON.stringify(patientDetails)
  });
  const data = await response.json();
  return data.data;
}

// Book an appointment
async function bookAppointment(bookingDetails) {
  const bookingObject = {
    timerange: bookingDetails.timerange,
    userId: bookingDetails.userId,
    date: bookingDetails.date,
    referralCode: bookingDetails.referralCode,
    appointmentTypeId: bookingDetails.appointmentTypeId,
    notes: bookingDetails.notes,
    patientId: bookingDetails.patientId
  };

  const base64BookingObject = btoa(JSON.stringify(bookingObject));
  window.location.href = `${baseURL}?eid=${bookingDetails.eid}&bobj=${base64BookingObject}&dname=${bookingDetails.dname}`;
}

// Initialize the forms and display available times
document.addEventListener('DOMContentLoaded', function () {
  displayAvailableTimes();
  displayAppointmentTypes();
  displayDentists();

  document.getElementById('register-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const patientDetails = {
      confirmPolicies: true,
      sex: "U",
      clinicId: clinicId,
      phoneNumber: "+4798852105", // Replace with actual phone number
      email: document.getElementById('email').value,
      firstName: document.getElementById('first-name').value,
      lastName: document.getElementById('last-name').value,
      ssn: document.getElementById('ssn').value,
      userId: "486" // Replace with appropriate user ID if needed
    };
    const patientId = await registerPatient(patientDetails);
    alert(`Patient registered with ID: ${patientId}`);
  });

  document.getElementById('booking-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const bookingDetails = {
      timerange: document.getElementById('timerange').value,
      userId: "486", // Replace with actual user ID
      date: document.getElementById('date').value,
      referralCode: "asdas", // Replace with actual referral code if available
      appointmentTypeId: document.getElementById('appointmentTypeId').value,
      notes: document.getElementById('notes').value,
      patientId: 60754, // Replace with actual patient ID
      eid: 1, // e.g., BankID
      dname: "Dentist Name" // Replace with actual dentist name
    };
    bookAppointment(bookingDetails);
  });
});
