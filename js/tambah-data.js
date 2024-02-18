// Import fungsi untuk mengambil data dari API
import { getPhotos, createPhoto, countPhotos, getPhotoById } from './api.js';

// Fungsi untuk menampilkan data foto
async function displayPhotos() {
  // Ambil elemen photosContainer dari HTML
  const photosContainer = document.getElementById('photosContainer');

  try {
    // Panggil fungsi untuk mengambil data foto dari API
    const photos = await getPhotos();

    // Periksa apakah ada data foto yang diperoleh
    if (photos && photos.length > 0) {
      // Loop melalui setiap foto
      photos.forEach((photo) => {
        // Buat elemen untuk menampilkan foto
        const photoElement = document.createElement('div');
        photoElement.classList.add('photo');

        // Tambahkan gambar foto
        const imageElement = document.createElement('img');
        imageElement.src = photo.images;
        imageElement.alt = photo.title;
        imageElement.dataset.title = photo.title; // Tambahkan dataset untuk menyimpan judul foto
        photoElement.appendChild(imageElement);

        // Tambahkan event listener untuk menampilkan informasi foto saat klik
        imageElement.addEventListener('click', () => {
          const infoElement = document.createElement('div');
          infoElement.classList.add('photo-info');
          infoElement.innerHTML = `
            <p>Judul: ${photo.title}</p>
            <p>Penulis: ${photo.author}</p>
            <p>Views: ${photo.views}</p>
            <p>Tags: ${photo.tags.join(', ')}</p>
            <p>Published at: ${photo.published_at}</p>
          `;
          photoElement.appendChild(infoElement);
        });

        // Tambahkan event listener untuk menyembunyikan informasi foto saat klik di luar foto
        document.addEventListener('click', (event) => {
          if (!photoElement.contains(event.target)) {
            const infoElement = photoElement.querySelector('.photo-info');
            if (infoElement) {
              photoElement.removeChild(infoElement);
            }
          }
        });

        // Tambahkan elemen foto ke dalam kontainer
        photosContainer.appendChild(photoElement);
      });
    } else {
      // Jika tidak ada data foto
      photosContainer.textContent = 'Tidak ada data foto.';
    }
  } catch (error) {
    // Tangani kesalahan jika gagal mengambil data dari API
    console.error('Error:', error);
    photosContainer.textContent = 'Terjadi kesalahan saat mengambil data foto.';
  }
}

// Fungsi untuk menghitung total data galeri foto
async function countTotalPhotos() {
  const totalPhotosElement = document.getElementById('totalPhotos');
  try {
    // Panggil fungsi countPhotos untuk menghitung total data galeri foto
    const response = await countPhotos();

    // Periksa apakah responsenya valid dan sukses
    if (response && response.code === 200 && response.status === 'success') {
      // Tampilkan jumlah total data galeri foto
      const totalCount = response.data.count;
      totalPhotosElement.textContent = `Total data galeri foto: ${totalCount}`;
      console.log('Total data galeri foto:', totalCount);
      console.log('Pesan:', response.message);
    } else {
      // Tampilkan pesan kesalahan jika respons tidak valid atau tidak sukses
      alert.error('Gagal menghitung data foto:', response.message);
    }
  } catch (error) {
    // Tangani kesalahan jika terjadi kesalahan saat melakukan permintaan API
    alert.error('Terjadi kesalahan:', error);
  }
}

// Panggil fungsi untuk menampilkan data foto saat dokumen selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
  displayPhotos();
  countTotalPhotos(); // Panggil fungsi untuk menghitung total data galeri foto
});

// menambahkan foto

// menambahkan foto
// menambahkan foto
const form = document.getElementById('addPhotoForm');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const photoData = Object.fromEntries(formData.entries());

  // Generate ID secara otomatis
  photoData.id = generateID();

  // Set waktu penambahan foto dalam zona waktu lokal
  photoData.published_at = new Date().toLocaleString(); // Menggunakan waktu saat ini dalam zona waktu lokal

  try {
    const response = await createPhoto(photoData);

    if (response && response.code === 201 && response.status === 'success') {
      console.log('Foto berhasil ditambahkan:', response.message);
      form.reset(); // Reset formulir setelah berhasil menambahkan foto
    } else {
      console.error('Gagal menambahkan foto:', response.message);
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  }
});

// Fungsi untuk menghasilkan ID unik
function generateID() {
  // Mendapatkan timestamp saat ini
  const timestamp = new Date().getTime();

  // Menghasilkan ID dengan menggunakan timestamp
  return `photo_${timestamp}`;
}

// Panggil fungsi untuk mengambil data foto berdasarkan ID
const photoId = 'your_photo_id_here'; // Ganti dengan ID foto yang ingin Anda ambil
getPhotoById(photoId)
  .then((photo) => {
    if (photo) {
      console.log('Data foto:', photo);
      // Lakukan sesuatu dengan data foto yang diperoleh
    } else {
      console.error('Data foto tidak ditemukan.');
    }
  })
  .catch((error) => {
    console.error('Terjadi kesalahan:', error);
  });

// Menambahkan event listener untuk menghapus foto saat ikon hapus di photo-info diklik
photosContainer.addEventListener('click', async (event) => {
  const deleteIcon = event.target.closest('.bi-trash');
  if (deleteIcon) {
    const photoElement = deleteIcon.closest('.photo');
    const photoId = photoElement.dataset.id; // Ambil ID foto dari dataset
    if (photoId) {
      if (confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
        const deleted = await deletePhotoById(photoId);
        if (deleted) {
          photoElement.remove(); // Hapus elemen foto dari tampilan setelah berhasil dihapus
          // Jika Anda ingin melakukan tindakan tambahan setelah penghapusan, Anda dapat menambahkannya di sini
        }
      }
    } else {
      console.error('ID foto tidak ditemukan.');
    }
  }
});
