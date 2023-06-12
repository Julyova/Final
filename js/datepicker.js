
/*
 * Функция создает дейтпикер в попапе, появляющийся и исчезающий по клику на элементе из jquery-набора point.
 * При закрытии дейтпикера выбранная дата помещается в поле ввода field.
 * Для попапа используем утилиту getModalWindow из main.js.
 */
function makeDatepicker(point, field) {
    let today = new Date(); // сегодня
    let selectedday; // эта переменная должна быть более глобальной, чем наши функции, чтобы они получили ее в области видимости
    const monthname = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']; // русские названия месяцев
    
    function showDatepicker() { // создаем попап, делаем в нем вкладыш и туда отрисовываем наш дейтпикер, используя выбранный день
        selectedday = new Date(field.val() ? field.val() : Date.now()); // выбранный день из поля ввода. если там пусто - сегодня
        getModalWindow('dp_popup');
        $('#dp_popup').append('<div></div>');
        renderDatepicker(selectedday.getMonth(), selectedday.getFullYear());
    }
    function dropDatepicker() { // записываем выбранный день в поле ввода и убираем дейтпикер вместе с попапом
        field.val(`${selectedday.getFullYear()}-${addZero(selectedday.getMonth() + 1)}-${addZero(selectedday.getDate())}`);
        dropModalWindow();
    }
    function renderDatepicker(month, year) {
        // определяем месяц и год для кнопки "на месяц назад"
        let mprev = month - 1;
        let yprev = year;
        if (mprev < 0) {
            mprev += 12;
            yprev--;
        };
        // определяем месяц и год для кнопки "на месяц вперед"
        let mnext = month + 1;
        let ynext = year;
        if (mnext > 11) {
            mnext -= 12;
            ynext++;
        }
        let prevdays = (new Date(year, month, 1).getDay() + 6) % 7; // количество дней в первой неделе до 1 числа
        let days = new Date(year, month + 1, 0).getDate(); // количество дней в текущем месяцев
        let weeks = Math.ceil((prevdays + days) / 7); // количество недель, считая неполные, в текущем месяце
        // собираем HTML-строку с версткой календаря
        let hlpstr = '<table><tr class="dp_header"><th><</th><th colspan="5">';
        hlpstr += monthname[month] + ' ' + year;
        hlpstr += '</th><th>></th></th></tr><tr class="dp_week"><th>Пн</th><th>Вт</th><th>Ср</th><th>Чт</th><th>Пт</th><th>Сб</th><th>Вс</th></tr>';
        // для недель рисуем циклом строки tr
        for (let i = 0; i < weeks; i++) {
            // начинаем разметку строки
            hlpstr += '<tr>';
            // для дней в неделе рисуем циклом ячейки td
            for (let j = 1; j < 8; j++) {
                let idx = i * 7 + j;
                if ((idx <= prevdays) || (idx > (prevdays + days))) { // если день не входит в текущий месяц
                    hlpstr += '<td class="dp_out"></td>';
                } else { // если день входит в текущий месяц
                    // начинаем разметку ячейки
                    hlpstr += '<td class="dp_range';
                    // проверяем, соответствует ли данный день нашему выбранному дню
                    if ((selectedday.getFullYear() == year) && (selectedday.getMonth() == month) && (selectedday.getDate() == idx - prevdays)) hlpstr +=' selectedday';
                    // проверяем, соответствует ли данный день сегодня
                    if ((today.getFullYear() == year) && (today.getMonth() == month) && (today.getDate() == idx - prevdays)) hlpstr +=' today';
                    // проверяем, соответствует ли данный день 12 июня (ежегодная дата, поэтому год не проверяем)
                    if ((month == 5) && (idx - prevdays == 12)) hlpstr +=' holiday';
                    // проверяем, соответствует ли данный день субботе или воскресенью
                    if ((j == 6) || (j == 7)) hlpstr +=' weekend';
                    // закрываем открывающий тег ячейки
                    hlpstr += '">';
                    // вставляем дату
                    hlpstr += idx - prevdays;
                    // завершаем разметку ячейки
                    hlpstr += '</td>';
                }
            }
            // завершаем разметку строки
            hlpstr += '</tr>';
        }
        // добавляем строку кнопок с фиксированными датами для быстрого выбора
        hlpstr += '<tr class="dp_fix"><th colspan="2">Сегодня</th><th colspan="3"></th><th colspan="2">' + '13.06.2023' + '</th></tr>';
        // завершаем верстку календаря в строке
        hlpstr += '</table>';
        // вставляем HTML-строку во вкладыш для календаря в попапе, уничтожая его предыдущее содержимое
        $('#dp_popup > div').html(hlpstr);
        // цепляем обработчики клика на кнопки "на месяц назад" и "на месяц вперед"
        $('.dp_header th:first-child').on('click', () => renderDatepicker(mprev, yprev));
        $('.dp_header th:last-child').on('click', () => renderDatepicker(mnext, ynext));
        // цепляем обработчики клика на кнопки быстрого выбора и ячейки с днями месяца
        $('.dp_fix th:first-child').on('click', function() { // фиксируем выбранную дату и вызываем функцию уборки дейтпикера
            selectedday = today;
            dropDatepicker();
        });
        $('.dp_fix th:last-child').on('click', function() { // фиксируем выбранную дату и вызываем функцию уборки дейтпикера
            selectedday = new Date();
            dropDatepicker();
        });
        $('.dp_range').on('click', function() { // фиксируем выбранную дату и вызываем функцию уборки дейтпикера
            selectedday = new Date(year, month, this.innerHTML);
            dropDatepicker();
        });
    }
    
    point.on('click', showDatepicker); // по клику на кнопке или поле ввода поднимаем и убираем дейтпикер
}
