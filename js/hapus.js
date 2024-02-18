// Import fungsi untuk mengambil data dari API
import { getPhotos, deletePhotoById } from './api.js';

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
        imageElement.dataset.id = photo.id; // Tambahkan dataset untuk menyimpan ID foto
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
            <div class="icons">
              <i class="bi bi-trash"></i> <!-- Icon hapus -->
            </div>
          `;
          photoElement.appendChild(infoElement);

          // Menambahkan event listener untuk menghapus foto saat ikon hapus diklik
          const deleteIcon = infoElement.querySelector('.bi-trash');
          deleteIcon.addEventListener('click', async (event) => {
            event.stopPropagation(); // Menghentikan event klik agar tidak memicu event listener imageElement

            if (confirm('Apakah Anda yakin ingin menghapus foto ini?')) {
              try {
                const deleted = await deletePhotoById(photo.id);
                if (deleted) {
                  // Hapus elemen foto dari tampilan setelah berhasil dihapus
                  photoElement.remove();
                }
              } catch (error) {
                console.error('Terjadi kesalahan saat menghapus foto:', error);
              }
            }
          });
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

// Panggil fungsi untuk menampilkan data foto saat dokumen selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
  displayPhotos();
});
