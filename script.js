document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const uploadedImagesContainer = document.getElementById('uploadedImages');

    let uploadedImages = []; // Armazena os elementos de imagem carregados
    let uploadedImageHashes = new Set(); // Armazena os hashes das imagens para evitar duplicatas
    let lastSelectedImage = null; // Armazena a última imagem selecionada para troca

    // Adiciona o evento de mudança para lidar com o carregamento de arquivos
    imageUpload.addEventListener('change', function(event) {
        Array.from(event.target.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const hash = getHashFromString(e.target.result);
                if (uploadedImageHashes.has(hash)) {
                    console.log('Imagem duplicada bloqueada'); // Log de duplicata
                    return; // Previne a adição de imagens duplicadas
                }

                uploadedImageHashes.add(hash); // Registra o hash da nova imagem

                // Cria e adiciona a nova imagem ao contêiner
                const imgElement = document.createElement('img');
                imgElement.src = e.target.result;
                imgElement.addEventListener('click', () => selectImage(imgElement));
                uploadedImagesContainer.appendChild(imgElement);
                uploadedImages.push(imgElement);
            };
            reader.readAsDataURL(file);
        });
    });

    // Função para selecionar uma imagem para a troca
    function selectImage(imgElement) {
        if (lastSelectedImage && lastSelectedImage !== imgElement) {
            swapImages(imgElement, lastSelectedImage);
            lastSelectedImage.classList.remove('selected');
            lastSelectedImage = null;
        } else if (!imgElement.classList.contains('selected')) {
            imgElement.classList.add('selected');
            lastSelectedImage = imgElement;
        } else {
            imgElement.classList.remove('selected');
            lastSelectedImage = null;
        }
    }

    // Função para trocar duas imagens no array e no DOM
    function swapImages(img1, img2) {
        const index1 = uploadedImages.indexOf(img1);
        const index2 = uploadedImages.indexOf(img2);
        [uploadedImages[index1], uploadedImages[index2]] = [uploadedImages[index2], uploadedImages[index1]];
        uploadedImagesContainer.insertBefore(img2, img1);
        uploadedImagesContainer.insertBefore(img1, uploadedImages[index2 + 1] || null);
    }

    // Função para gerar um hash simples de uma string
    function getHashFromString(string) {
        let hash = 0, i, chr;
        for (i = 0; i < string.length; i++) {
            chr = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Converte para 32-bit inteiro
        }
        return hash;
    }
});