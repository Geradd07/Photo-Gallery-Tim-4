// Import fungsi pencarian dari API
import { searchPhotosByTitle } from './api.js';

// Tangkap elemen-elemen HTML yang diperlukan
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Menangani acara pengajuan formulir pencarian
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  // Ambil nilai pencarian dari input
  const searchTerm = searchInput.value.trim();

  // Bersihkan daftar hasil pencarian sebelumnya
  searchResults.innerHTML = '';

  try {
    // Panggil fungsi pencarian dari API
    const photos = await searchPhotosByTitle(searchTerm);

    // Tampilkan hasil pencarian
    if (photos.length > 0) {
      photos.forEach((photo) => {
        // Buat elemen untuk menampilkan gambar
        const imageElement = document.createElement('img');
        imageElement.src = photo.images;
        imageElement.alt = photo.title;
        imageElement.style.maxWidth = '200px';
        imageElement.style.margin = '10px';

        // Tambahkan event listener untuk menampilkan informasi tambahan saat gambar di klik
        imageElement.addEventListener('click', () => {
          // Buat elemen untuk menampilkan informasi tambahan
          const infoElement = document.createElement('div');
          infoElement.classList.add('photo-info');
          infoElement.innerHTML = `
            <p>Judul: ${photo.title}</p>
            <p>Penulis: ${photo.author}</p>
            <p>Views: ${photo.views}</p>
            <p>Tags: ${photo.tags.join(', ')}</p>
            <p>Published at: ${photo.published_at}</p>
          `;
          // Tambahkan elemen informasi tambahan ke dalam elemen hasil pencarian
          searchResults.appendChild(infoElement);
        });

        // Tambahkan elemen gambar ke dalam elemen hasil pencarian
        searchResults.appendChild(imageElement);
      });
    } else {
      // Tampilkan pesan jika tidak ada hasil pencarian
      searchResults.innerHTML = '<p>No results found.</p>';
    }
  } catch (error) {
    console.error('Error searching photos:', error);
    // Tampilkan pesan kesalahan jika terjadi kesalahan saat melakukan pencarian
    searchResults.innerHTML = '<p>Failed to search photos. Please try again later.</p>';
  }
});
