// megambil data foto dari api
export async function getPhotos() {
  const API_URL = 'http://128.199.167.159/v1/idc/photos'; // Ganti dengan URL API Anda
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (data && data.code === 200 && data.status === 'success') {
      return data.data; // Mengembalikan data foto jika berhasil
    } else {
      console.error('Gagal mendapatkan data foto:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return null;
  }
}

// menambah data
export async function createPhoto(photoData) {
  const API_URL = 'http://128.199.167.159/v1/idc/photo'; // Ganti dengan URL API Anda
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(photoData),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return { code: 500, status: 'error', message: 'Terjadi kesalahan pada server.' };
  }
}

// Fungsi untuk menghitung total data galeri foto
export async function countPhotos() {
  const API_URL = 'http://128.199.167.159/v1/idc/photos/count'; // Ganti dengan URL API yang sesuai

  try {
    // Lakukan permintaan HTTP GET ke endpoint untuk menghitung total data galeri foto
    const response = await fetch(API_URL);

    // Periksa apakah responsenya valid
    if (response.ok) {
      // Jika respons valid, kembalikan data dari respons
      return await response.json();
    } else {
      // Jika respons tidak valid, lemparkan kesalahan dengan pesan yang sesuai
      throw new Error('Gagal menghitung data foto: ' + response.statusText);
    }
  } catch (error) {
    // Tangani kesalahan jika terjadi kesalahan saat melakukan permintaan API
    console.error('Terjadi kesalahan:', error);
    // Kembalikan objek dengan informasi kesalahan
    return { code: 500, status: 'error', message: 'Terjadi kesalahan pada server.' };
  }
}

// Mengambil data galeri foto berdasarkan ID
export async function getPhotoById(photoId) {
  const API_URL = `http://128.199.167.159/v1/idc/photo/${photoId}`; // Ganti dengan URL API yang sesuai

  try {
    const response = await fetch(API_URL);

    if (response.ok) {
      return await response.json(); // Mengembalikan data foto jika berhasil
    } else {
      throw new Error('Gagal mengambil data foto: ' + response.statusText);
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return null;
  }
}

// Menghapus data foto berdasarkan ID
export async function deletePhotoById(photoId) {
  const API_URL = `http://128.199.167.159/v1/idc/photo/${photoId}/delete`; // Ganti dengan URL API yang sesuai

  try {
    const response = await fetch(API_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok && data.code === 200 && data.status === 'success') {
      console.log('Foto berhasil dihapus:', data.message);
      return true; // Kembalikan true jika penghapusan berhasil
    } else {
      console.error('Gagal menghapus foto:', data.message);
      return false; // Kembalikan false jika terjadi kesalahan
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return false; // Kembalikan false jika terjadi kesalahan
  }
}
// api.js

// Fungsi untuk mengedit data foto berdasarkan ID
export async function editPhotoById(photoId, updatedPhotoData) {
  try {
    const response = await fetch(`http://128.199.167.159/v1/idc/photo/${photoId}/edit`, {
      method: 'PUT', // atau 'PATCH' tergantung pada preferensi Anda dan dukungan dari API
      headers: {
        'Content-Type': 'application/json',
        // Jika diperlukan, tambahkan header otorisasi di sini
        // 'Authorization': 'Bearer yourAccessToken'
      },
      body: JSON.stringify(updatedPhotoData),
    });

    // Parse response JSON
    const responseData = await response.json();

    // Return response data
    return responseData;
  } catch (error) {
    // Tangani kesalahan jika terjadi kesalahan pada saat mengirim permintaan
    console.error('Error editing photo:', error);
    throw error;
  }
}
