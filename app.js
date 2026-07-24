const books = [
  { id: 1, title: 'Algoritma dan Pemrograman', author: 'Rinaldi Munir', year: 2022, category: 'Dasar Pemrograman' },
  { id: 2, title: 'Struktur Data', author: 'Rinaldi Munir', year: 2023, category: 'Dasar Pemrograman' },
  { id: 3, title: 'Basis Data', author: 'Sudarsono', year: 2021, category: 'Database' },
  { id: 4, title: 'Jaringan Komputer', author: 'Behrouz A. Forouzan', year: 2022, category: 'Networking' },
  { id: 5, title: 'Sistem Operasi', author: 'Abraham Silberschatz', year: 2021, category: 'OS' },
  { id: 6, title: 'Rekayasa Perangkat Lunak', author: 'Pressman', year: 2023, category: 'RPL' },
  { id: 7, title: 'Pemrograman Web', author: 'Nugroho', year: 2020, category: 'Web Development' },
  { id: 8, title: 'Machine Learning Dasar', author: 'Ethem Alpaydin', year: 2022, category: 'AI' },
  { id: 9, title: 'Kecerdasan Buatan', author: 'Stuart Russell', year: 2021, category: 'AI' },
  { id: 10, title: 'Cloud Computing', author: 'Thomas Erl', year: 2023, category: 'Cloud' },
  { id: 11, title: 'Desain Analisis Algoritma', author: 'Cormen', year: 2022, category: 'Algorithm' },
  { id: 12, title: 'Komputer dan Masyarakat', author: 'Suyanto', year: 2022, category: 'Social Tech' },
  { id: 13, title: 'Keamanan Siber', author: 'William Stallings', year: 2024, category: 'Cyber Security' },
  { id: 14, title: 'IoT untuk Pemula', author: 'Ari Wibowo', year: 2023, category: 'Internet of Things' },
  { id: 15, title: 'Mobile Programming Android', author: 'Burhanudin', year: 2021, category: 'Mobile' },
  { id: 16, title: 'Pemrograman Python', author: 'Mark Lutz', year: 2022, category: 'Programming Language' },
  { id: 17, title: 'DevOps Praktis', author: 'Sam Guckenheimer', year: 2023, category: 'Deployment' },
  { id: 18, title: 'Microservice Architecture', author: 'Chris Richardson', year: 2023, category: 'Software Architecture' },
  { id: 19, title: 'Data Mining', author: 'Larose', year: 2022, category: 'Data Science' },
  { id: 20, title: 'Big Data Analytics', author: 'Jiawei Han', year: 2024, category: 'Data Science' }
];

const STORAGE_KEY = 'perpus_kampus_records';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

const bookList = document.getElementById('bookList');
const bookSelect = document.getElementById('bookSelect');
const bookCount = document.getElementById('bookCount');
const borrowForm = document.getElementById('borrowForm');
const message = document.getElementById('message');
const openAdmin = document.getElementById('openAdmin');
const adminModal = document.getElementById('adminModal');
const adminLoginForm = document.getElementById('adminLoginForm');
const loginError = document.getElementById('loginError');
const adminPanel = document.getElementById('adminPanel');
const requestTableBody = document.getElementById('requestTableBody');
const totalRequests = document.getElementById('totalRequests');
const returnedCount = document.getElementById('returnedCount');
const activeCount = document.getElementById('activeCount');
const logoutAdmin = document.getElementById('logoutAdmin');

function loadRecords() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function renderBooks() {
  const records = loadRecords();
  const borrowedIds = records.filter(item => item.status !== 'returned').map(item => item.bookId);

  bookList.innerHTML = '';
  bookSelect.innerHTML = '';

  books.forEach((book) => {
    const isBorrowed = borrowedIds.includes(book.id);
    const card = document.createElement('article');
    card.className = 'book-card';
    card.innerHTML = `
      <h3>${book.title}</h3>
      <div class="book-meta">Penulis: ${book.author}</div>
      <div class="book-meta">Tahun: ${book.year}</div>
      <div class="book-meta">Kategori: ${book.category}</div>
      <div class="book-status ${isBorrowed ? 'borrowed' : 'available'}">${isBorrowed ? 'Sedang Dipinjam' : 'Tersedia'}</div>
    `;
    bookList.appendChild(card);

    const option = document.createElement('option');
    option.value = book.id;
    option.textContent = `${book.title} - ${book.author}`;
    bookSelect.appendChild(option);
  });

  bookCount.textContent = `${books.length} Buku`;
}

function renderAdminPanel() {
  const records = loadRecords();
  const total = records.length;
  const returned = records.filter(item => item.status === 'returned').length;
  const active = total - returned;

  totalRequests.textContent = total;
  returnedCount.textContent = returned;
  activeCount.textContent = active;

  requestTableBody.innerHTML = '';

  if (!records.length) {
    requestTableBody.innerHTML = `<tr><td colspan="6">Belum ada data peminjaman.</td></tr>`;
    return;
  }

  records.forEach((record) => {
    const book = books.find(item => item.id === record.bookId);
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.name}</td>
      <td>${record.nim}</td>
      <td>${book ? book.title : '-'}</td>
      <td>${record.date}</td>
      <td><span class="status-pill ${record.status}">${record.status === 'returned' ? 'Dikembalikan' : 'Dipinjam'}</span></td>
      <td>
        <button class="btn btn-outline" data-id="${record.id}">${record.status === 'returned' ? 'Batal' : 'Kembalikan'}</button>
      </td>
    `;
    requestTableBody.appendChild(row);
  });

  requestTableBody.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      const records = loadRecords();
      const updated = records.map((record) => {
        if (record.id === id) {
          return {
            ...record,
            status: record.status === 'returned' ? 'pending' : 'returned'
          };
        }
        return record;
      });
      saveRecords(updated);
      renderBooks();
      renderAdminPanel();
    });
  });
}

borrowForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const bookId = Number(document.getElementById('bookSelect').value);
  const name = document.getElementById('borrowerName').value.trim();
  const nim = document.getElementById('borrowerNim').value.trim();
  const date = document.getElementById('borrowDate').value;
  const records = loadRecords();

  const existingPending = records.some(record => record.bookId === bookId && record.status !== 'returned');
  if (existingPending) {
    message.textContent = 'Buku ini sedang dipinjam oleh peminjam lain.';
    message.classList.add('error');
    return;
  }

  records.push({
    id: Date.now(),
    bookId,
    name,
    nim,
    date,
    status: 'pending'
  });

  saveRecords(records);
  renderBooks();
  renderAdminPanel();
  borrowForm.reset();
  message.textContent = 'Peminjaman berhasil dicatat. Admin dapat mengecek data di panel admin.';
  message.classList.remove('error');
});

openAdmin.addEventListener('click', () => {
  adminModal.hidden = false;
  adminModal.classList.remove('hidden');
  loginError.textContent = '';
});

adminModal.addEventListener('click', (event) => {
  if (event.target === adminModal) {
    adminModal.hidden = true;
    adminModal.classList.add('hidden');
  }
});

adminLoginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const user = document.getElementById('adminUser').value.trim();
  const pass = document.getElementById('adminPass').value.trim();

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    adminModal.hidden = true;
    adminModal.classList.add('hidden');
    adminPanel.classList.remove('hidden');
    renderAdminPanel();
    loginError.textContent = '';
  } else {
    loginError.textContent = 'Username atau password admin salah.';
  }
});

logoutAdmin.addEventListener('click', () => {
  adminPanel.classList.add('hidden');
  adminLoginForm.reset();
});

renderBooks();
renderAdminPanel();
