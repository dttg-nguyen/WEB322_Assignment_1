export const formValidCheck = (e) => {
  let form = document.getElementById(e.target.id);
  form.classList.add("was-validated");

  if (!form.checkValidity()) {
    e.preventDefault();
  }
}

export const resetForm = (form) => {
  document.getElementById(form).reset();
}
