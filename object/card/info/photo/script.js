const table = document.querySelector('.table');

let script = '';
fetch(`https://crm.centralnoe.ru/services/learning/course.php?COURSE_ID=7&LESSON_ID=250&LESSON_PATH=228.250`).then((res) => {
  res.text().then(function(text) {
    let parser = new DOMParser();
    let sku_document = parser.parseFromString(text, "text/html");
    let row = sku_document.querySelector('.learn-right-data').innerHTML;
    table.insertAdjacentHTML('beforeend', `${row}`);
    for (let img of table.querySelectorAll(`IMG`)){
      img.removeAttribute('width');
      img.removeAttribute('height');
    }
    for (let a of table.querySelectorAll(`A`)){
      a.remove();
    }
  })
})