function makeGallery(gallery) { // функция, подключающая галерею. аргумент - галерея, обернутая в jQuery
    let galflag = false;
    let imgs = gallery.find('img'); // кладем в переменную все картинки галереи
    // измеряем ширину картинки с учетом отступов и границ - это шаг галереи
    let step = imgs.eq(0).width() + parseFloat(imgs.eq(0).css('borderLeftWidth')) + parseFloat(imgs.eq(0).css('borderRightWidth')) + parseFloat(imgs.eq(0).css('marginLeft')) + parseFloat(imgs.eq(0).css('marginRight'));
    // прописываем рельсу ширину, равную сумме всех ширин картинок на нем
    gallery.find('.gal_rail').css('width', step * imgs.length + 'px');
    // проверяем, есть ли что вообще крутить
    if (gallery.find('.gal_rail').width() - gallery.find('.gal_window').width() >= step) { // если есть, подключаем кнопки "влево" и "вправо"
        gallery.find('.gal_btn').on('click', function() {
            if (!$(this).hasClass('disabled')) {
                galleryMove(this);
            }
        });
    } else { // а если нет, выключаем кнопки
        gallery.find('.gal_btn').addClass('disabled');
    }
    imgs.on('click', function() { // подключаем переключение главной картинки по клику на маленькую картинку в галерее
        galleryItemShow(this);
    })
    
    function galleryMove(btn) { // функция движения галереи влево и вправо
        if (galflag) return;
        galflag = true;
        let sign = '+=';
        if ($(btn).hasClass('right')) sign = '-='; // определяемся с направлением движения
        gallery.find('.gal_rail').animate({left: sign + step}, 500, function() { // крутим галерею, после чего меняем кнопки disabled
            gallery.find('.gal_btn.disabled').removeClass('disabled');
            if (gallery.find('.gal_rail').position().left == 0) {
                gallery.find('.gal_btn.left').addClass('disabled');
            } else if (gallery.find('.gal_rail').width() + gallery.find('.gal_rail').position().left - gallery.find('.gal_window').width() < step) {
                gallery.find('.gal_btn.right').addClass('disabled');
            }
            galflag = false;
        });
    }
}

function galleryItemShow(item) { // функция переключения главной картинки по клику на маленькую картинку в галерее
    //$('.mainimagedesk img').attr('src', item.dataset.image);
    $('.mainimagedesk img').attr('src', item.src.replace('_small.', '_mid.'));
}