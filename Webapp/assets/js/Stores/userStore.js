/*Utilities file*/
function userStore() {

    this.apiUrl = "http://localhost:8080/api/users/";

    this.getAll = () => {
      return $.ajax({
        url: this.apiUrl,
        type: 'GET'
      });
    }

    this.getById = (id) => {
      return $.ajax({
        url: this.apiUrl + id,
        type: 'GET'
      });
    }

    this.post = (user) => {
      return $.ajax({
        url: this.apiUrl,
        type: 'POST',
        accepts: 'application/json',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(user)
      });
    }

    this.put = (id, user) => {
      return $.ajax({
        url: this.apiUrl + id,
        type: 'PUT',
        accepts: 'application/json',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(user)
      });
    }

    this.delete = (id) => {
      return $.ajax({
        url: this.apiUrl + id,
        type: 'DELETE',
        accepts: 'application/json',
        contentType: 'application/json',
        dataType: 'json'
      });
    }
}
