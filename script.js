/* ============================================================
   PUADH MARATHON 2026 - one script for every page
   ============================================================ */

const API_URL =
  "https://script.google.com/macros/s/AKfycbyC3QJApBwE6DgrAT8oDlyp1A5CnX1yf7uSGu_x4ci9qtoBPepB0qGjt8ynNwkiwcvmEg/exec";

// ---- PAYMENT SETTINGS: check these before going live ----
const UPI_ID = "gurcharangeneratorservice@oksbi";
const PAYEE_NAME = "Puadh Club";
// ---------------------------------------------------------

const RACE_DATE = Date.UTC(2026, 11, 13); // 13 December 2026

const RACES = {
  "3K Fun Race":    { fee: 300 },
  "5K Fun Race":    { fee: 300 },
  "10K Adult Race": { fee: 500 }
};

async function apiRequest(payload) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    redirect: "follow"
  });
  if (!response.ok) throw new Error("The server could not be reached.");
  return response.json();
}

/* ---------------- Age helpers ---------------- */

function getAgeOnRaceDay(dobValue) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dobValue || "");
  if (!m) return null;
  const y = +m[1], mo = +m[2], d = +m[3];
  const birth = new Date(Date.UTC(y, mo - 1, d));
  if (birth.getUTCFullYear() !== y || birth.getUTCMonth() !== mo - 1 ||
      birth.getUTCDate() !== d || birth.getTime() > RACE_DATE) return null;

  const race = new Date(RACE_DATE);
  let age = race.getUTCFullYear() - y;
  if (race.getUTCMonth() < mo - 1 ||
      (race.getUTCMonth() === mo - 1 && race.getUTCDate() < d)) age--;
  return age;
}

function getCategory(age) {
  if (age <= 17) return "Under 17";
  if (age <= 35) return "18-35";
  if (age <= 45) return "36-45";
  if (age <= 55) return "46-55";
  if (age <= 64) return "56-64";
  return "65+";
}

/* ---------------- Registration page ---------------- */

const registrationForm = document.getElementById("registrationForm");

if (registrationForm) {
  const dobInput = document.getElementById("dob");
  const eventSelect = document.getElementById("event");
  const eventFee = document.getElementById("eventFee");
  const ageCategoryDisplay = document.getElementById("ageCategoryDisplay");

  function showFee() {
    const race = RACES[eventSelect.value];
    eventFee.textContent = race
      ? `${eventSelect.value}: registration fee ₹${race.fee}`
      : "Choose a race to see your fee.";
  }

  function updateRaceOptions() {
    const age = getAgeOnRaceDay(dobInput.value);
    eventSelect.innerHTML = "";

    if (age === null) {
      eventSelect.add(new Option("Enter a valid date of birth first", ""));
      ageCategoryDisplay.textContent =
        "Enter a valid date of birth on or before the race date.";
      eventFee.textContent = "Your race and fee will appear here.";
      return;
    }

    ageCategoryDisplay.textContent =
      `${getCategory(age)} category (age ${age} on race day)`;

    if (age <= 17) {
      eventSelect.add(new Option("3K Fun Race — ₹300", "3K Fun Race"));
      eventSelect.value = "3K Fun Race";
    } else {
      eventSelect.add(new Option("Select your race", ""));
      eventSelect.add(new Option("5K Fun Race — ₹500", "5K Fun Race"));
      eventSelect.add(new Option("10K Adult Race — ₹500", "10K Adult Race"));
    }
    showFee();
  }

  dobInput.addEventListener("change", updateRaceOptions);
  eventSelect.addEventListener("change", showFee);

  registrationForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!registrationForm.reportValidity()) return;

    const submitButton = registrationForm.querySelector('[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Saving your registration...";

    try {
      const result = await apiRequest({
        action: "register",
        fullName: document.getElementById("fullName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        dob: dobInput.value,
        gender: document.getElementById("gender").value,
        event: eventSelect.value,
        tshirt: document.getElementById("tshirt").value,
        emergencyName: document.getElementById("emergencyName").value.trim(),
        emergencyPhone: document.getElementById("emergencyPhone").value.trim()
      });

      if (!result.success) throw new Error(result.message || "Registration failed.");

      sessionStorage.setItem("marathonRegistrationId", result.registrationId);
      sessionStorage.setItem("marathonRegistrationFee", String(result.fee));
      sessionStorage.setItem("marathonRegistrationEvent", result.event);
      sessionStorage.setItem("marathonRegistrationName",
        document.getElementById("fullName").value.trim());

      window.location.href = "payment.html";
    } catch (error) {
      alert("Registration could not be completed:\n" +
            (error.message || "Please try again."));
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}

/* ---------------- Payment page ---------------- */

const paymentButton = document.getElementById("paymentButton");

if (paymentButton) {
  const registrationId = sessionStorage.getItem("marathonRegistrationId");
  const fee = Number(sessionStorage.getItem("marathonRegistrationFee"));
  const race = sessionStorage.getItem("marathonRegistrationEvent");
  const name = sessionStorage.getItem("marathonRegistrationName");

  const details = document.getElementById("registrationDetails");
  const amountEl = document.getElementById("paymentAmount");
  const qrBox = document.getElementById("qrcode");
  const upiLink = document.getElementById("upiLink");
  const upiIdText = document.getElementById("upiIdText");

  if (!registrationId || !fee || !race) {
    details.innerHTML = "<p>No registration found. Please register first.</p>";
    amountEl.textContent = "—";
    paymentButton.disabled = true;
    document.getElementById("paymentArea").hidden = true;
  } else {
    details.innerHTML =
      `<p><strong>Registration ID:</strong> ${registrationId}</p>` +
      (name ? `<p><strong>Name:</strong> ${escapeHtml(name)}</p>` : "") +
      `<p><strong>Race:</strong> ${escapeHtml(race)}</p>`;
    amountEl.textContent = "₹" + fee;

    // UPI payment link with the exact amount and registration ID as the note
    const upiUrl =
      "upi://pay?pa=" + encodeURIComponent(UPI_ID).replace("%40", "@") +
      "&pn=" + encodeURIComponent(PAYEE_NAME) +
      "&am=" + fee.toFixed(2) +
      "&cu=INR" +
      "&tn=" + encodeURIComponent("Puadh Marathon " + registrationId);

    upiLink.href = upiUrl;
    upiIdText.textContent = UPI_ID;

    if (typeof QRCode !== "undefined") {
      qrBox.innerHTML = "";
      new QRCode(qrBox, {
        text: upiUrl,
        width: 220,
        height: 220,
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      qrBox.textContent =
        "QR could not load. Use the button below or pay to the UPI ID.";
    }
  }

  paymentButton.addEventListener("click", async () => {
    const utr = document.getElementById("utr").value.trim();

    if (!registrationId) return alert("Please register first.");
    if (!/^[0-9]{12}$/.test(utr)) {
      return alert("Enter the 12-digit UPI transaction ID (UTR) from your payment app.");
    }

    paymentButton.disabled = true;
    paymentButton.textContent = "Submitting...";

    try {
      const result = await apiRequest({ action: "submitPayment", registrationId, utr });
      if (!result.success) throw new Error(result.message || "Submission failed.");
      window.location.href = "success.html";
    } catch (error) {
      alert(error.message);
      paymentButton.disabled = false;
      paymentButton.textContent = "Submit Payment Details →";
    }
  });
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------------- Success page ---------------- */

const successRegistration = document.getElementById("successRegistration");

if (successRegistration) {
  const id = sessionStorage.getItem("marathonRegistrationId");
  successRegistration.textContent = id
    ? "Registration ID: " + id
    : "Registration submitted. Please keep your registration details.";
}

/* ---------------- Status page ---------------- */

const statusForm = document.getElementById("statusForm");

if (statusForm) {
  const statusButton = document.getElementById("statusButton");
  const statusResult = document.getElementById("statusResult");
  const statusHeading = document.getElementById("statusHeading");
  const statusMessage = document.getElementById("statusMessage");
  const statusReference = document.getElementById("statusReference");

  const saved = sessionStorage.getItem("marathonRegistrationId");
  if (saved) document.getElementById("statusRegistrationId").value = saved;

  statusForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const registrationId =
      document.getElementById("statusRegistrationId").value.trim();
    const email = document.getElementById("statusEmail").value.trim();

    statusButton.disabled = true;
    statusButton.textContent = "Checking...";
    statusResult.hidden = true;

    try {
      const result = await apiRequest({ action: "getStatus", registrationId, email });
      statusResult.hidden = false;

      if (!result.success) {
        statusHeading.textContent = "Unable to find registration";
        statusMessage.textContent =
          result.message || "Check your registration ID and email.";
        statusReference.textContent = "";
        return;
      }

      const labels = {
        AWAITING_PAYMENT: "Payment Awaited",
        PENDING_VERIFICATION: "Payment Under Verification",
        PAID: "Registration Confirmed",
        PAYMENT_ISSUE: "Payment Needs Attention"
      };

      statusHeading.textContent = labels[result.status] || "Registration Status";
      statusMessage.textContent = result.message;
      statusReference.textContent = "Registration ID: " + result.registrationId;
    } catch (error) {
      statusResult.hidden = false;
      statusHeading.textContent = "Could not check status";
      statusMessage.textContent = "Please try again in a moment.";
      statusReference.textContent = "";
    } finally {
      statusButton.disabled = false;
      statusButton.textContent = "Check Status →";
    }
  });
}
