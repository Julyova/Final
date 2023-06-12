function getCurrency1() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.cbr-xml-daily.ru/daily_json.js');
    xhr.onreadystatechange = function() {
        if ((xhr.readyState == 4) && (xhr.status == 200)) {
            $('#currency1').html(JSON.parse(xhr.response).Valute.USD.Value.toFixed(2) + ' рублей за доллар');
        }
    };
    xhr.send();
}
function getCurrency2() {
    $.get('https://www.cbr-xml-daily.ru/daily_json.js', function(response){
        $('#currency2').html(JSON.parse(response).Valute.EUR.Value.toFixed(2) + ' рублей за евро');
    });
}
function getCurrency3() {
    fetch("https://www.cbr-xml-daily.ru/daily_json.js").then(response => response.json()).then(response => $('#currency3').html(response.Valute.CNY.Value.toFixed(2) + ' рублей за юань'));
}