# 🏃 Puadh Marathon — Registration & Payment Portal

A web-based marathon registration platform built to simplify participant registration, race selection, payment submission, and registration status tracking for the Puadh Marathon.

## 📌 Project Overview

Puadh Marathon is designed to provide participants with a simple, accessible registration experience while helping organizers manage registrations and verify payments efficiently.

The platform connects a frontend registration form with Google Sheets through Google Apps Script, providing a lightweight backend without requiring a separate server.

## ✨ Features

* **Participant Registration:** Collects participant details through an online registration form.
* **Age-Based Race Selection:** Participants under 17 are automatically assigned to the 3K race, while eligible participants can choose between the 5K and 10K races.
* **Dynamic Registration Fees:** Displays the applicable registration fee based on the selected event.
* **QR-Based Payment:** Provides payment instructions and a QR code for participants to complete their payment.
* **Payment Submission:** Allows participants to submit their payment details for verification.
* **Google Sheets Integration:** Stores registration records in Google Sheets through Google Apps Script.
* **Payment Verification Workflow:** Supports organizer review of submitted payment details.
* **Registration Status Tracking:** Allows participants to check their registration or payment verification status.

## 🛠️ Tech Stack

| Technology         | Purpose                                                                 |
| ------------------ | ----------------------------------------------------------------------- |
| HTML5              | Page structure and registration form                                    |
| CSS3               | Styling and responsive interface                                        |
| JavaScript         | Form validation, race selection, fee calculation, and API communication |
| Google Apps Script | Backend endpoints and registration processing                           |
| Google Sheets      | Registration data storage                                               |

## ⚙️ How It Works

1. A participant opens the registration website.
2. They enter their details and select an eligible race.
3. The website determines the applicable registration fee.
4. The participant follows the QR-based payment instructions.
5. They submit their payment details for verification.
6. Registration information is stored in Google Sheets.
7. The organizer reviews the payment and updates the registration status.
8. The participant checks their status through the website.

## 🚀 Setup Instructions

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <YOUR_PROJECT_FOLDER>
```

### 2. Configure Google Sheets

* Create a Google Sheet for participant registrations.
* Add the required column headers.
* Open **Extensions → Apps Script**.
* Add the backend code to `Code.gs`.
* Configure the spreadsheet ID and sheet name.

### 3. Deploy Google Apps Script

* Deploy the script as a web app.
* Configure the required access permissions.
* Copy the deployment URL ending in `/exec`.
* Add the URL to the frontend JavaScript configuration.

### 4. Run the website

Open the homepage HTML file in your browser or use a local development server.

Ensure that the Apps Script deployment is accessible and that its permissions, sheet headers, and frontend configuration match.

## 🔐 Security & Privacy

* Do not commit private credentials, access tokens, or sensitive participant information.
* Do not upload real registration spreadsheets or payment records to a public repository.
* Use a separate test spreadsheet when developing or debugging.
* Treat payment submissions as **pending verification** until an organizer confirms them.
* Keep the deployed Apps Script URL and payment details configured appropriately for the intended public access.

## 🎯 Project Goals

* Simplify marathon registration.
* Reduce manual data-entry work for organizers.
* Provide clear payment instructions and registration status updates.
* Demonstrate frontend-to-backend integration using Google Apps Script and Google Sheets.

## 🔮 Future Improvements

* Automated registration confirmation emails.
* Unique registration IDs and downloadable receipts.
* Organizer dashboard with search and filtering.
* Improved payment reconciliation and duplicate-submission prevention.
* Stronger server-side validation and access controls.
* Deployment on a public hosting platform.

## 👨‍💻 Author

**Avi Kabansal**

Computer Science Engineering — Artificial Intelligence & Machine Learning

GitHub: [@avikabansal32](https://github.com/avikabansal32)

---

*Built to make marathon registration and payment management simpler for participants and organizers.*
