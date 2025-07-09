// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2lwfMH_lvRZMWcdqlCd3wSkJ_-H2ZgNs",
  authDomain: "redtagmanagement-9e2a9.firebaseapp.com",
  projectId: "redtagmanagement-9e2a9",
  storageBucket: "redtagmanagement-9e2a9.firebasestorage.app",
  messagingSenderId: "265095516523",
  appId: "1:265095516523:web:45d8df97952383f5677c2e",
  measurementId: "G-PLJM034RBL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Sample data storage (in a real app, this would be server-side)
let redTags = [
    {
        tagNo: "3168",
        area: "ZONE 7.1",
        subArea: "Section A",
        dateDetected: "2025-06-05",
        detectedBy: "John Doe",
        description: "Faulty wiring",
        beforePhoto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABnSURBVDhP7cxBCsAgDETR6P3P3KZQKBRB3PxNQJg8eCkM4zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zT9xQv5ACggA+3gYQAAAABJRU5ErkJggg==",
        removedBy: "Jane Smith",
        dateRemoved: "2025-06-08",
        actionTaken: "Replaced faulty component",
        afterPhoto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABnSURBVDhP7cxBCsAgDETR6P3P3KZQKBRB3PxNQJg8eCkM4zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zT9xQv5ACggA+3gYQAAAABJRU5ErkJggg==",
        status: "removed"
    },
    {
        tagNo: "3169",
        area: "ZONE 7.2",
        subArea: "Section B",
        dateDetected: "2025-06-07",
        detectedBy: "Mike Johnson",
        description: "Leaking valve",
        beforePhoto: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABnSURBVDhP7cxBCsAgDETR6P3P3KZQKBRB3PxNQJg8eCkM4zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zRN0zT9xQv5ACggA+3gYQAAAABJRU5ErkJggg==",
        removedBy: "",
        dateRemoved: "",
        actionTaken: "",
        afterPhoto: "",
        status: "pending"
    }
];

// Update current date
function updateCurrentDate() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    document.getElementById('current-date').textContent = `${day}/${month}/${year}`;
}

// Initialize form dates with today's date
document.getElementById('date').valueAsDate = new Date();
document.getElementById('removalDate').valueAsDate = new Date();

// Tab functionality
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// Photo preview functionality for "Before" photo
document.getElementById('beforePhoto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.getElementById('beforePhotoPreview');
            preview.src = event.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Photo preview functionality for "After" photo
document.getElementById('afterPhoto').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.getElementById('afterPhotoPreview');
            preview.src = event.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Form submission handler - Add new tag
document.getElementById('red-tag-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const tagNo = document.getElementById('tagNo').value;
    const area = document.getElementById('area').value;
    const subArea = document.getElementById('subArea').value;
    const date = document.getElementById('date').value;
    const detectedBy = document.getElementById('detectedBy').value;
    const description = document.getElementById('description').value;
    const beforePhotoInput = document.getElementById('beforePhoto');
    
    // Check if photo was uploaded
    if (!beforePhotoInput.files || beforePhotoInput.files.length === 0) {
        alert('Please upload a "Before" photo');
        return;
    }
    
    // Read the photo file
    const reader = new FileReader();
    reader.onload = function(event) {
        // Create new tag object with photo
        const newTag = {
            tagNo,
            area,
            subArea,
            dateDetected: date,
            detectedBy,
            description,
            beforePhoto: event.target.result,
            removedBy: "",
            dateRemoved: "",
            actionTaken: "",
            afterPhoto: "",
            status: "pending"
        };
        
        // Add to our data store
        redTags.push(newTag);
        
        // Update the dashboard numbers
        updateDashboardCounts();
        
        // Update history table
        updateHistoryTable();
        
        // Reset form
        document.getElementById('red-tag-form').reset();
        document.getElementById('beforePhotoPreview').style.display = 'none';
        document.getElementById('date').valueAsDate = new Date();
        
        // Show success message
        alert(`Red Tag #${tagNo} added successfully for ${area}`);
        
        // Update the "last updated" date
        updateCurrentDate();
        
        // Switch to history tab to see the new entry
        document.querySelector('.tab[data-tab="tag-history"]').click();
    };
    reader.readAsDataURL(beforePhotoInput.files[0]);
});

// Form submission handler - Remove tag
document.getElementById('remove-tag-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const tagNo = document.getElementById('removeTagNo').value;
    const removedBy = document.getElementById('removedBy').value;
    const removalDate = document.getElementById('removalDate').value;
    const actionTaken = document.getElementById('actionTaken').value;
    const afterPhotoInput = document.getElementById('afterPhoto');
    
    // Check if photo was uploaded
    if (!afterPhotoInput.files || afterPhotoInput.files.length === 0) {
        alert('Please upload an "After" photo');
        return;
    }
    
    // Find the tag
    const tagIndex = redTags.findIndex(tag => tag.tagNo === tagNo);
    
    if (tagIndex === -1) {
        alert(`Tag #${tagNo} not found!`);
        return;
    }
    
    if (redTags[tagIndex].status === "removed") {
        alert(`Tag #${tagNo} was already removed on ${redTags[tagIndex].dateRemoved}`);
        return;
    }
    
    // Read the photo file
    const reader = new FileReader();
    reader.onload = function(event) {
        // Update tag details with photo
        redTags[tagIndex].removedBy = removedBy;
        redTags[tagIndex].dateRemoved = removalDate;
        redTags[tagIndex].actionTaken = actionTaken;
        redTags[tagIndex].afterPhoto = event.target.result;
        redTags[tagIndex].status = "removed";
        
        // Update the dashboard numbers
        updateDashboardCounts();
        
        // Update history table
        updateHistoryTable();
        
        // Reset form
        document.getElementById('remove-tag-form').reset();
        document.getElementById('afterPhotoPreview').style.display = 'none';
        document.getElementById('removalDate').valueAsDate = new Date();
        
        // Show success message
        alert(`Red Tag #${tagNo} has been marked as removed`);
        
        // Update the "last updated" date
        updateCurrentDate();
        
        // Switch to history tab to see the updated entry
        document.querySelector('.tab[data-tab="tag-history"]').click();
    };
    reader.readAsDataURL(afterPhotoInput.files[0]);
});

// Update dashboard counts based on redTags data
function updateDashboardCounts() {
    const totalTags = redTags.length;
    const removedTags = redTags.filter(tag => tag.status === "removed").length;
    const pendingTags = totalTags - removedTags;
    
    // Update summary row
    const summaryRow = document.querySelector('#tag-data tr.summary-row');
    summaryRow.cells[2].textContent = totalTags;
    summaryRow.cells[3].textContent = removedTags;
    summaryRow.cells[4].textContent = pendingTags;
    
    // Update zone 7.1
    const zone71Tags = redTags.filter(tag => tag.area === "ZONE 7.1");
    const zone71Removed = zone71Tags.filter(tag => tag.status === "removed").length;
    document.querySelector('#tag-data tr:nth-child(2) td:nth-child(3)').textContent = zone71Tags.length;
    document.querySelector('#tag-data tr:nth-child(2) td:nth-child(4)').textContent = zone71Removed;
    document.querySelector('#tag-data tr:nth-child(2) td:nth-child(5)').textContent = zone71Tags.length - zone71Removed;
    
    // Update zone 7.2
    const zone72Tags = redTags.filter(tag => tag.area === "ZONE 7.2");
    const zone72Removed = zone72Tags.filter(tag => tag.status === "removed").length;
    document.querySelector('#tag-data tr:nth-child(3) td:nth-child(3)').textContent = zone72Tags.length;
    document.querySelector('#tag-data tr:nth-child(3) td:nth-child(4)').textContent = zone72Removed;
    document.querySelector('#tag-data tr:nth-child(3) td:nth-child(5)').textContent = zone72Tags.length - zone72Removed;
    
    // Update zone 7.3
    const zone73Tags = redTags.filter(tag => tag.area === "ZONE 7.3");
    const zone73Removed = zone73Tags.filter(tag => tag.status === "removed").length;
    document.querySelector('#tag-data tr:nth-child(4) td:nth-child(3)').textContent = zone73Tags.length;
    document.querySelector('#tag-data tr:nth-child(4) td:nth-child(4)').textContent = zone73Removed;
    document.querySelector('#tag-data tr:nth-child(4) td:nth-child(5)').textContent = zone73Tags.length - zone73Removed;
}

// Update history table
function updateHistoryTable() {
    const historyBody = document.getElementById('history-data');
    historyBody.innerHTML = '';
    
    redTags.forEach(tag => {
        const row = document.createElement('tr');
        
        // Create photo display cell
        let photosCell = '-';
        if (tag.beforePhoto || tag.afterPhoto) {
            photosCell = '';
            if (tag.beforePhoto) {
                photosCell += `<img src="${tag.beforePhoto}" class="history-photo" onclick="openModal('${tag.beforePhoto}')" title="Before Photo">`;
            }
            if (tag.afterPhoto) {
                photosCell += `<img src="${tag.afterPhoto}" class="history-photo" onclick="openModal('${tag.afterPhoto}')" title="After Photo">`;
            }
        }
        
        row.innerHTML = `
            <td>${tag.tagNo}</td>
            <td>${tag.area}</td>
            <td>${tag.detectedBy}</td>
            <td>${formatDate(tag.dateDetected)}</td>
            <td>${tag.removedBy || '-'}</td>
            <td>${tag.dateRemoved ? formatDate(tag.dateRemoved) : '-'}</td>
            <td><span class="${tag.status === 'removed' ? 'removed-cell' : 'pending-cell'}">${
                tag.status === 'removed' ? 'Removed' : 'Pending'
            }</span></td>
            <td>${photosCell}</td>
            <td>${tag.actionTaken || '-'}</td>
        `;
        
        historyBody.appendChild(row);
    });
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Modal functionality for viewing photos
function openModal(imageSrc) {
    const modal = document.getElementById('photoModal');
    const modalImg = document.getElementById('modalImage');
    modal.style.display = "block";
    modalImg.src = imageSrc;
}

// Close the modal when clicking the X
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('photoModal').style.display = "none";
});

// Close the modal when clicking outside the image
window.addEventListener('click', function(event) {
    const modal = document.getElementById('photoModal');
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Initialize
updateCurrentDate();
updateDashboardCounts();
updateHistoryTable();
