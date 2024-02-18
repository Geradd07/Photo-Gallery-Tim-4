// Import fungsi untuk mengambil data dari API
import { getPhotos, editPhotoById } from './api.js';

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
          // Hapus informasi sebelumnya jika ada
          const existingInfoElement = photoElement.querySelector('.photo-info');
          if (existingInfoElement) {
            photoElement.removeChild(existingInfoElement);
          }

          // Tambahkan informasi baru
          const infoElement = document.createElement('div');
          infoElement.classList.add('photo-info');
          infoElement.innerHTML = `
            <p>Judul: ${photo.title}</p>
            <p>Penulis: ${photo.author}</p>
            <p>Views: ${photo.views}</p>
            <p>Tags: ${Array.isArray(photo.tags) ? photo.tags.join(', ') : ''}</p> <!-- Periksa apakah tags adalah array -->
            <p>Published at: ${photo.published_at}</p>
            <div class="icons">
              <i class="bi bi-pencil-square"></i> <!-- Icon edit -->
            </div>
          `;
          photoElement.appendChild(infoElement);

          // Menambahkan event listener untuk mengedit foto saat ikon edit diklik
          const editIcon = infoElement.querySelector('.bi-pencil-square');
          editIcon.addEventListener('click', () => {
            // Simpan ID foto yang dipilih
            const selectedPhotoId = photo.id;

            // Isi formulir dengan data foto yang dipilih
            document.getElementById('title').value = photo.title;
            document.getElementById('author').value = photo.author;
            document.getElementById('views').value = photo.views;
            document.getElementById('tags').value = Array.isArray(photo.tags) ? photo.tags.join(', ') : ''; // Periksa apakah tags adalah array
            document.getElementById('images').value = photo.images;

            // Tampilkan modal pengeditan
            $('#editModal').modal('show');

            // Tambahkan event listener untuk tombol "Simpan Perubahan"
            const editPhotoForm = document.getElementById('editPhotoForm');
            editPhotoForm.addEventListener('submit', async (event) => {
              event.preventDefault();

              // Mendapatkan data yang diperbarui dari formulir
              const updatedPhoto = {
                title: document.getElementById('title').value,
                author: document.getElementById('author').value,
                views: parseInt(document.getElementById('views').value),
                tags: [], // Inisialisasi tags sebagai array kosong secara default
                images: document.getElementById('images').value,
              };

              // Mendapatkan nilai tags dari elemen HTML dengan ID 'tags'
              const tagsValue = document.getElementById('tags').value;
              // Memeriksa apakah tagsValue adalah sebuah string
              if (typeof tagsValue === 'string' || tagsValue instanceof String) {
                // Memastikan bahwa tagsValue tidak kosong sebelum menggunakan split
                if (tagsValue.trim() !== '') {
                  updatedPhoto.tags = tagsValue.split(',').map((tag) => tag.trim());
                }
              }

              try {
                // Memanggil fungsi untuk mengedit data foto berdasarkan ID foto yang dipilih
                const response = await editPhotoById(selectedPhotoId, updatedPhoto);
                if (response && response.code === 200 && response.status === 'success') {
                  console.log('Data foto berhasil diubah:', response.message);
                  // Sembunyikan modal setelah berhasil mengubah data
                  $('#editModal').modal('hide');
                  // Perbarui tampilan foto setelah mengubah data
                  displayPhotos();
                } else {
                  console.error('Gagal mengubah data foto:', response.message);
                }
              } catch (error) {
                console.error('Terjadi kesalahan saat mengubah data foto:', error);
              }
            });
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
