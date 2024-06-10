const environments = {
  development: "https://anitapatientapi-dev.azurewebsites.net",
  production: "https://patientapi.anitadental.no"
};

// Set the environment (change to 'development' for dev environment)
const environment = 'production';
const baseURL = environments[environment];
const clinicId = 24; // Replace with your clinic ID

// Utility function to format date to 'YYYY-MM-DD'
function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${year}-${month}-${day}`;
}

// Utility function to convert 'dd.mm.yyyy' to 'YYYY-MM-DD'
function convertDateFormat(dateString) {
  const [day, month, year] = dateString.split('.');
  return `${year}-${month}-${day}`;
}

// Fetch clinic info
async function fetchClinicInfo() {
  try {
    const response = await fetch(`${baseURL}/api/clinic/${clinicId}`, {
      headers: { Clinicid: clinicId }
    });
    if (!response.ok) throw new Error('Failed to fetch clinic info');
    const data = await response.json();
    console.log('Clinic info data:', data);
    return data.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Fetch available times
async function fetchAvailableTimes(startDate, endDate, bookingTypeId) {
  try {
    const response = await fetch(`${baseURL}/api/appointments/availabletimes/week?startDate=${startDate}T00:00:00.000Z&endDate=${endDate}T23:00:00.000Z&bookingType=${bookingTypeId}&clinicId=${clinicId}`);
    if (!response.ok) throw new Error('Failed to fetch available times');
    const data = await response.json();
    console.log('Available times data:', data); // Log the fetched data
    return data.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Fetch appointment types
async function fetchAppointmentTypes() {
  try {
    const response = await fetch(`${baseURL}/api/appointments/appointmenttypes/${clinicId}`, {
      headers: { Clinicid: clinicId }
    });
    if (!response.ok) throw new Error('Failed to fetch appointment types');
    const data = await response.json();
    console.log('Appointment types data:', data); // Log the fetched data
    return data.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Fetch dentists
async function fetchDentists() {
  try {
    const response = await fetch(`${baseURL}/api/dictionary/dentists?clinicId=${clinicId}`, {
      headers: { Clinicid: clinicId }
    });
    if (!response.ok) throw new Error('Failed to fetch dentists');
    const data = await response.json();
    console.log('Dentists data:', data); // Log the fetched data
    return data.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Filter dentists based on availability
function filterDentists(availableTimes, selectedDate) {
  const availableDentists = new Set();
  availableTimes.forEach(day => {
    const formattedDate = convertDateFormat(day.date);
    if (formattedDate === selectedDate) {
      day.timeranges.forEach(slot => {
        availableDentists.add(slot.userId);
      });
    }
  });
  return availableDentists;
}

// Display available times and filter dentists
async function displayAvailableTimesAndDentists(selectedDate, bookingTypeId) {
  const startDate = formatDate(new Date());
  const endDate = formatDate(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000));
  const availableTimes = await fetchAvailableTimes(startDate, endDate, bookingTypeId);
  console.log('Available times:', availableTimes);

  const timesContainer = document.getElementById('timerange');
  timesContainer.innerHTML = '';

  const filteredTimes = availableTimes.find(day => convertDateFormat(day.date) === selectedDate) || { timeranges: [] };
  console.log('Filtered times:', filteredTimes); // Log the filtered times
  if (filteredTimes.timeranges.length > 0) {
    filteredTimes.timeranges.forEach(slot => {
      const option = document.createElement('option');
      option.value = slot.times;
      option.textContent = slot.times;
      timesContainer.appendChild(option);
    });
  } else {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'No available times';
    timesContainer.appendChild(option);
  }

  const availableDentists = filterDentists(availableTimes, selectedDate);
  const dentists = await fetchDentists();
  const dentistsContainer = document.getElementById('dentistId');
  dentistsContainer.innerHTML = '';

  dentists.forEach(dentist => {
    if (availableDentists.has(dentist.id)) {
      const option = document.createElement('option');
      option.value = dentist.id;
      option.textContent = `${dentist.name} - ${dentist.title}`;
      dentistsContainer.appendChild(option);
    }
  });
}

// Display appointment types
async function displayAppointmentTypes() {
  const appointmentTypes = await fetchAppointmentTypes();
  const typesContainer = document.getElementById('appointmentTypeId');
  typesContainer.innerHTML = '';

  appointmentTypes.forEach(type => {
    const option = document.createElement('option');
    option.value = type.id;
    option.textContent = `${type.name} - ${type.price} NOK`;
    typesContainer.appendChild(option);
  });
}

// Register a new patient
async function registerPatient(patientDetails) {
  try {
    const response = await fetch(`${baseURL}/api/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Clinicid': clinicId
      },
      body: JSON.stringify(patientDetails)
    });
    if (!response.ok) throw new Error('Failed to register patient');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    alert('Failed to register patient');
    return null;
  }
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

// Create and append form elements dynamically
function createFormElements() {
  const formContainer = document.createElement('div');
  formContainer.innerHTML = `
    <div>
        <h2>Register Patient</h2>
        <form id="register-form">
            <input type="text" id="first-name" placeholder="First Name" required>
            <input type="text" id="last-name" placeholder="Last Name" required>
            <input type="email" id="email" placeholder="Email" required>
            <input type="text" id="phone-number" placeholder="Phone Number" required>
            <input type="text" id="ssn" placeholder="SSN" required>
            <button type="submit">Register</button>
        </form>
    </div>

    <div>
        <h2>Book Appointment</h2>
        <form id="booking-form">
            <input type="hidden" id="patientId">
            <input type="date" id="date" required>
            <select id="timerange" required></select>
            <select id="appointmentTypeId" required></select>
            <select id="dentistId" required></select>
            <input type="text" id="referralCode" placeholder="Referral Code">
            <input type="text" id="notes" placeholder="Notes">
            <button type="submit">Book Appointment</button>
        </form>
    </div>
  `;
  document.getElementById('app').appendChild(formContainer);
}

// Initialize the forms and display available times
document.addEventListener('DOMContentLoaded', function () {
  createFormElements();
  displayAppointmentTypes();

  document.getElementById('date').addEventListener('change', function () {
    const selectedDate = formatDate(this.value); // Ensure selectedDate is formatted correctly
    const bookingTypeId = document.getElementById('appointmentTypeId').value;
    displayAvailableTimesAndDentists(selectedDate, bookingTypeId);
  });

  document.getElementById('register-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const patientDetails = {
      confirmPolicies: true,
      sex: "U",
      clinicId: clinicId,
      phoneNumber: document.getElementById('phone-number').value,
      email: document.getElementById('email').value,
      firstName: document.getElementById('first-name').value,
      lastName: document.getElementById('last-name').value,
      ssn: document.getElementById('ssn').value,
      userId: document.getElementById('dentistId').value // Use the selected dentist ID
    };
    const patientId = await registerPatient(patientDetails);
    if (patientId) {
      alert(`Patient registered with ID: ${patientId}`);
      document.getElementById('patientId').value = patientId; // Set the patient ID for booking
    }
  });

  document.getElementById('booking-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const bookingDetails = {
      timerange: document.getElementById('timerange').value,
      userId: document.getElementById('dentistId').value,
      date: formatDate(document.getElementById('date').value),
      referralCode: document.getElementById('referralCode').value,
      appointmentTypeId: document.getElementById('appointmentTypeId').value,
      notes: document.getElementById('notes').value,
      patientId: document.getElementById('patientId').value, // This should be set after registering a patient
      eid: 1, // e.g., BankID
      dname: document.getElementById('dentistId').selectedOptions[0].textContent // Use the selected dentist name
    };
    bookAppointment(bookingDetails);
  });

  document.getElementById('appointmentTypeId').addEventListener('change', function () {
    const selectedDate = formatDate(document.getElementById('date').value);
    const bookingTypeId = this.value;
    if (selectedDate) {
      displayAvailableTimesAndDentists(selectedDate, bookingTypeId);
    }
  });
});
