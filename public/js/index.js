window.onload = function() {
    var findPlace = document.querySelector('#findPlaceForm');
    var uploadRoom = document.querySelector('#uploadRoomForm');
    var signUp = document.querySelector('#signUpForm');
    var logIn = document.querySelector('#logInForm');
    var signUpBtn = document.querySelector("#signUpBtn");
   
    findPlace.onsubmit = findPlaceOnSubmit;
    uploadRoom.onsubmit = uploadRoomOnSubmit;
    signUp.onsubmit = signUpOnSubmit;
    logIn.onsubmit = logInOnSubmit;
    signUpBtn.onclick = signUpBtnOnClick;
  };
  
  function findPlaceOnSubmit(e) {
    let form = document.querySelector('#findPlaceForm');
    form.classList.add('was-validated');
  
    if (!form.checkValidity()) {
      e.preventDefault();
    }
  }

  function uploadRoomOnSubmit(e) {
    let form = document.querySelector('#uploadRoomForm');
    form.classList.add('was-validated');
  
    if (!form.checkValidity()) {
      e.preventDefault();
    }
  }

  function signUpOnSubmit(e) {
    let form = document.querySelector('#signUpForm');
    form.classList.add('was-validated');
  
    if (!form.checkValidity()) {
      e.preventDefault();
    }
  }

  function logInOnSubmit(e) {
    let form = document.querySelector('#logInForm');
    form.classList.add('was-validated');
  
    if (!form.checkValidity()) {
      e.preventDefault();
    }
  }

  function signUpBtnOnClick() {
    $("#logIn").removeClass("fade").modal("hide");
    $("#signUp").addClass("fade").modal("show");
  }