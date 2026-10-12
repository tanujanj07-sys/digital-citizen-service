// CivicConnect - Frontend-only demo using localStorage

const STORAGE_COMPLAINTS = "civicconnect_complaints";
const STORAGE_APPLICATIONS = "civicconnect_applications";

// Sample initial data
const sampleComplaints = [
  {
    id: "COMP-" + (Date.now() - 1000 * 60 * 60 * 24 * 3),
    category: "Road",
    location: "Shivaji Nagar, Kolhapur",
    description: "Large pothole on main road causing traffic issues.",
    citizenName: "Rahul Patil",
    citizenPhone: "9876543210",
    citizenEmail: "rahul@example.com",
    status: "In Progress",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: "COMP-" + (Date.now() - 1000 * 60 * 60 * 24 * 2),
    category: "Garbage",
    location: "Market Road, Pune",
    description: "Garbage not collected for 4 days, bad smell.",
    citizenName: "Priya Sharma",
    citizenPhone: "9123456789",
    citizenEmail: "priya@example.com",
    status: "Pending",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
  {
    id: "COMP-" + (Date.now() - 1000 * 60 * 60 * 24),
    category: "Street Light",
    location: "Gandhi Chowk, Kolhapur",
    description: "Street light not working since last week.",
    citizenName: "Amit Deshmukh",
    citizenPhone: "9988776655",
    citizenEmail: "amit@example.com",
    status: "Resolved",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
  },
];

const sampleApplications = [
  {
    id: "APP-" + (Date.now() - 1000 * 60 * 60 * 30),
    service: "Birth Certificate",
    applicantName: "Sneha Kulkarni",
    applicantPhone: "9011223344",
    applicantEmail: "sneha@example.com",
    status: "In Progress",
    submittedAt: Date.now() - 1000 * 60 * 60 * 30,
  },
  {
    id: "APP-" + (Date.now() - 1000 * 60 * 60 * 10),
    service: "Property Tax Payment",
    applicantName: "Vikram Jadhav",
    applicantPhone: "9876501234",
    applicantEmail: "vikram@example.com",
    status: "Pending",
    submittedAt: Date.now() - 1000 * 60 * 60 * 10,
  },
];

// Utilities
function loadFromStorage(key, fallback) {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return fallback;
    }
  }
  localStorage.setItem(key, JSON.stringify(fallback));
  return fallback;
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  if (m > 0) return `${m}m ago`;
  return "Just now";
}

function statusClass(status) {
  const s = (status || "").toLowerCase();
  if (s.includes("resolve")) return "status-resolved";
  if (s.includes("progress")) return "status-inprogress";
  if (s.includes("reject")) return "status-rejected";
  return "status-pending";
}

// Service details content
const serviceContentMap = {
  certificates: `
    <p>Apply for various citizen certificates online:</p>
    <ul>
      <li>Birth Certificate</li>
      <li>Death Certificate</li>
      <li>Residence / Domicile Certificate</li>
      <li>Caste Certificate</li>
      <li>Income Certificate</li>
    </ul>
    <p>To apply, visit your nearest municipal office or use the state e-District portal. This demo shows information only.</p>
  `,
  bills: `
    <p>Pay your utility and municipal bills:</p>
    <ul>
      <li>Water Bill</li>
      <li>Electricity Bill</li>
      <li>Property Tax</li>
      <li>Trade License Fee</li>
    </ul>
    <p>In a real system, you would be redirected to a secure payment gateway.</p>
  `,
  complaints: `
    <p>Report civic issues to the concerned department:</p>
    <ul>
      <li>Roads & Potholes</li>
      <li>Street Lights</li>
      <li>Garbage & Waste Management</li>
      <li>Water Supply & Leakage</li>
      <li>Drainage & Sewage</li>
      <li>Electricity Issues</li>
    </ul>
    <p>Use the “Raise a Civic Complaint” section to submit your issue.</p>
  `,
  schemes: `
    <p>Explore government schemes for citizens:</p>
    <ul>
      <li>Scholarships for students</li>
      <li>Housing schemes (PMAY, state housing)</li>
      <li>Health insurance (Ayushman Bharat, etc.)</li>
      <li>Women & child welfare schemes</li>
      <li>Agriculture & farmer support schemes</li>
    </ul>
    <p>Check eligibility criteria and required documents on the official scheme portals.</p>
  `,
};

// Render admin lists
function renderAdminComplaints() {
  const complaints = loadFromStorage(STORAGE_COMPLAINTS, sampleComplaints);
  const container = document.getElementById("adminComplaintsList");
  container.innerHTML = "";

  if (!complaints.length) {
    container.innerHTML = "<p>No complaints found.</p>";
    return;
  }

  complaints
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .forEach((c) => {
      const div = document.createElement("div");
      div.className = "admin-item";
      div.innerHTML = `
        <div class="admin-item-header">
          <div class="admin-item-id">${escapeHtml(c.id)}</div>
          <div class="admin-item-meta">
            ${escapeHtml(c.category)} • ${escapeHtml(c.location)} • ${timeAgo(c.createdAt)}
          </div>
        </div>
        <div class="admin-item-body">
          <div><strong>Citizen:</strong> ${escapeHtml(c.citizenName)} (${escapeHtml(c.citizenPhone)})</div>
          <div><strong>Issue:</strong> ${escapeHtml(c.description)}</div>
          <div class="track-status ${statusClass(c.status)}"><strong>Status:</strong> ${escapeHtml(c.status)}</div>
        </div>
      `;
      container.appendChild(div);
    });
}

function renderAdminApplications() {
  const applications = loadFromStorage(STORAGE_APPLICATIONS, sampleApplications);
  const container = document.getElementById("adminApplicationsList");
  container.innerHTML = "";

  if (!applications.length) {
    container.innerHTML = "<p>No applications found.</p>";
    return;
  }

  applications
    .slice()
    .sort((a, b) => b.submittedAt - a.submittedAt)
    .forEach((a) => {
      const div = document.createElement("div");
      div.className = "admin-item";
      div.innerHTML = `
        <div class="admin-item-header">
          <div class="admin-item-id">${escapeHtml(a.id)}</div>
          <div class="admin-item-meta">
            ${escapeHtml(a.service)} • ${timeAgo(a.submittedAt)}
          </div>
        </div>
        <div class="admin-item-body">
          <div><strong>Applicant:</strong> ${escapeHtml(a.applicantName)} (${escapeHtml(a.applicantPhone)})</div>
          ${a.applicantEmail ? `<div><strong>Email:</strong> ${escapeHtml(a.applicantEmail)}</div>` : ""}
          <div class="track-status ${statusClass(a.status)}"><strong>Status:</strong> ${escapeHtml(a.status)}</div>
        </div>
      `;
      container.appendChild(div);
    });
}

// Show service details panel
function showServiceDetails(serviceKey) {
  const panel = document.getElementById("serviceDetailsPanel");
  const title = document.getElementById("serviceDetailsTitle");
  const content = document.getElementById("serviceDetailsContent");

  const titlesMap = {
    certificates: "Certificates",
    bills: "Utility Bills",
    complaints: "Civic Complaints",
    schemes: "Government Schemes",
  };

  title.textContent = titlesMap[serviceKey] || "Service Details";
  content.innerHTML = serviceContentMap[serviceKey] || "<p>Details not available.</p>";
  panel.style.display = "block";
  window.location.hash = "#services";
}

// Handle complaint form submit
function handleComplaintSubmit(e) {
  e.preventDefault();

  const category = document.getElementById("complaintCategory").value.trim();
  const location = document.getElementById("complaintLocation").value.trim();
  const description = document.getElementById("complaintDescription").value.trim();
  const citizenName = document.getElementById("citizenName").value.trim();
  const citizenPhone = document.getElementById("citizenPhone").value.trim();
  const citizenEmail = document.getElementById("citizenEmail").value.trim();

  if (!category || !location || !description || !citizenName || !citizenPhone) {
    alert("Please fill all required fields.");
    return;
  }

  const complaints = loadFromStorage(STORAGE_COMPLAINTS, sampleComplaints);

  const newComplaint = {
    id: "COMP-" + Date.now(),
    category,
    location,
    description,
    citizenName,
    citizenPhone,
    citizenEmail,
    status: "Pending",
    createdAt: Date.now(),
  };

  complaints.push(newComplaint);
  saveToStorage(STORAGE_COMPLAINTS, complaints);

  // Show success
  document.getElementById("complaintForm").reset();
  document.getElementById("newComplaintId").textContent = newComplaint.id;
  document.getElementById("complaintSuccess").style.display = "block";

  // Refresh admin view
  renderAdminComplaints();

  setTimeout(() => {
    document.getElementById("complaintSuccess").style.display = "none";
  }, 8000);
}

// Track application/complaint
function handleTrack() {
  const id = document.getElementById("trackId").value.trim();
  const resultBox = document.getElementById("trackResult");
  resultBox.style.display = "block";
  resultBox.innerHTML = "";

  if (!id) {
    resultBox.innerHTML = "<p>Please enter an Application/Complaint ID.</p>";
    return;
  }

  const complaints = loadFromStorage(STORAGE_COMPLAINTS, sampleComplaints);
  const applications = loadFromStorage(STORAGE_APPLICATIONS, sampleApplications);

  const complaint = complaints.find((c) => c.id === id);
  const application = applications.find((a) => a.id === id);

  if (!complaint && !application) {
    resultBox.innerHTML = "<p>No record found for this ID.</p>";
    return;
  }

  if (complaint) {
    resultBox.innerHTML = `
      <h3>Complaint Details</h3>
      <div class="track-item">
        <div><strong>ID:</strong></div><div>${escapeHtml(complaint.id)}</div>
        <div><strong>Category:</strong></div><div>${escapeHtml(complaint.category)}</div>
        <div><strong>Location:</strong></div><div>${escapeHtml(complaint.location)}</div>
        <div><strong>Citizen:</strong></div><div>${escapeHtml(complaint.citizenName)}</div>
        <div><strong>Submitted:</strong></div><div>${timeAgo(complaint.createdAt)}</div>
        <div><strong>Status:</strong></div>
        <div class="track-status ${statusClass(complaint.status)}">${escapeHtml(complaint.status)}</div>
      </div>
      <p style="margin-top:10px;"><strong>Description:</strong> ${escapeHtml(complaint.description)}</p>
    `;
  } else if (application) {
    resultBox.innerHTML = `
      <h3>Application Details</h3>
      <div class="track-item">
        <div><strong>ID:</strong></div><div>${escapeHtml(application.id)}</div>
        <div><strong>Service:</strong></div><div>${escapeHtml(application.service)}</div>
        <div><strong>Applicant:</strong></div><div>${escapeHtml(application.applicantName)}</div>
        <div><strong>Submitted:</strong></div><div>${timeAgo(application.submittedAt)}</div>
        <div><strong>Status:</strong></div>
        <div class="track-status ${statusClass(application.status)}">${escapeHtml(application.status)}</div>
      </div>
    `;
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Initialize storage if needed
  loadFromStorage(STORAGE_COMPLAINTS, sampleComplaints);
  loadFromStorage(STORAGE_APPLICATIONS, sampleApplications);

  // Service buttons
  document.querySelectorAll("[data-service]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const serviceKey = btn.getAttribute("data-service");
      showServiceDetails(serviceKey);
    });
  });

  document.getElementById("closeServiceDetails").addEventListener("click", () => {
    document.getElementById("serviceDetailsPanel").style.display = "none";
  });

  // Complaint form
  document.getElementById("complaintForm").addEventListener("submit", handleComplaintSubmit);

  // Track button
  document.getElementById("trackBtn").addEventListener("click", handleTrack);

  // Admin tabs
  document.querySelectorAll(".admin-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".admin-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const target = tab.getAttribute("data-tab");
      if (target === "complaints") {
        document.getElementById("adminComplaints").style.display = "block";
        document.getElementById("adminApplications").style.display = "none";
        renderAdminComplaints();
      } else {
        document.getElementById("adminComplaints").style.display = "none";
        document.getElementById("adminApplications").style.display = "block";
        renderAdminApplications();
      }
    });
  });

  // Initial admin render
  renderAdminComplaints();
  renderAdminApplications();
});