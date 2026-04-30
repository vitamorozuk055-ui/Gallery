const gallery = document.querySelector('.gallery');
const links = Array.from(gallery.querySelectorAll('a'));
const imageUrls = links.map(link => link.href);


let instance = null;
let currentIndex = 0;

function updateLightbox(newIndex){
    if(!instance || !instance.element()) return;

    if(newIndex < 0) {
        newIndex = imageUrls.length - 1;
    } else if(newIndex >= imageUrls.length) {
        newIndex = 0;
    }

    currentIndex = newIndex;

    const imgElement = instance.element().querySelector('.lightbox-image');
    if(imgElement){
        imgElement.src = imageUrls[currentIndex];
    }
}


function createLightbox(index) {
    currentIndex = index;

    // Створюємо розмітку для Lightbox: зображення + навігаційні кнопки
    const lightboxContent = `
        <div style="position: relative;">
            <img class="lightbox-image" src="${imageUrls[currentIndex]}" alt="Галерея" style="max-width: 90vw; max-height: 90vh; display: block;">
            
            <button type="button" class="lightbox-btn prev-btn" data-action="prev">
                &lsaquo;
            </button>
            
            <button type="button" class="lightbox-btn next-btn" data-action="next">
                &rsaquo;
            </button>
        </div>
    `;

    // Створюємо новий екземпляр BasicLightbox
    instance = basicLightbox.create(lightboxContent, {
        onShow: (instance) => {
            // Додаємо слухачі подій для клавіатури та кнопок після відкриття
            document.addEventListener('keydown', onKeydown);
            instance.element().querySelector('.prev-btn').addEventListener('click', onNavButtonClick);
            instance.element().querySelector('.next-btn').addEventListener('click', onNavButtonClick);
        },
        onClose: (instance) => {
            // Видаляємо слухачі подій після закриття
            document.removeEventListener('keydown', onKeydown);
            instance.element().querySelector('.prev-btn').removeEventListener('click', onNavButtonClick);
            instance.element().querySelector('.next-btn').removeEventListener('click', onNavButtonClick);
        }
    });

    instance.show();
}



gallery.addEventListener('click', (e) => {
    e.preventDefault();

    const link = e.target.closest('a');
    if(!link) return;

    const index = parseInt(link.dataset.index);
    createLightbox(index);
});

function onNavButtonClick(e){
    const action = e.currentTarget.dataset.action;

    if(action === 'prev'){
        updateLightbox(currentIndex - 1);
    } else if(action === 'next') {
        updateLightbox(currentIndex + 1);
    }
}



function onKeydown(e){
    if (!instance.visible()) return;

    if(e.key === 'ArrowLeft'){
        updateLightbox(currentIndex - 1);
    } else if(e.key === 'ArrowRight') {
        updateLightbox(currentIndex + 1);
    }
}