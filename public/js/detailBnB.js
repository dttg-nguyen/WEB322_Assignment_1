window.onload = function() {
    var uploadRoom = document.querySelector('#uploadRoomForm');
    var signUp = document.querySelector('#signUpForm');
    var logIn = document.querySelector('#logInForm');
    var findModal = document.querySelector('#findModalForm');
    var paymentForm = document.querySelector('#paymentForm');
    var signUpBtn = document.querySelector("#signUpBtn");
   
    uploadRoom.onsubmit = uploadRoomOnSubmit;
    signUp.onsubmit = signUpOnSubmit;
    logIn.onsubmit = logInOnSubmit;
    findModal.onsubmit = findModalOnSubmit;
    paymentForm.onsubmit = paymentFormOnSubmit;
    signUpBtn.onclick = signUpBtnOnClick;
  };
  
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

  function findModalOnSubmit(e) {
    let form = document.querySelector('#findModalForm');
    form.classList.add('was-validated');
  
    if (!form.checkValidity()) {
      e.preventDefault();
    }
  }
  
  function paymentFormOnSubmit(e) {
    let form = document.querySelector('#paymentForm');
    form.classList.add('was-validated');
  
    if (!form.checkValidity()) {
      e.preventDefault();
    }
  }
  
  function signUpBtnOnClick() {
    $("#logIn").removeClass("fade").modal("hide");
    $("#signUp").addClass("fade").modal("show");
  }