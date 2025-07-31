const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const snapButton = document.getElementById('snap');
const photosDiv = document.getElementById('photos');

// Mengakses webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error("Error accessing webcam: ", err);
    });

// Fungsi untuk mengambil foto
function takePhoto() {
    const photoWidth = 400; // Lebar foto
    const photoHeight = 300; // Tinggi foto
    canvas.width = photoWidth;
    canvas.height = photoHeight;
    context.drawImage(video, 0, 0, photoWidth, photoHeight);
    
    const img = document.createElement('img');
    img.src = canvas.toDataURL('image/png');
    img.classList.add('photo');
    img.style.cursor = 'pointer'; // Menambahkan kursor pointer
    img.addEventListener('click', () => editPhoto(img.src)); // Menambahkan event click untuk edit

    // Membuat tombol simpan
    const downloadLink = document.createElement('a');
    downloadLink.href = img.src;
    downloadLink.download = 'photo.png'; // Nama file yang akan diunduh
    downloadLink.innerText = 'Simpan Foto';
    downloadLink.classList.add('download-button');

    // Menambahkan foto dan tombol simpan ke div
    const photoContainer = document.createElement('div');
    photoContainer.appendChild(img);
    photoContainer.appendChild(downloadLink);
    photosDiv.appendChild(photoContainer);
}

// Fungsi untuk mengedit foto
function editPhoto(src) {
    // Membuka foto dalam modal atau jendela baru untuk diedit
    const editWindow = window.open('', '_blank');
    editWindow.document.write(`
        <html>
            <head>
                <title>Edit Foto</title>
                <style>
                    body { display: flex; justify-content: center; align-items: center; height: 100vh; }
                    img { max-width: 100%; height: auto; }
                </style>
            </head>
            <body>
                <img src="${src}" id="editImage">
                <button id="saveButton">Simpan</button>
                <script>
                    document.getElementById('saveButton').addEventListener('click', function() {
                        const link = document.createElement('a');
                        link.href = '${src}';
                        link.download = 'edited_photo.png';
                        link.click();
                    });
                </script>
            </body>
        </html>
    `);
}

// Menambahkan event listener untuk tombol snap
snapButton.addEventListener('click', takePhoto);