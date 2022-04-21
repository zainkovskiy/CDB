class Plug {
  init(){
    document.querySelector('.container').insertAdjacentHTML('beforeend', `<div class="wrap">
        <input class="mobile-toggle__input" id="menu__toggle" type="checkbox">
        <label class="mobile-toggle__label" for="menu__toggle">
          <span class="mobile-toggle__span"></span>
        </label>
        <nav class="change-page">
          <a class="ui-btn ui-btn-icon-eye-opened change-page__link" href="../object/?source=${source}&id=${atob(objectUID)}&IDDEAL=${deal}">Объект</a>
          <a class="ui-btn ui-btn-icon-page change-page__link" href="../plug/?source=${source}&id=${objectUID}&IDDEAL=${deal}">ДОУ</a>
          <a class="ui-btn change-page__link" href="../plug/?source=${source}&id=${objectUID}&IDDEAL=${deal}">Фото</a>
          <a class="ui-btn change-page__link" href="../promotion/?source=${source}&id=${objectUID}&IDDEAL=${deal}">Реклама</a>
        </nav>
        <span class="plug__text">
          Теперь данный функционал ДОУ и Фото не доступен из объекта. Для дальнейшей работы объект должен быть привязан к сделке.
        </span>
        <img class="plug__img" src="../img/image.png" alt="photo">
        <img class="plug__img" src="../img/deaPhotol.png" alt="photo">
        <span class="plug__manual">Инструкции:</span>
        <a class="plug__link" download="Как привязать сделку к объекту" href="files/bind.docx">Как привязать сделку к объекту</a>
        <a class="plug__link" download="Как работать с новым ДОУ" href="files/dou.docx">Как работать с новым ДОУ</a>
        <a class="plug__link" download="Как работать с новым Фото" href="files/photo.docx">Как работать с новым Фото</a>
      </div>`)
  }
}

new Plug().init();