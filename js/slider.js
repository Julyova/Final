function makeSlider(slider) { // функция, создающая и запускающая слайдер
    let slides = slider.find('.slide'); // наш набор слайдов
    let slidertimer = null; // идентификатор запущенного таймаута
    let sliderflag = false; // флаг работы анимации
    let time = +slider.data('time'); // здесь храним параметр времени анимации (в данном случае мы его же используем для таймаута, но это не обязательный вариант)
    
    function useSlider(param) { // основная функция слайдера
        if (sliderflag) return; // проверяем флаг (если поднят, дальше не исполняется)
        sliderflag = true; // поднимаем флаг, чтобы повторные вызовы не мешали исполнению
        if (slidertimer) { // сбрасываем таймаут, если он установлен
            clearTimeout(slidertimer);
            slidertimer = null;
        }
        sliderGo(param); // и вызываем функцию анимации слайдера
    }
    function sliderGo(param) { // функция анимации слайдера
        // сохраняем в переменных слайды с классами current, next и prev
        let curr = slider.find('.sliderwindow .current');
        let next = slider.find('.sliderwindow .next');
        let prev = slider.find('.sliderwindow .prev');
        let newtime = time; // делаем отдельное время для текущей анимации
        
        if (typeof param === 'number') { // если параметр при запуске - число, делаем проверки
            let hlp = slides.eq(param);
            if (hlp.hasClass('prev')) { // если число - индекс от prev, действуем, как если бы параметр был 'prev'
                param = 'prev';
            } else if (!hlp.hasClass('next')) { // если число - не индекс от next, подменяем next на указанный слайд.
                hlp.addClass('next');
                next.removeClass('next');
                next = hlp;
            } // иначе действуем, как если бы параметр был 'next'
            newtime /= 4; // если у нас функция вызвана кнопкой, текущая анимация быстрее
        }
        
        // измеряем ширину блока и создаем значение для вызова анимации в зависимости от нашего параметра
        let w = '-=' + curr.width();
        if (param === 'prev') w = '+=' + curr.width();
        
        // запускаем анимации на current, next и prev
        next.css('zIndex', '1').animate({left: w}, newtime, function() { // по окончании анимации делаем дополнительные действия
            if (param === 'prev') {
                next.removeClass('next').css({zIndex: '', left: ''}); // убираем ненужный класс и инлайновые стили
            } else {
                next.addClass('current').removeClass('next').css({zIndex: '', left: ''}); // убираем ненужный класс next и инлайновые стили, добавляем нужный класс
                let idx = slides.index(next); // определяем индекс
                slider.find('.pointers .current').removeClass('current'); // убираем класс current с кнопки, указывающей на предыдущий current
                slider.find('.pointers span').eq(idx).addClass('current'); // добавляем класс current на кнопку, указывающую на новый current
                idx++; // изменяем индекс
                idx %= slides.length; // поправляем на случай выхода за размер коллекции слайдов
                slides.eq(idx).addClass('next'); // присваиваем новый класс next
            }
        });
        prev.css('zIndex', '1').animate({left: w}, newtime, function() { // аналогично next
            if (param === 'prev') {
                prev.addClass('current').removeClass('prev').css({zIndex: '', left: ''});
                let idx = slides.index(prev);
                slider.find('.pointers .current').removeClass('current');
                slider.find('.pointers span').eq(idx).addClass('current');
                idx--;
                if (idx < 0) idx += slides.length;
                slides.eq(idx).addClass('prev');
            } else {
                prev.removeClass('prev').css({zIndex: '', left: ''});
            }
        });
        curr.css('zIndex', '1').animate({left: w}, newtime, function() { // аналогично next
            if (param === 'prev') {
                curr.removeClass('current').addClass('next').css({zIndex: '', left: ''});
            } else {
                curr.removeClass('current').addClass('prev').css({zIndex: '', left: ''});
            }
            slidertimer = setTimeout(function() {useSlider('next')}, time); // вот теперь анимации все точно закончились и можно запускать таймаут
            sliderflag = false; // и наконец можно опустить флаг
        });
    }
    
    slides.each(function() { // создаем кнопки по количеству слайдов
        slider.find('.pointers').append('<span></span>');
    });
    slider.on('click', '.pointers span', function() { // вешаем обработчик для кликов по кнопкам
        if (!$(this).hasClass('current')) { // клик по кнопке, указывающей на текущий current, не обрабатывается
            useSlider(slider.find('.pointers span').index(this)); // вызываем основную функцию с параметром в виде индекса кнопки
        }
    });
    slider.on('click', '.slidercontrols button', function() { // вешаем обработчик на кнопки prev и next
        useSlider(this.className); // вызываем основную функцию с параметром 'prev' или 'next'
    });
    // развешиваем классы current, next и prev
    slides.eq(0).addClass('current');
    slider.find('.pointers span').eq(0).addClass('current');
    slides.eq(1).addClass('next');
    slides.eq(slides.length - 1).addClass('prev');
    // запускаем основную функцию с параметром 'next'
    useSlider('next');
}